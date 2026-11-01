import { discountPercent, formatBRL } from "@/app/lib/money";

// Preço do produto. Em promoção: valor original riscado + valor atual em destaque.
export default function PriceTag({
  price,
  salePrice,
  size = "md",
}: {
  price: number;
  salePrice: number | null;
  size?: "md" | "lg";
}) {
  const big = size === "lg";
  if (salePrice === null) {
    return <p className={`font-bold text-main-brown ${big ? "text-3xl" : "text-base sm:text-lg"}`}>{formatBRL(price)}</p>;
  }
  return (
    <p className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
      <span className={`font-bold text-shop-sale ${big ? "text-3xl" : "text-base sm:text-lg"}`}>
        <span className="sr-only">Por </span>
        {formatBRL(salePrice)}
      </span>
      <s className={`text-main-brown/45 ${big ? "text-lg" : "text-xs sm:text-sm"}`}>
        <span className="sr-only">De </span>
        {formatBRL(price)}
      </s>
      <span
        className={`rounded-full bg-shop-sale/10 font-bold text-shop-sale ${big ? "px-2.5 py-0.5 text-sm" : "px-1.5 text-[10px] sm:text-xs"}`}
      >
        -{discountPercent(price, salePrice)}%
      </span>
    </p>
  );
}
