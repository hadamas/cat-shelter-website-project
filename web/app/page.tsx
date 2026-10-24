import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

// Home: será construída a partir do wireframe da página inicial.
export default function Home() {
  return (
    <section className="px-6 py-24 text-center md:px-12">
      <h1 className="text-5xl text-main-blue md:text-6xl">Gatos de Francisca</h1>
    </section>
  );
}
