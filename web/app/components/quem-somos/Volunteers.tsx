import Image from "next/image";
import ButtonLink from "@/app/components/ui/ButtonLink";
import { Section, SectionHeading } from "@/app/components/ui/Section";
import { PawIcon } from "@/app/components/icons";
import type { volunteers as VolunteersData } from "@/app/content/quem-somos";

const PLACEHOLDERS = 8;

// Galeria de voluntários: 4 colunas no desktop, 2 no celular.
export default function Volunteers({ content }: { content: typeof VolunteersData }) {
  const hasPhotos = content.photos.length > 0;

  return (
    <Section labelledBy="volunteers-title">
      <SectionHeading id="volunteers-title" title={content.title} subtitle={content.subtitle} />

      <ul className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        {hasPhotos
          ? content.photos.map((photo) => (
              <li key={photo.src} className="relative aspect-square overflow-hidden rounded-2xl">
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes="(min-width: 768px) 25vw, 50vw"
                  className="object-cover transition duration-500 hover:scale-105"
                />
              </li>
            ))
          : Array.from({ length: PLACEHOLDERS }, (_, i) => (
              // no celular mostra 6 espaços (2x3), como no wireframe
              <li
                key={i}
                aria-hidden
                className={`grid aspect-square place-items-center rounded-2xl bg-main-orange/10 ${i >= 6 ? "hidden md:grid" : ""}`}
              >
                <PawIcon className="size-12 text-main-orange/40" />
              </li>
            ))}
      </ul>

      <div className="mt-10 text-center">
        <ButtonLink href={content.cta.href}>{content.cta.label}</ButtonLink>
      </div>
    </Section>
  );
}
