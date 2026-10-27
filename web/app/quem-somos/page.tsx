import type { Metadata } from "next";
import AboutHero from "@/app/components/quem-somos/AboutHero";
import Partners from "@/app/components/quem-somos/Partners";
import HelpCards from "@/app/components/quem-somos/HelpCards";
import Story from "@/app/components/quem-somos/Story";
import Stats from "@/app/components/quem-somos/Stats";
import CatStories from "@/app/components/quem-somos/CatStories";
import Volunteers from "@/app/components/quem-somos/Volunteers";
import LocationMap from "@/app/components/LocationMap";
import { catStories, helpCards, hero, partners, stats, story, volunteers } from "@/app/content/quem-somos";

export const metadata: Metadata = {
  title: "Quem Somos",
  description:
    "Conheça a história do Gatos de Francisca, gatil no Rio de Janeiro que resgata, cuida e encontra lares para gatos abandonados desde 2019.",
  alternates: { canonical: "/quem-somos" },
};

export default function QuemSomosPage() {
  return (
    <>
      <AboutHero content={hero} />
      <Partners title={partners.title} items={partners.items} />
      <HelpCards cards={helpCards} />
      <Story content={story} />
      <Stats items={stats} />
      <CatStories content={catStories} />
      <Volunteers content={volunteers} />
      <LocationMap />
    </>
  );
}
