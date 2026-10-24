import type { Metadata } from "next";
import PageHeader from "@/app/components/PageHeader";
import ComingSoon from "@/app/components/ComingSoon";

export const metadata: Metadata = {
  title: "Lojinha",
  description: "Produtos do Gatos de Francisca: cada compra ajuda a manter o gatil.",
  alternates: { canonical: "/como-ajudar/lojinha" },
};

export default function Page() {
  return (
    <>
      <PageHeader
        title="Lojinha"
        subtitle="Produtos do Gatos de Francisca: cada compra ajuda a manter o gatil."
        breadcrumb={[{ label: "Como Ajudar", href: "/como-ajudar" }]}
      />
      <ComingSoon />
    </>
  );
}
