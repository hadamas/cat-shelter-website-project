import Link from "next/link";
import { ArrowRightIcon } from "@/app/components/icons";
import type { Product } from "@/app/lib/shop";
import AddToCartButton from "./AddToCartButton";
import LimitedBadge from "./LimitedBadge";
import PriceTag from "./PriceTag";
import ProductPhotos from "./ProductPhotos";
import { EditProductButton } from "./admin/AdminProductButtons";

// Card de um produto na Lojinha (sem borda, textos alinhados à esquerda).
export default function ProductCard({ product }: { product: Product }) {
  const href = `/lojinha/${product.slug}`;
  const soldOut = product.stock <= 0;

  return (
    <article className="relative flex h-full flex-col">
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-main-orange/10">
        <ProductPhotos photos={product.photos} href={href} name={product.name} />
        {product.limitedEdition && <LimitedBadge className="pointer-events-none absolute left-2 top-2" />}
        {soldOut && (
          <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-main-brown/75 py-1.5 text-center text-xs font-bold uppercase tracking-wide text-white">
            Esgotado
          </span>
        )}
        <EditProductButton product={product} />
      </div>

      <div className="flex flex-1 flex-col gap-1 pt-3">
        <h3 className="line-clamp-2 font-sans text-base font-bold leading-snug text-main-brown sm:text-lg">
          <Link href={href} className="hover:text-main-blue">
            {product.name}
          </Link>
        </h3>
        <PriceTag price={product.price} salePrice={product.salePrice} />

        <div className="mt-auto flex items-center justify-between gap-2 pt-2 sm:flex-col sm:items-stretch">
          <Link
            href={href}
            className="inline-flex items-center gap-1 text-xs font-semibold text-main-blue hover:underline sm:order-2 sm:justify-center sm:text-sm"
          >
            Ver detalhes <span className="sr-only">de {product.name}</span>
            <ArrowRightIcon width={13} height={13} aria-hidden />
          </Link>
          <AddToCartButton product={product} />
        </div>
      </div>
    </article>
  );
}
