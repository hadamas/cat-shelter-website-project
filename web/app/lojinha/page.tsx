import type { Metadata } from "next";
import PageHeader from "@/app/components/PageHeader";
import { Section } from "@/app/components/ui/Section";
import ProductGrid from "@/app/components/loja/ProductGrid";
import { AddProductButton } from "@/app/components/loja/admin/AdminProductButtons";
import { shopIntro } from "@/app/content/lojinha";
import { getProducts } from "@/app/lib/products";

export const metadata: Metadata = {
  title: shopIntro.title,
  description: shopIntro.subtitle,
  alternates: { canonical: "/lojinha" },
};

export default async function LojinhaPage() {
  const products = await getProducts();

  return (
    <>
      <PageHeader title={shopIntro.title} subtitle={shopIntro.subtitle} />
      <Section>
        <AddProductButton />
        {products.length === 0 ? (
          <p className="py-10 text-center text-main-brown/80">Novos produtos chegando em breve! 🐾</p>
        ) : (
          <ProductGrid products={products} />
        )}
      </Section>
    </>
  );
}
