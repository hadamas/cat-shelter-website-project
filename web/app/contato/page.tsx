import type { Metadata } from "next";
import PageHeader from "@/app/components/PageHeader";
import ComingSoon from "@/app/components/ComingSoon";

export const metadata: Metadata = {
  title: "Contato",
  description: "Fale com o gatil Gatos de Francisca pelo WhatsApp, Instagram ou e-mail.",
  alternates: { canonical: "/contato" },
};

export default function Page() {
  return (
    <>
      <PageHeader
        title="Contato"
        subtitle="Fale com o gatil Gatos de Francisca pelo WhatsApp, Instagram ou e-mail."
      />
      <ComingSoon />
    </>
  );
}
