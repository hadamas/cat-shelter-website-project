import { Suspense } from "react";
import Link from "next/link";
import ActiveLink, { type ActiveLinkProps } from "./ActiveLink";

// Link do menu que fica destacado quando a página está aberta.
// O Suspense mantém o restante do layout pré-renderizado mesmo em rotas
// dinâmicas futuras (ex.: /como-ajudar/adote/[gato]); enquanto isso,
// mostra o link sem destaque.
export default function NavLink(props: ActiveLinkProps) {
  const { href, className, children } = props;
  return (
    <Suspense
      fallback={
        <Link href={href} className={className}>
          {children}
        </Link>
      }
    >
      <ActiveLink {...props} />
    </Suspense>
  );
}
