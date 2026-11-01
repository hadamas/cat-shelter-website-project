import { limitedEditionLabel } from "@/app/content/lojinha";

// Etiqueta "Edição limitada" (sobre a foto do card ou ao lado do nome).
export default function LimitedBadge({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full bg-main-brown px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm sm:text-[11px] ${className}`}
    >
      <span aria-hidden>★</span>
      {limitedEditionLabel}
    </span>
  );
}
