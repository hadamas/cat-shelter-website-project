import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import PageHeader from "@/app/components/PageHeader";
import DetailSkeleton from "@/app/components/ui/DetailSkeleton";
import PhotoGallery from "@/app/components/adocao/PhotoGallery";
import { ArrowRightIcon } from "@/app/components/icons";
import LimitedBadge from "@/app/components/loja/LimitedBadge";
import PriceTag from "@/app/components/loja/PriceTag";
import ProductBuyBox from "@/app/components/loja/ProductBuyBox";
import ProductCard from "@/app/components/loja/ProductCard";
import { PRODUCT_GRID_CLASSES } from "@/app/components/loja/ProductGrid";
import { EditProductButton } from "@/app/components/loja/admin/AdminProductButtons";
import { shopInfo } from "@/app/content/lojinha";
import { formatBRL } from "@/app/lib/money";
import { currentPrice, getProductBySlug, getProducts } from "@/app/lib/products";

type Props = { params: Promise<{ slug: string }> };

// Uma página estática para cada produto. Com a lista vazia, devolve um endereço
// provisório (que dá 404): o Next.js exige pelo menos um item, senão o build falha.
export async function generateStaticParams() {
  const products = await getProducts();
  return products.length ? products.map((p) => ({ slug: p.slug })) : [{ slug: "sem-produtos" }];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProductBySlug((await params).slug);
  if (!product) return {};
  const description = `${product.name} por ${formatBRL(currentPrice(product))}. ${product.description.slice(0, 120)}`;
  return {
    title: product.name,
    description,
    alternates: { canonical: `/lojinha/${product.slug}` },
    openGraph: {
      title: product.name,
      description,
      images: product.photos[0] ? [{ url: product.photos[0].src, alt: product.photos[0].alt }] : undefined,
    },
  };
}

// O endereço (params) é lido dentro do <Suspense>: ao navegar para um produto,
// o esqueleto aparece na hora enquanto os dados chegam.
export default function ProductPage({ params }: Props) {
  return (
    <Suspense fallback={<DetailSkeleton label="Carregando produto" />}>
      <ProductContent params={params} />
    </Suspense>
  );
}

async function ProductContent({ params }: Props) {
  const { slug } = await params;
  const [product, all] = await Promise.all([getProductBySlug(slug), getProducts()]);
  if (!product) notFound();

  // "Veja também": outros produtos disponíveis (edição limitada primeiro)
  const related = all
    .filter((p) => p.id !== product.id && p.stock > 0)
    .sort((a, b) => Number(b.limitedEdition) - Number(a.limitedEdition))
    .slice(0, 4);

  return (
    <>
      <PageHeader title={product.name} breadcrumb={[{ label: "Lojinha", href: "/lojinha" }]} />

      <section className="grid gap-10 px-6 py-12 md:grid-cols-2 md:gap-12 md:px-12 md:py-16">
        <PhotoGallery photos={product.photos} name={product.name} />

        <div className="flex flex-col gap-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="space-y-3">
              {product.limitedEdition && <LimitedBadge />}
              <PriceTag price={product.price} salePrice={product.salePrice} size="lg" />
            </div>
            <EditProductButton product={product} variant="full" />
          </div>

          <div className="space-y-3 leading-relaxed text-main-brown/85">
            {product.description
              .split("\n")
              .filter(Boolean)
              .map((p, i) => (
                <p key={i}>{p}</p>
              ))}
          </div>

          <ProductBuyBox product={product} />

          <dl className="grid gap-3 rounded-2xl bg-main-orange/[0.08] p-4 text-sm sm:grid-cols-2">
            {shopInfo.map((info) => (
              <div key={info.title}>
                <dt className="font-semibold text-main-brown">{info.title}</dt>
                <dd className="mt-0.5 text-main-brown/75">{info.text}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {related.length > 0 && (
        <section className="border-t border-main-orange/15 px-6 py-12 md:px-12">
          <h2 className="mb-6 text-3xl text-main-blue">Veja também</h2>
          <ul className={PRODUCT_GRID_CLASSES}>
            {related.map((p) => (
              <li key={p.id}>
                <ProductCard product={p} />
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="px-6 pb-12 text-center md:px-12">
        <Link href="/lojinha" className="inline-flex items-center gap-1.5 font-semibold text-main-blue hover:underline">
          Ver todos os produtos
          <ArrowRightIcon width={16} height={16} aria-hidden />
        </Link>
      </div>
    </>
  );
}
