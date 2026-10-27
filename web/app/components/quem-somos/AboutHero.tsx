import Link from "next/link";
import ButtonLink from "@/app/components/ui/ButtonLink";
import { ArrowRightIcon, PawIcon } from "@/app/components/icons";
import type { hero as HeroData } from "@/app/content/quem-somos";

export default function AboutHero({ content }: { content: typeof HeroData }) {
  return (
    <section
      aria-labelledby="about-title"
      className="relative overflow-hidden bg-main-orange/[0.12] px-6 py-20 text-center md:px-12 md:py-28"
    >
      {/* patinhas decorativas */}
      <PawIcon className="absolute -left-6 top-8 size-28 -rotate-12 text-main-orange/20 md:size-40" />
      <PawIcon className="absolute -right-4 bottom-6 size-24 rotate-12 text-main-orange/20 md:size-36" />

      <nav aria-label="Você está em" className="relative mb-6 text-xs text-main-brown/60">
        <Link href="/" className="hover:text-main-blue">
          Home
        </Link>
        <span aria-hidden className="mx-1.5">
          /
        </span>
        <span aria-current="page" className="text-main-brown">
          Quem Somos
        </span>
      </nav>

      <div className="relative mx-auto max-w-3xl">
        <h1 id="about-title" className="text-4xl leading-tight text-main-blue sm:text-5xl md:text-6xl">
          {content.title}
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-main-brown/80 md:text-lg">
          {content.subtitle}
        </p>
        <ButtonLink href={content.cta.href} className="mt-8">
          {content.cta.label}
          <ArrowRightIcon width={16} height={16} />
        </ButtonLink>
      </div>
    </section>
  );
}
