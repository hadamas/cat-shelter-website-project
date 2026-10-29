import type { Metadata } from "next";
import { Suspense } from "react";
import PageHeader from "@/app/components/PageHeader";
import { Section } from "@/app/components/ui/Section";
import CatCard from "@/app/components/adocao/CatCard";
import { AddCatButton } from "@/app/components/adocao/admin/AdminCatButtons";
import CatGallery, { GRID_CLASSES } from "@/app/components/adocao/CatGallery";
import { DEFAULT_SORT, sortCats } from "@/app/components/adocao/sorting";
import { adoptionIntro } from "@/app/content/adocao";
import { getAvailableCats } from "@/app/lib/cats";
import { getToday } from "@/app/lib/today";

export const metadata: Metadata = {
  title: "Adote um gatinho",
  description:
    "Conheça os gatinhos do Gatos de Francisca que esperam por uma família no Rio de Janeiro. Todos são cuidados por veterinários antes da adoção.",
  alternates: { canonical: "/como-ajudar/adote" },
};

export default async function AdotePage() {
  const [cats, today] = await Promise.all([getAvailableCats(), getToday()]);

  // Versão pré-renderizada (primeira página na ordem padrão): aparece enquanto
  // o JavaScript carrega e garante que o Google veja os links dos gatinhos.
  const fallback = (
    <ul className={`${GRID_CLASSES} mt-[60px]`}>
      {sortCats(cats, DEFAULT_SORT)
        .slice(0, 8)
        .map((cat) => (
          <li key={cat.id}>
            <CatCard cat={cat} today={today} />
          </li>
        ))}
    </ul>
  );

  return (
    <>
      <PageHeader
        title={adoptionIntro.title}
        subtitle={adoptionIntro.subtitle}
        breadcrumb={[{ label: "Como Ajudar", href: "/como-ajudar" }]}
      />
      <Section>
        <AddCatButton />
        {cats.length === 0 ? (
          <p className="py-10 text-center text-main-brown/80">
            No momento todos os nossos gatinhos encontraram um lar! 🧡 Volte em breve.
          </p>
        ) : (
          <Suspense fallback={fallback}>
            <CatGallery cats={cats} today={today} />
          </Suspense>
        )}
      </Section>
    </>
  );
}
