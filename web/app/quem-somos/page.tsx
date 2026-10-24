import type { Metadata } from "next";
import PageHeader from "@/app/components/PageHeader";
import ComingSoon from "@/app/components/ComingSoon";

export const metadata: Metadata = {
  title: "Quem Somos",
  description: "Conheça a história do gatil Gatos de Francisca e o trabalho de resgate e cuidado dos nossos gatinhos.",
  alternates: { canonical: "/quem-somos" },
};

export default function Page() {
  return (
    <>
      <PageHeader
        title="Quem Somos"
        subtitle="Conheça a história do gatil Gatos de Francisca e o trabalho de resgate e cuidado dos nossos gatinhos."
      />
      <ComingSoon />
    </>
  );
}
