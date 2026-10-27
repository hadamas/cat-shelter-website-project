import type { Metadata } from "next";
import PageHeader from "@/app/components/PageHeader";
import ButtonLink from "@/app/components/ui/ButtonLink";
import { Section, SectionHeading } from "@/app/components/ui/Section";
import RoleCard from "@/app/components/voluntariado/RoleCard";
import { ExternalLinkIcon, WhatsappIcon } from "@/app/components/icons";
import { flexible, formUrl, howToJoin, intro, weekly } from "@/app/content/voluntariado";
import { whatsappHref } from "@/app/lib/site";

export const metadata: Metadata = {
  title: "Seja voluntário",
  description:
    "Ajude o Gatos de Francisca como voluntário: limpeza, alimentação e medicação no gatil, ou em festas, feiras de adoção e redes sociais.",
  alternates: { canonical: "/como-ajudar/voluntariado" },
};

function RoleGrid({ group }: { group: typeof weekly | typeof flexible }) {
  return (
    <>
      <SectionHeading id={`${group.id}-title`} title={group.title} subtitle={group.subtitle} />
      <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {group.roles.map((role) => (
          <li key={role.id}>
            <RoleCard role={role} />
          </li>
        ))}
      </ul>
    </>
  );
}

export default function VoluntariadoPage() {
  return (
    <>
      <PageHeader
        title={intro.title}
        subtitle={intro.subtitle}
        breadcrumb={[{ label: "Como Ajudar", href: "/como-ajudar" }]}
      />

      <Section id={weekly.id} labelledBy={`${weekly.id}-title`}>
        <RoleGrid group={weekly} />
      </Section>

      <Section id={flexible.id} tone="warm" labelledBy={`${flexible.id}-title`}>
        <RoleGrid group={flexible} />
      </Section>

      <Section id={howToJoin.id} labelledBy={`${howToJoin.id}-title`}>
        <SectionHeading id={`${howToJoin.id}-title`} title={howToJoin.title} />

        <ol className="mx-auto grid max-w-4xl gap-6 md:grid-cols-3">
          {howToJoin.steps.map((step, i) => (
            <li key={step.title} className="text-center">
              <span className="mx-auto grid size-12 place-items-center rounded-full bg-main-orange font-display text-2xl text-main-brown">
                {i + 1}
              </span>
              <h3 className="mt-3 text-xl text-main-blue">{step.title}</h3>
              <p className="mt-1 text-sm text-main-brown/80">{step.text}</p>
            </li>
          ))}
        </ol>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <ButtonLink href={formUrl} external className="w-full sm:w-auto">
            {howToJoin.cta}
            <ExternalLinkIcon width={16} height={16} />
          </ButtonLink>
          <ButtonLink href={whatsappHref(howToJoin.whatsappMessage)} external variant="outline" className="w-full sm:w-auto">
            <WhatsappIcon width={16} height={16} />
            {howToJoin.whatsappLabel}
          </ButtonLink>
        </div>

        <p className="mt-8 text-center text-sm text-main-brown/70">{howToJoin.closing}</p>
      </Section>
    </>
  );
}
