import type { Metadata } from "next";
import PageHeader from "@/app/components/PageHeader";
import ButtonLink from "@/app/components/ui/ButtonLink";
import { Section, SectionHeading } from "@/app/components/ui/Section";
import DonationCardItem from "@/app/components/doacoes/DonationCardItem";
import { InstagramIcon, WhatsappIcon } from "@/app/components/icons";
import { cards, cardsHeading, howToSend, intro } from "@/app/content/doacoes";
import { socialLinks, whatsappHref } from "@/app/lib/site";

export const metadata: Metadata = {
  title: "Doações",
  description:
    "Ajude o Gatos de Francisca: doe por Pix, contribua todo mês, doe ração e outros itens, roupas para o brechó, livros para o sebo ou compre na Petz com 10% de desconto.",
  alternates: { canonical: "/como-ajudar/doacao" },
};

export default function DoacaoPage() {
  return (
    <>
      <PageHeader
        title={intro.title}
        subtitle={intro.subtitle}
        breadcrumb={[{ label: "Como Ajudar", href: "/como-ajudar" }]}
      />

      <Section labelledBy="donation-options-title">
        <SectionHeading id="donation-options-title" title={cardsHeading.title} subtitle={cardsHeading.subtitle} />
        <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <li key={card.id}>
              <DonationCardItem card={card} />
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="warm" labelledBy="how-to-send-title" className="text-center">
        <h2 id="how-to-send-title" className="text-3xl text-main-blue md:text-4xl">
          {howToSend.title}
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-main-brown/80">{howToSend.text}</p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <ButtonLink href={whatsappHref(howToSend.whatsappMessage)} external className="w-full sm:w-auto">
            <WhatsappIcon width={16} height={16} />
            Falar no WhatsApp
          </ButtonLink>
          <ButtonLink href={socialLinks.instagram} external variant="outline" className="w-full sm:w-auto">
            <InstagramIcon width={16} height={16} />
            Falar no Instagram
          </ButtonLink>
        </div>
      </Section>
    </>
  );
}
