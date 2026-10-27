import Image from "next/image";
import type { Partner } from "@/app/content/quem-somos";

// Faixa de parceiros. Sem logo cadastrado, mostra o nome no lugar.
export default function Partners({ title, items }: { title: string; items: Partner[] }) {
  return (
    <section aria-labelledby="partners-title" className="border-y border-black/5 bg-white px-6 py-10 md:px-12">
      <h2
        id="partners-title"
        className="text-center font-sans text-xs font-semibold uppercase tracking-[0.2em] text-main-brown/60"
      >
        {title}
      </h2>
      <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-12 gap-y-8 md:gap-x-16">
        {items.map((p) => {
          // Logo: altura fixa + largura máxima, para logos largos (como o da Petz)
          // não ficarem desproporcionais ao lado dos mais quadrados.
          const content = p.logo ? (
            <Image
              src={p.logo.src}
              alt={p.logo.alt}
              width={p.logo.width}
              height={p.logo.height}
              sizes="200px"
              className="h-16 w-auto max-w-32 object-contain transition hover:scale-105 md:h-20 md:max-w-40"
            />
          ) : (
            <span className="font-display text-3xl text-main-brown/60 transition-colors hover:text-main-blue">
              {p.name}
            </span>
          );
          return (
            <li key={p.name}>
              {p.href ? (
                <a href={p.href} target="_blank" rel="noopener noreferrer" title={p.name}>
                  {content}
                </a>
              ) : (
                content
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
