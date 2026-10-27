import Link from "next/link";

type Variant = "primary" | "outline" | "outline-light";

const variants: Record<Variant, string> = {
  primary: "bg-main-orange text-main-brown hover:bg-main-blue hover:text-white",
  outline: "border border-main-brown/25 text-main-brown hover:border-main-blue hover:text-main-blue",
  "outline-light": "border border-white/70 text-white hover:bg-white hover:text-main-brown",
};

// Botão com aparência de botão, mas que é um link.
// external: abre em nova aba (formulários, WhatsApp, outros sites).
export default function ButtonLink({
  href,
  variant = "primary",
  external = false,
  className = "",
  children,
}: {
  href: string;
  variant?: Variant;
  external?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  const classes = `inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-bold transition-colors ${variants[variant]} ${className}`;

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}
