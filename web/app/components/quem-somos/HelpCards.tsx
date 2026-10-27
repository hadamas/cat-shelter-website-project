import ButtonLink from "@/app/components/ui/ButtonLink";
import { CatIcon, HandHeartIcon, HomeHeartIcon } from "@/app/components/icons";
import type { HelpCard } from "@/app/content/quem-somos";

const icons = { donate: HandHeartIcon, sponsor: CatIcon, adopt: HomeHeartIcon };

// 3 cards de chamada para ajudar
export default function HelpCards({ cards }: { cards: HelpCard[] }) {
  return (
    <section aria-label="Formas de ajudar" className="bg-white px-6 py-16 md:px-12 md:py-20">
      <ul className="grid gap-6 md:grid-cols-3">
        {cards.map((card) => {
          const Icon = icons[card.icon];
          return (
            <li
              key={card.title}
              className="flex flex-col items-center rounded-3xl bg-main-blue px-6 py-10 text-center text-white shadow-lg shadow-main-blue/20"
            >
              <span className="grid size-20 place-items-center rounded-full bg-white/15">
                <Icon width={40} height={40} strokeWidth={1.6} />
              </span>
              <h2 className="mt-5 text-3xl text-white">{card.title}</h2>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-white/90">{card.text}</p>
              <ButtonLink href={card.cta.href} variant="outline-light" className="mt-6">
                {card.cta.label}
              </ButtonLink>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
