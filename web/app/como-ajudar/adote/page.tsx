import type { Metadata } from "next";
import PageHeader from "@/app/components/PageHeader";
import ComingSoon from "@/app/components/ComingSoon";

export const metadata: Metadata = {
  title: "Adote um gatinho",
  description: "Conheça os gatos do Gatos de Francisca que estão à espera de um lar.",
  alternates: { canonical: "/como-ajudar/adote" },
};

export default function Page() {
  return (
    <>
      <PageHeader
        title="Adote um gatinho"
        subtitle="Conheça os gatos do Gatos de Francisca que estão à espera de um lar."
        breadcrumb={[{ label: "Como Ajudar", href: "/como-ajudar" }]}
      />
      <ComingSoon />
    </>
  );
}
