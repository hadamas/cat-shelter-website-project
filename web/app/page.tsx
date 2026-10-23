// Seções provisórias: servem de alvo para os links do menu enquanto
// construímos cada uma a partir dos wireframes.
const sections = [
  { id: "quem-somos", title: "Quem Somos" },
  { id: "como-ajudar", title: "Como Ajudar" },
  { id: "doacao", title: "Doação" },
  { id: "contato", title: "Contato" },
];

export default function Home() {
  return (
    <>
      <section className="mx-auto max-w-6xl px-4 py-24 text-center">
        <h1 className="text-5xl text-main-blue md:text-6xl">Gatos de Francisca</h1>
      </section>
      {sections.map((s) => (
        <section key={s.id} id={s.id} className="mx-auto min-h-[50vh] max-w-6xl px-4 py-16">
          <h2 className="text-3xl text-main-orange">{s.title}</h2>
        </section>
      ))}
    </>
  );
}
