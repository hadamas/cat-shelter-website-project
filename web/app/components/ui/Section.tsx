// Bloco padrão de seção: espaçamento consistente e fundo opcional.
export function Section({
  id,
  tone = "white",
  className = "",
  labelledBy,
  children,
}: {
  id?: string;
  tone?: "white" | "warm";
  className?: string;
  labelledBy?: string;
  children: React.ReactNode;
}) {
  const bg = tone === "warm" ? "bg-main-orange/[0.07]" : "bg-white";
  return (
    <section id={id} aria-labelledby={labelledBy} className={`${bg} px-6 py-16 md:px-12 md:py-20 ${className}`}>
      {children}
    </section>
  );
}

// Título + subtítulo centralizados de uma seção.
export function SectionHeading({
  id,
  title,
  subtitle,
  eyebrow,
}: {
  id?: string;
  title: string;
  subtitle?: string;
  eyebrow?: string;
}) {
  return (
    <div className="mx-auto mb-10 max-w-2xl text-center md:mb-12">
      {eyebrow && (
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-main-brown/60">{eyebrow}</p>
      )}
      <h2 id={id} className="text-3xl text-main-blue md:text-4xl">
        {title}
      </h2>
      {subtitle && <p className="mt-3 text-main-brown/80">{subtitle}</p>}
    </div>
  );
}
