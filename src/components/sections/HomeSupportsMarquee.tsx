import {
  Bus,
  GraduationCap,
  HeartHandshake,
  KeyRound,
  Laptop,
  type LucideIcon,
  Music,
  Stethoscope,
  Tent,
  Trophy,
} from "lucide-react";
import Marquee from "@/components/motion/Marquee";
import { supportsList } from "@/data/programs";
import { cn } from "@/lib/utils";

/**
 * "What your money supports" (audit §9, verbatim). `supportsList` carries a
 * trailing "…and much more!" line meant as body-copy filler, not a concrete
 * chip fact — this marquee (build-prompt §6.1 NEW Section 2b) lists only the
 * 9 concrete items, in the same order as `supportsList`, so this zips 1:1 by
 * index rather than retyping the copy.
 */
const CHIP_ICONS: LucideIcon[] = [
  Tent,
  Laptop,
  Bus,
  Trophy,
  Music,
  GraduationCap,
  Stethoscope,
  HeartHandshake,
  KeyRound,
];

const TONES = ["bg-brand-butter", "bg-brand-mint", "bg-brand-sky"] as const;

const CHIPS = supportsList.slice(0, CHIP_ICONS.length).map((text, index) => ({
  text,
  Icon: CHIP_ICONS[index],
  tone: TONES[index % TONES.length],
}));

const ROW_1 = CHIPS.slice(0, 5);
const ROW_2 = CHIPS.slice(5);

function Chip({ text, Icon, tone }: { text: string; Icon: LucideIcon; tone: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 whitespace-nowrap rounded-full px-5 py-3 text-sm font-semibold text-brand-ink shadow-[0_10px_20px_-12px_rgba(28,42,32,.35)]",
        tone,
      )}
    >
      <Icon aria-hidden="true" className="h-4 w-4 shrink-0" />
      {text}
    </span>
  );
}

export default function HomeSupportsMarquee() {
  return (
    <section className="overflow-hidden bg-brand-cream py-16 md:py-20">
      <h2 className="sr-only">What your money supports</h2>

      <div className="flex flex-col gap-8">
        <div className="-rotate-2">
          <Marquee direction="left" speed={32} itemClassName="gap-4">
            {ROW_1.map((chip) => (
              <Chip key={chip.text} {...chip} />
            ))}
          </Marquee>
        </div>
        <div className="rotate-2">
          <Marquee direction="right" speed={32} itemClassName="gap-4">
            {ROW_2.map((chip) => (
              <Chip key={chip.text} {...chip} />
            ))}
          </Marquee>
        </div>
      </div>
    </section>
  );
}
