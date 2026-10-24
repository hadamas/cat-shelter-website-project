import type { Metadata } from "next";
import PageHeader from "@/app/components/PageHeader";
import ComingSoon from "@/app/components/ComingSoon";

export const metadata: Metadata = {
  title: "Contas",
  description: "Transparência: veja como os recursos doados ao Gatos de Francisca são usados.",
  alternates: { canonical: "/como-ajudar/contas" },
};

export default function Page() {
  return (
    <>
      <PageHeader
        title="Contas"
        subtitle="Transparência: veja como os recursos doados ao Gatos de Francisca são usados."
        breadcrumb={[{ label: "Como Ajudar", href: "/como-ajudar" }]}
      />
      <ComingSoon />
    </>
  );
}
