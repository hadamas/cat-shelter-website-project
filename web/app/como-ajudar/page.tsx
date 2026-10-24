import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/app/components/PageHeader";
import { comoAjudarItems } from "@/app/lib/site";

export const metadata: Metadata = {
  title: "Como Ajudar",
  description:
    "Adote, seja voluntário, compre na lojinha ou faça uma doação: veja todas as formas de ajudar o Gatos de Francisca.",
  alternates: { canonical: "/como-ajudar" },
};

export default function ComoAjudarPage() {
  return (
    <>
      <PageHeader
        title="Como Ajudar"
        subtitle="Existem várias formas de fazer a diferença na vida dos nossos gatinhos. Escolha a sua:"
      />
      <ul className="grid gap-4 px-6 py-12 sm:grid-cols-2 md:px-12 lg:grid-cols-3">
        {comoAjudarItems.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="group block h-full rounded-2xl border border-main-orange/30 p-6 transition-all hover:-translate-y-1 hover:border-main-blue hover:shadow-lg"
            >
              <h2 className="text-2xl text-main-orange transition-colors group-hover:text-main-blue">
                {item.label}
              </h2>
              {item.description && <p className="mt-2 text-sm text-main-brown/80">{item.description}</p>}
              <span className="mt-4 inline-block text-sm font-semibold text-main-blue">Saiba mais →</span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
