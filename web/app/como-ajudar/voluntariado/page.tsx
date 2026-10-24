import type { Metadata } from "next";
import PageHeader from "@/app/components/PageHeader";
import ComingSoon from "@/app/components/ComingSoon";

export const metadata: Metadata = {
  title: "Seja voluntário",
  description: "Doe seu tempo e seus talentos para ajudar os gatinhos do Gatos de Francisca.",
  alternates: { canonical: "/como-ajudar/voluntariado" },
};

export default function Page() {
  return (
    <>
      <PageHeader
        title="Seja voluntário"
        subtitle="Doe seu tempo e seus talentos para ajudar os gatinhos do Gatos de Francisca."
        breadcrumb={[{ label: "Como Ajudar", href: "/como-ajudar" }]}
      />
      <ComingSoon />
    </>
  );
}
