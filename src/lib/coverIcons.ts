import {
  Award,
  Briefcase,
  Car,
  Dumbbell,
  Flower2,
  Gift,
  GraduationCap,
  HeartHandshake,
  KeyRound,
  Landmark,
  Laptop,
  type LucideIcon,
  PawPrint,
  PiggyBank,
  Scissors,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  Sun,
  Tablet,
  Tent,
  TrendingUp,
  Users,
  UtensilsCrossed,
  Wallet,
} from "lucide-react";

/**
 * Every icon that `src/data/*.ts` can name for an `IllustratedCover`, as an
 * explicit, tree-shakeable map.
 *
 * Three components used to resolve these with `import * as LucideIcons from
 * "lucide-react"` and a dynamic `icons[name]` lookup. That reads well, but a
 * namespace import plus a computed property access is opaque to every
 * bundler: Rollup can't prove which exports are unused, so it keeps the
 * *entire* icon set. It was the single biggest thing in the production
 * bundle — removing it took `dist/assets/index-*.js` from 1,536 kB (453 kB
 * gzip) down to 660 kB (206 kB gzip) with no behaviour change, and was the
 * largest single contributor to the 6.7s first paint measured in Task 15's
 * first Lighthouse run.
 *
 * Adding a new `icon` / `iconForCover` value to a data file means adding it
 * here too; `resolveCoverIcon` falls back to `Sparkles` (the same fallback
 * the dynamic lookup used) if that's forgotten.
 */
const COVER_ICONS: Record<string, LucideIcon> = {
  Award,
  Briefcase,
  Car,
  Dumbbell,
  Flower2,
  Gift,
  GraduationCap,
  HeartHandshake,
  KeyRound,
  Landmark,
  Laptop,
  PawPrint,
  PiggyBank,
  Scissors,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  Sun,
  Tablet,
  Tent,
  TrendingUp,
  Users,
  UtensilsCrossed,
  Wallet,
};

export function resolveCoverIcon(name: string | undefined): LucideIcon {
  return (name && COVER_ICONS[name]) || Sparkles;
}
