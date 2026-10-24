import type { Metadata } from "next";
import PageHeader from "@/app/components/PageHeader";
import ComingSoon from "@/app/components/ComingSoon";

export const metadata: Metadata = {
  title: "Doações",
  description: "Ajude o Gatos de Francisca com Pix, ração, areia e outros itens.",
  alternates: { canonical: "/como-ajudar/doacao" },
};

export default function Page() {
  return (
    <>
      <PageHeader
        title="Doações"
        subtitle="Ajude o Gatos de Francisca com Pix, ração, areia e outros itens."
        breadcrumb={[{ label: "Como Ajudar", href: "/como-ajudar" }]}
      />
      <ComingSoon />
    </>
  );
}
