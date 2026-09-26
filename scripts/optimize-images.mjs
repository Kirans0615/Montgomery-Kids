#!/usr/bin/env node
/**
 * Image optimization pipeline for 4Montgomery's Kids.
 *
 * For every raster image in public/images/ that is used as a responsive
 * <Img> source, generates .webp variants at widths 480/960/1600 into
 * public/images/opt/<basename>-<width>.webp, never upscaling past the
 * original width (a width larger than the source is skipped and logged).
 *
 * Also emits a single 1x .webp (no width suffix) for logo-lockup.png, and
 * composes public/og/og-default.jpg (1200x630) from kids-writing-desks.jpg
 * + the logo-lockup mark on a paper-colored rounded chip.
 *
 * Run via `npm run prebuild` (wired in package.json) or directly:
 *   node scripts/optimize-images.mjs
 */
import { existsSync } from "node:fs";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const IMAGES_DIR = path.join(ROOT, "public", "images");
const OPT_DIR = path.join(IMAGES_DIR, "opt");
const OG_DIR = path.join(ROOT, "public", "og");

const WIDTHS = [480, 960, 1600];

// Every raster image used as a responsive <Img> source per the Task 2
// mapping table (board-*, partner-*, and the named photo files).
const RESPONSIVE_BASENAMES = [
  "kids-writing-desks.jpg",
  "double-dutch.jpg",
  "dance-recital.jpg",
  "tug-of-war.jpg",
  "graduate.jpg",
  "bike-ride.jpg",
  "teen-driver-smiling.jpg",
  "young-woman-driving.jpg",
  "peewee-football.jpg",
  "toddler-blocks.jpg",
  "summer-camp-scouts.jpg",
  "high-school-classroom.jpg",
  "board-leslie-shedlin.jpg",
  "board-agnes-leshner.jpg",
  "board-ronna-cook.jpg",
  "board-alan-kraut.jpg",
  "board-cynde-burgess.jpg",
  "partner-100-who-care.png",
  "partner-st-annes.png",
  "partner-women-who-care-lower-moco.png",
  "partner-nora-roberts.png",
  "partner-hif.png",
];

const LOGO_LOCKUP = "logo-lockup.png";

/**
 * Palette "paper" color used for the footer chip / OG chip background.
 * Must match the `paper` token in tailwind.config.ts (not imported directly
 * to keep this script dependency-free of the TS/Tailwind toolchain).
 */
const PAPER_COLOR = "#FFFDF7";

async function generateResponsiveVariants() {
  await mkdir(OPT_DIR, { recursive: true });

  for (const basename of RESPONSIVE_BASENAMES) {
    const srcPath = path.join(IMAGES_DIR, basename);
    if (!existsSync(srcPath)) {
      console.warn(`[optimize-images] SKIP missing source: ${basename}`);
      continue;
    }

    const ext = path.extname(basename);
    const stem = path.basename(basename, ext);
    const metadata = await sharp(srcPath).metadata();
    const originalWidth = metadata.width ?? 0;

    for (const width of WIDTHS) {
      const outPath = path.join(OPT_DIR, `${stem}-${width}.webp`);

      if (width > originalWidth) {
        console.log(
          `[optimize-images] skip ${stem}-${width}.webp (source is only ${originalWidth}px wide)`
        );
        continue;
      }

      await sharp(srcPath)
        .resize({ width, withoutEnlargement: true })
        .webp({ quality: 82 })
        .toFile(outPath);

      console.log(`[optimize-images] wrote ${path.relative(ROOT, outPath)}`);
    }
  }
}

async function generateLogoWebp() {
  const srcPath = path.join(IMAGES_DIR, LOGO_LOCKUP);
  if (!existsSync(srcPath)) {
    console.warn(`[optimize-images] SKIP missing source: ${LOGO_LOCKUP}`);
    return;
  }
  const stem = path.basename(LOGO_LOCKUP, path.extname(LOGO_LOCKUP));
  const outPath = path.join(OPT_DIR, `${stem}.webp`);
  await sharp(srcPath).webp({ quality: 90 }).toFile(outPath);
  console.log(`[optimize-images] wrote ${path.relative(ROOT, outPath)}`);
}

/**
 * Compose public/og/og-default.jpg (1200x630): kids-writing-desks.jpg
 * cover-cropped to 1200x630, with the logo-lockup mark placed bottom-left
 * on a small paper-colored rounded chip.
 */
async function generateOgImage() {
  await mkdir(OG_DIR, { recursive: true });

  const bgPath = path.join(IMAGES_DIR, "kids-writing-desks.jpg");
  const logoPath = path.join(IMAGES_DIR, LOGO_LOCKUP);
  const outPath = path.join(OG_DIR, "og-default.jpg");

  if (!existsSync(bgPath) || !existsSync(logoPath)) {
    console.warn("[optimize-images] SKIP og-default.jpg: missing source image(s)");
    return;
  }

  const OG_WIDTH = 1200;
  const OG_HEIGHT = 630;

  const background = await sharp(bgPath)
    .resize({
      width: OG_WIDTH,
      height: OG_HEIGHT,
      fit: "cover",
      position: "attention",
    })
    .toBuffer();

  // Logo mark, sized to fit the chip with padding.
  const logoWidth = 360;
  const logo = await sharp(logoPath)
    .resize({ width: logoWidth })
    .toBuffer();
  const logoMeta = await sharp(logo).metadata();
  const logoHeight = logoMeta.height ?? Math.round((226 / 800) * logoWidth);

  const chipPaddingX = 28;
  const chipPaddingY = 20;
  const chipWidth = logoWidth + chipPaddingX * 2;
  const chipHeight = logoHeight + chipPaddingY * 2;
  const chipRadius = 20;

  const chipSvg = Buffer.from(
    `<svg width="${chipWidth}" height="${chipHeight}" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="${chipWidth}" height="${chipHeight}" rx="${chipRadius}" ry="${chipRadius}" fill="${PAPER_COLOR}" />
    </svg>`
  );

  const marginX = 48;
  const marginY = 48;
  const chipLeft = marginX;
  const chipTop = OG_HEIGHT - chipHeight - marginY;

  await sharp(background)
    .composite([
      { input: chipSvg, left: chipLeft, top: chipTop },
      {
        input: logo,
        left: chipLeft + chipPaddingX,
        top: chipTop + chipPaddingY,
      },
    ])
    .jpeg({ quality: 88 })
    .toFile(outPath);

  console.log(`[optimize-images] wrote ${path.relative(ROOT, outPath)} (${OG_WIDTH}x${OG_HEIGHT})`);
}

async function main() {
  await generateResponsiveVariants();
  await generateLogoWebp();
  await generateOgImage();
}

main().catch((err) => {
  console.error("[optimize-images] failed:", err);
  process.exitCode = 1;
});
