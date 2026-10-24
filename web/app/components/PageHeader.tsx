import Link from "next/link";

type Crumb = { label: string; href?: string };

// Cabeçalho padrão das páginas internas: trilha (breadcrumb), título e subtítulo.
export default function PageHeader({
  title,
  subtitle,
  breadcrumb = [],
}: {
  title: string;
  subtitle?: string;
  breadcrumb?: Crumb[];
}) {
  const crumbs: Crumb[] = [{ label: "Home", href: "/" }, ...breadcrumb, { label: title }];

  return (
    <header className="border-b border-main-orange/20 px-6 py-12 md:px-12">
      <nav aria-label="Você está em" className="mb-4 text-xs text-main-brown/60">
        <ol className="flex flex-wrap items-center gap-1.5">
          {crumbs.map((c, i) => (
            <li key={c.label} className="flex items-center gap-1.5">
              {i > 0 && <span aria-hidden>/</span>}
              {c.href ? (
                <Link href={c.href} className="hover:text-main-blue">
                  {c.label}
                </Link>
              ) : (
                <span aria-current="page" className="text-main-brown">
                  {c.label}
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>
      <h1 className="text-4xl text-main-blue md:text-5xl">{title}</h1>
      {subtitle && <p className="mt-3 max-w-2xl text-main-brown/80">{subtitle}</p>}
    </header>
  );
}
