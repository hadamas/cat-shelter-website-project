import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageHeader from "@/app/components/PageHeader";
import ButtonLink from "@/app/components/ui/ButtonLink";
import PhotoGallery from "@/app/components/adocao/PhotoGallery";
import SexBadge from "@/app/components/adocao/SexBadge";
import {
  ArrowRightIcon,
  CakeIcon,
  CheckIcon,
  ExternalLinkIcon,
  HomeIcon,
  PawIcon,
  WhatsappIcon,
} from "@/app/components/icons";
import { adoptCta, adoptionFormUrl, adoptionWhatsappMessage } from "@/app/content/adocao";
import { getAvailableCats, getCatBySlug, type Cat, type TestResult } from "@/app/lib/cats";
import { formatMonths, monthsBetween } from "@/app/lib/dates";
import { getToday } from "@/app/lib/today";
import { whatsappHref } from "@/app/lib/site";

type Props = { params: Promise<{ slug: string }> };

// Gera uma página estática para cada gatinho disponível.
export async function generateStaticParams() {
  const cats = await getAvailableCats();
  return cats.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const cat = await getCatBySlug((await params).slug);
  if (!cat) return {};
  const title = `${cat.name} para adoção`;
  const description = `Conheça ${cat.name}, ${cat.sex === "F" ? "gatinha" : "gatinho"} do Gatos de Francisca que procura uma família. ${cat.traits.slice(0, 3).join(", ")}.`;
  return {
    title,
    description,
    alternates: { canonical: `/como-ajudar/adote/${cat.slug}` },
    openGraph: { title, description, images: cat.photos[0] ? [{ url: cat.photos[0].src, alt: cat.photos[0].alt }] : undefined },
  };
}

// Concordância: castrada/castrado, vacinada/vacinado...
const g = (cat: Cat, word: string) => `${word}${cat.sex === "F" ? "a" : "o"}`;

function vetItems(cat: Cat) {
  const test = (name: string, r: TestResult) =>
    r === "nao_testado" ? { ok: false, text: `${name}: ainda não testad${cat.sex === "F" ? "a" : "o"}` } : { ok: r === "negativo", text: `${name} ${r}` };

  return [
    { ok: cat.vetCare.neutered, text: cat.vetCare.neutered ? g(cat, "Castrad") : `Ainda não ${g(cat, "castrad")}` },
    { ok: cat.vetCare.vaccinated, text: cat.vetCare.vaccinated ? g(cat, "Vacinad") : "Vacinação pendente" },
    { ok: cat.vetCare.dewormed, text: cat.vetCare.dewormed ? g(cat, "Vermifugad") : "Vermifugação pendente" },
    test("FIV", cat.vetCare.fiv),
    test("FeLV", cat.vetCare.felv),
  ];
}

export default async function CatPage({ params }: Props) {
  const [cat, today] = await Promise.all([getCatBySlug((await params).slug), getToday()]);
  if (!cat || cat.status !== "disponivel") notFound();

  const article = cat.sex === "F" ? "da" : "do";
  const facts = [
    { Icon: CakeIcon, label: "Idade", value: formatMonths(monthsBetween(cat.birthDate, today)) },
    { Icon: HomeIcon, label: "Tempo no gatil", value: formatMonths(monthsBetween(cat.arrivalDate, today)) },
    { Icon: PawIcon, label: "Pelagem", value: cat.coatColor },
  ];

  return (
    <>
      <PageHeader
        title={cat.name}
        breadcrumb={[
          { label: "Como Ajudar", href: "/como-ajudar" },
          { label: "Adote um gatinho", href: "/como-ajudar/adote" },
        ]}
      />

      <section className="grid gap-10 px-6 py-12 md:grid-cols-2 md:gap-12 md:px-12 md:py-16">
        <PhotoGallery photos={cat.photos} name={cat.name} />

        <div>
          <SexBadge sex={cat.sex} showLabel />

          <dl className="mt-6 grid grid-cols-3 gap-2 sm:gap-3 md:grid-cols-1 lg:grid-cols-3">
            {facts.map(({ Icon, label, value }) => (
              <div key={label} className="rounded-2xl bg-main-orange/[0.08] p-3 sm:p-4">
                <dt className="flex items-center gap-1.5 text-xs text-main-brown/60">
                  <Icon width={15} height={15} className="text-main-orange" aria-hidden />
                  {label}
                </dt>
                <dd className="mt-1 text-sm font-semibold text-main-brown sm:text-base">{value}</dd>
              </div>
            ))}
          </dl>

          <h2 className="mt-8 text-2xl text-main-blue">Cuidados veterinários</h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {vetItems(cat).map((item) => (
              <li
                key={item.text}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold ${
                  item.ok ? "bg-main-blue/10 text-main-blue" : "bg-main-brown/[0.06] text-main-brown/70"
                }`}
              >
                {item.ok && <CheckIcon width={14} height={14} aria-hidden />}
                {item.text}
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href={adoptionFormUrl} external className="sm:flex-1">
              {adoptCta}
              <ExternalLinkIcon width={14} height={14} />
            </ButtonLink>
            <ButtonLink href={whatsappHref(adoptionWhatsappMessage(cat.name))} external variant="outline" className="sm:flex-1">
              <WhatsappIcon width={16} height={16} />
              Tirar dúvidas
            </ButtonLink>
          </div>
        </div>
      </section>

      <section className="grid gap-10 border-t border-main-orange/15 bg-main-orange/[0.05] px-6 py-12 md:grid-cols-5 md:px-12 md:py-16">
        <div className="md:col-span-3">
          <h2 className="text-3xl text-main-blue">
            História {article} {cat.name}
          </h2>
          <div className="mt-4 space-y-4 leading-relaxed text-main-brown/85">
            {cat.story.split("\n").filter(Boolean).map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </div>

        {cat.traits.length > 0 && (
          <div className="md:col-span-2">
            <h2 className="text-3xl text-main-blue">Personalidade</h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {cat.traits.map((t) => (
                <li key={t} className="rounded-full bg-main-orange px-4 py-1.5 text-sm font-semibold text-main-brown">
                  {t}
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      <div className="px-6 py-10 text-center md:px-12">
        <Link
          href="/como-ajudar/adote"
          className="inline-flex items-center gap-1.5 font-semibold text-main-blue hover:underline"
        >
          Ver todos os gatinhos
          <ArrowRightIcon width={16} height={16} aria-hidden />
        </Link>
      </div>
    </>
  );
}
