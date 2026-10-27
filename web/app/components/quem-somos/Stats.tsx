import { CalendarIcon, CatIcon, HealthIcon } from "@/app/components/icons";
import type { Stat } from "@/app/content/quem-somos";
import CountUp from "./CountUp";

const icons = { calendar: CalendarIcon, cat: CatIcon, health: HealthIcon };

// Círculos com números do gatil
export default function Stats({ items }: { items: Stat[] }) {
  return (
    <section aria-label="O gatil em números" className="bg-white px-6 py-16 md:px-12 md:py-20">
      <ul className="flex flex-wrap justify-center gap-6 sm:gap-10 md:gap-16">
        {items.map((s) => {
          const Icon = icons[s.icon];
          return (
            <li
              key={s.label}
              className="flex size-36 flex-col items-center justify-center rounded-full border-2 border-main-blue text-center sm:size-44"
            >
              <Icon width={26} height={26} className="text-main-orange" />
              <CountUp
                value={s.value}
                prefix={s.prefix}
                suffix={s.suffix}
                className="font-display text-4xl leading-none text-main-blue sm:text-5xl"
              />
              <span className="mt-1 px-3 text-xs text-main-brown/80 sm:text-sm">{s.label}</span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
