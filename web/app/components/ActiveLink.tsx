"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export type ActiveLinkProps = {
  href: string;
  className?: string;
  activeClassName?: string;
  /** true: só fica ativo na rota exata. false: também nas sub-rotas. */
  exact?: boolean;
  children: React.ReactNode;
};

export default function ActiveLink({
  href,
  className = "",
  activeClassName = "",
  exact = false,
  children,
}: ActiveLinkProps) {
  const pathname = usePathname();
  const isCurrent = pathname === href;
  const isActive = exact || href === "/" ? isCurrent : isCurrent || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      aria-current={isCurrent ? "page" : undefined}
      className={isActive ? `${className} ${activeClassName}` : className}
    >
      {children}
    </Link>
  );
}
