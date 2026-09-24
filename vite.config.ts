import path from "node:path";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";

const dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * The production deploy (Cloudflare Pages/Vercel, the real
 * 4montgomeryskids.org domain) always serves from "/". The GitHub Pages
 * demo lives at a project subpath instead (github.io/<repo>/), so every
 * asset reference — Vite's own script/link injection, and every
 * hand-written `publicUrl(...)` call in src/ — needs that prefix. Gated
 * behind an env var set only by .github/workflows/gh-pages.yml so the real
 * build is completely unaffected.
 */
const GH_PAGES = process.env.GH_PAGES === "true";
const BASE = GH_PAGES ? "/Montgomery-Kids/" : "/";

// https://vite.dev/config/
/**
 * Inlines the built stylesheet into index.html and drops the `<link>` that
 * pointed at it.
 *
 * The app's CSS is 64 kB raw but only ~11 kB gzipped, and as an external
 * `<link rel="stylesheet">` it was the last render-blocking request on the
 * page — Lighthouse costed it at 154 ms on a throttled mobile profile, an
 * extra round trip before a single pixel can be painted. Inlining trades
 * that round trip for ~11 kB more in the HTML response, which is already on
 * the critical path.
 *
 * Deliberately conservative: it only fires when exactly one CSS asset was
 * emitted (true for this build — `cssCodeSplit` produces one file because
 * every route imports the same Tailwind entry), and otherwise leaves the
 * HTML completely alone rather than guessing.
 */
function inlineCriticalCss(): Plugin {
  return {
    name: "inline-critical-css",
    apply: "build",
    enforce: "post",
    // Runs in `generateBundle` (not `transformIndexHtml`) so that both the
    // finished HTML asset and the finished CSS asset are already in the
    // bundle: Vite applies `transformIndexHtml` while the CSS chunk is still
    // being emitted, so a hook there sees an empty stylesheet.
    generateBundle(_options, bundle) {
      const cssAssets = Object.values(bundle).filter(
        (chunk) => chunk.type === "asset" && chunk.fileName.endsWith(".css"),
      );
      const htmlAsset = bundle["index.html"];
      if (cssAssets.length !== 1 || !htmlAsset || htmlAsset.type !== "asset") return;

      const cssAsset = cssAssets[0];
      if (cssAsset.type !== "asset") return;

      const css =
        typeof cssAsset.source === "string"
          ? cssAsset.source
          : Buffer.from(cssAsset.source).toString("utf8");
      const html =
        typeof htmlAsset.source === "string"
          ? htmlAsset.source
          : Buffer.from(htmlAsset.source).toString("utf8");

      const escaped = cssAsset.fileName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const linkPattern = new RegExp(`\\s*<link[^>]+href="/?${escaped}"[^>]*>`, "g");
      if (!linkPattern.test(html)) return;

      htmlAsset.source = html
        .replace(new RegExp(linkPattern.source, "g"), "")
        .replace("</head>", `  <style>${css}</style>\n  </head>`);

      // The stylesheet file itself stays in `dist/` — a few kB of deploy
      // artifact, and it keeps any direct reference to it resolving.
    },
  };
}

/**
 * Which route file serves which URL. Used to emit a per-path
 * `<link rel="modulepreload">` for the lazily-imported route chunk.
 *
 * Kept in the same order React Router resolves them; the `/:year/:month/:slug`
 * blog-post pattern is the loosest, so it is matched last. Home is absent
 * because it is imported eagerly and already modulepreloaded.
 */
const ROUTE_MODULES: Array<{ test: string; module: string }> = [
  { test: "^/about-us/?$|^/overview/?$", module: "src/routes/About.tsx" },
  { test: "^/our-stories/?$", module: "src/routes/Stories.tsx" },
  { test: "^/programs/?$", module: "src/routes/Programs.tsx" },
  { test: "^/blog/?$", module: "src/routes/Blog.tsx" },
  { test: "^/\\d{4}/\\d{2}/[^/]+/?$", module: "src/routes/Post.tsx" },
];

