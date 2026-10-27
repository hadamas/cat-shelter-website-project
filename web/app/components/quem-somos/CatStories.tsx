import Image from "next/image";
import ButtonLink from "@/app/components/ui/ButtonLink";
import { Section, SectionHeading } from "@/app/components/ui/Section";
import type { catStories as CatStoriesData } from "@/app/content/quem-somos";

export default function CatStories({ content }: { content: typeof CatStoriesData }) {
  return (
    <Section tone="warm" labelledBy="cats-title">
      <SectionHeading id="cats-title" title={content.title} subtitle={content.subtitle} />

      {/* No celular vira um carrossel com rolagem lateral; a partir de sm, grade */}
      <ul className="-mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto scrollbar-none px-6 pb-4 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-5 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-4">
        {content.items.map((cat, i) => (
          <li key={`${cat.name}-${i}`} className="w-[78%] shrink-0 snap-center overflow-hidden rounded-3xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg sm:w-auto">
            <div className="relative aspect-square">
              <Image
                src={cat.photo.src}
                alt={cat.photo.alt}
                fill
                sizes="(min-width: 1024px) 260px, (min-width: 640px) 45vw, 100vw"
                className="object-cover"
              />
              {cat.status && (
                <span
                  className={`absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-bold ${
                    cat.status === "adotado" ? "bg-main-blue text-white" : "bg-main-orange text-main-brown"
                  }`}
                >
                  {cat.status === "adotado" ? "Adotado 💛" : "Procura um lar"}
                </span>
              )}
            </div>
            <div className="p-5">
              <h3 className="text-2xl text-main-orange">{cat.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-main-brown/80">{cat.story}</p>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-10 text-center">
        <ButtonLink href={content.cta.href}>{content.cta.label}</ButtonLink>
      </div>
    </Section>
  );
}
