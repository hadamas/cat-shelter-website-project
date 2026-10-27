import type { Metadata } from "next";
import { existsSync } from "node:fs";
import { join } from "node:path";
import Image from "next/image";
import Link from "next/link";
import { InstagramIcon, MapPinIcon, PawIcon, WhatsappIcon } from "@/app/components/icons";
import { contato } from "@/app/content/contato";
import { contactInfo, socialLinks, whatsappHref } from "@/app/lib/site";

export const metadata: Metadata = {
  title: "Contato",
  description: "Fale com o Gatos de Francisca pelo WhatsApp ou Instagram. Estamos no Grajaú, Rio de Janeiro.",
  alternates: { canonical: "/contato" },
};

const instagramHandle = `@${new URL(socialLinks.instagram).pathname.replaceAll("/", "")}`;

export default function ContatoPage() {
  // A página é gerada no build: se a imagem ainda não foi colocada na pasta, usa o espaço reservado.
  const hasImage = existsSync(join(process.cwd(), "public", contato.image.src));

  const channels = [
    { label: "WhatsApp", value: contactInfo.whatsappLabel, href: whatsappHref(), Icon: WhatsappIcon },
    { label: "Instagram", value: instagramHandle, href: socialLinks.instagram, Icon: InstagramIcon },
  ];

  return (
    <section
      aria-labelledby="contact-title"
      className="grid items-center gap-8 bg-main-orange/[0.07] px-6 py-12 md:grid-cols-2 md:gap-12 md:px-12 md:py-20"
    >
      {/* Card de contato: primeiro no celular, à direita no desktop */}
      <div className="rounded-3xl bg-white p-8 text-center shadow-sm md:order-2 md:p-10 md:text-left">
        <nav aria-label="Você está em" className="mb-4 text-xs text-main-brown/60">
          <Link href="/" className="hover:text-main-blue">
            Home
          </Link>
          <span aria-hidden className="mx-1.5">
            /
          </span>
          <span aria-current="page" className="text-main-brown">
            Contato
          </span>
        </nav>

        <h1 id="contact-title" className="text-4xl text-main-blue md:text-5xl">
          {contato.title}
        </h1>
        <p className="mt-3 text-main-brown/80">{contato.subtitle}</p>

        {/* bloco centralizado no celular, mas com as linhas alinhadas à esquerda */}
        <ul className="mx-auto mt-8 w-fit space-y-3 md:mx-0">
          {channels.map(({ label, value, href, Icon }) => (
            <li key={label}>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 rounded-2xl p-2 transition-colors hover:bg-main-orange/10"
              >
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-main-blue/10 text-main-blue transition-colors group-hover:bg-main-blue group-hover:text-white">
                  <Icon width={20} height={20} />
                </span>
                <span className="text-left">
                  <span className="block text-xs text-main-brown/60">{label}</span>
                  <span className="font-semibold text-main-brown">{value}</span>
                </span>
              </a>
            </li>
          ))}
          <li className="flex items-center gap-3 p-2">
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-main-orange/15 text-main-orange">
              <MapPinIcon width={20} height={20} />
            </span>
            <span className="text-left">
              <span className="block text-xs text-main-brown/60">Localização</span>
              <span className="font-semibold text-main-brown">{contato.location}</span>
            </span>
          </li>
        </ul>
      </div>

      {/* Imagem */}
      <div className="relative aspect-[4/3] overflow-hidden rounded-3xl md:order-1 md:aspect-[4/5]">
        {hasImage ? (
          <Image
            src={contato.image.src}
            alt={contato.image.alt}
            fill
            sizes="(min-width: 768px) 45vw, 100vw"
            className="object-cover"
          />
        ) : (
          <div aria-hidden className="grid h-full place-items-center bg-main-orange/10">
            <PawIcon className="size-20 text-main-orange/40" />
          </div>
        )}
      </div>
    </section>
  );
}