/**
 * Emits a tiny inline script that preloads the route chunk for the URL being
 * requested.
 *
 * Every route but Home is `React.lazy` (see src/App.tsx), which is what keeps
 * the entry chunk small — but it also means a visitor landing directly on,
 * say, /our-stories waits for two serialized waves of JavaScript: the entry
 * chunk, and only once that has parsed and started rendering, the route
 * chunk. Lighthouse measured that as a 4.2s Largest Contentful Paint on
 * mobile that was 100% "render delay", against 2.9s for About and 3.4s for
 * Home.
 *
 * The SPA rewrite means every URL is served the same index.html, so the
 * preload can't be a static `<link>`. Instead this injects a path→chunk map
 * (built from the real content-hashed filenames) plus ~200 bytes of script
 * that matches `location.pathname` and appends the matching
 * `<link rel="modulepreload">` before the entry script has even been fetched.
 * The route chunk then downloads in parallel with the entry instead of after
 * it.
 *
 * Each entry includes the chunk's own static imports (e.g. the shared posts
 * data chunk that Blog and Post both pull in), since those are on the same
 * critical path. If anything doesn't match, nothing is preloaded and the app
 * behaves exactly as before — this is a hint, never a requirement.
 */
function preloadRouteChunks(): Plugin {
  let base = "/";
  return {
    name: "preload-route-chunks",
    apply: "build",
    enforce: "post",
    configResolved(config) {
      base = config.base;
    },
    generateBundle(_options, bundle) {
      const htmlAsset = bundle["index.html"];
      if (!htmlAsset || htmlAsset.type !== "asset") return;

      const htmlSource =
        typeof htmlAsset.source === "string"
          ? htmlAsset.source
          : Buffer.from(htmlAsset.source).toString("utf8");

      const entries: Array<[string, string[]]> = [];
      for (const { test, module } of ROUTE_MODULES) {
        const chunk = Object.values(bundle).find(
          (c) => c.type === "chunk" && c.facadeModuleId?.endsWith(module.replace(/\//g, path.sep)),
        );
        if (!chunk || chunk.type !== "chunk") continue;
        // Skip anything index.html already links (the entry chunk and the
        // react/motion vendor chunks it modulepreloads) — preloading those a
        // second time only adds markup.
        const files = [chunk.fileName, ...chunk.imports].filter((f) => !htmlSource.includes(f));
        if (files.length > 0) entries.push([test, files]);
      }
      if (entries.length === 0) return;

      const script =
        `<script>(function(){var m=${JSON.stringify(entries)},b=${JSON.stringify(base)},p=location.pathname;` +
        `for(var i=0;i<m.length;i++){if(new RegExp(m[i][0]).test(p)){` +
        `m[i][1].forEach(function(f){var l=document.createElement("link");` +
        `l.rel="modulepreload";l.crossOrigin="";l.href=b+f;document.head.appendChild(l);});break;}}})();</script>`;

      htmlAsset.source = htmlSource.replace("</head>", `  ${script}\n  </head>`);
    },
  };
}

export default defineConfig({
  base: BASE,
  plugins: [react(), preloadRouteChunks(), inlineCriticalCss()],
  resolve: {
    alias: {
      "@": path.resolve(dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        /**
         * Split the three big third-party animation/runtime libraries out of
         * the entry chunk. Route-level `React.lazy` (see src/App.tsx) already
         * moves page code and content data off the critical path; this splits
         * the remaining vendor weight so a change to site code doesn't
         * invalidate the vendor bytes in visitors' caches, and so the browser
         * can fetch and parse them in parallel rather than as one 1.5 MB
         * blob. GSAP and Lenis aren't listed because they're no longer static
         * imports at all — `src/lib/gsap.ts` and `SmoothScroll.tsx` load them
         * dynamically, so Rollup already gives them their own chunks and,
         * crucially, Vite doesn't emit a `<link rel="modulepreload">` for
         * them in index.html.
         */
        manualChunks: {
          react: ["react", "react-dom", "react-router-dom"],
          motion: ["framer-motion"],
        },
      },
    },
  },
});
