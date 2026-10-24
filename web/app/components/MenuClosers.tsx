"use client";

// Agora que cada item do menu é uma página, o layout (e o header) continua
// montado durante a navegação. Estes wrappers fecham o menu quando um link
// é clicado — senão o dropdown/menu mobile ficaria aberto na página nova.

type Props = { className?: string; children: React.ReactNode };

function closeMenus(e: React.MouseEvent<HTMLElement>) {
  if (!(e.target as HTMLElement).closest("a")) return;
  const el = e.currentTarget;
  if (el instanceof HTMLDetailsElement) el.open = false;
  // tira o foco do link, senão o dropdown (aberto via :focus-within) continua visível
  (document.activeElement as HTMLElement | null)?.blur();
}

export function ClosingDetails({ className, children }: Props) {
  return (
    <details className={className} onClick={closeMenus}>
      {children}
    </details>
  );
}

export function ClosingLi({ className, children }: Props) {
  return (
    <li className={className} onClick={closeMenus}>
      {children}
    </li>
  );
}
