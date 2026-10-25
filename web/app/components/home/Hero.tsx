import type { HeroContent } from "@/app/content/home";
import ButtonLink from "@/app/components/ui/ButtonLink";
import { ArrowRightIcon } from "@/app/components/icons";
import HeroVideo from "./HeroVideo";

// Desktop (md+): vídeo à esquerda, texto à direita.
// Mobile: o mesmo vídeo vira fundo da seção, com o texto por cima.
// É um único <video> que muda de posição via CSS, então ele é baixado só uma vez.
export default function Hero({ content }: { content: HeroContent }) {
  const { title, titleEmoji, subtitle, media, primaryCta, secondaryCta } = content;

  return (
    <section
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-[calc(100svh-7.25rem)] items-center overflow-hidden px-6 py-16 md:min-h-0 md:grid md:grid-cols-2 md:gap-12 md:px-12 md:py-20 lg:gap-16"
    >
      {/* Mídia */}
      <div className="absolute inset-0 -z-10 md:relative md:inset-auto md:z-auto md:aspect-[4/5] md:overflow-hidden md:rounded-3xl md:shadow-xl lg:aspect-square">
        <HeroVideo
          src={media.video}
          poster={media.poster}
          className="h-full w-full object-cover object-[35%_center]"
        />
        {/* Escurece o vídeo no mobile para o texto ficar legível */}
        <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/55 to-black/70 md:hidden" />
      </div>

      {/* Texto */}
      <div className="mx-auto max-w-xl text-center md:mx-0 md:text-left">
        <h1
          id="hero-title"
          className="text-4xl leading-tight text-white drop-shadow-sm sm:text-5xl md:text-main-blue md:drop-shadow-none lg:text-6xl"
        >
          {title}
          {titleEmoji && (
            <span aria-hidden className="ml-2 inline-block">
              {titleEmoji}
            </span>
          )}
        </h1>
        <p className="mt-5 text-base leading-relaxed text-white/90 md:text-lg md:text-main-brown/80">{subtitle}</p>

        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center md:justify-start">
          <ButtonLink href={primaryCta.href} className="w-full sm:w-auto">
            {primaryCta.label}
            <ArrowRightIcon width={16} height={16} />
          </ButtonLink>
          {/* Um único botão: claro sobre o vídeo no mobile, contorno marrom no desktop */}
          <ButtonLink
            href={secondaryCta.href}
            variant="outline-light"
            className="w-full sm:w-auto md:border-main-brown/25 md:text-main-brown md:hover:border-main-blue md:hover:bg-transparent md:hover:text-main-blue"
          >
            {secondaryCta.label}
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
