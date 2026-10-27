// Ícones SVG inline: zero dependências e zero requisições extras.
type IconProps = React.SVGProps<SVGSVGElement>;

const base = {
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export function SearchIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

export function ChevronDownIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export function MenuIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

export function InstagramIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
    </svg>
  );
}

// Roupa (brechó)
export function ShirtIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M9 3 4 5.5 2.5 10l3 1.5V21h13v-9.5l3-1.5L20 5.5 15 3a3 3 0 0 1-6 0Z" />
    </svg>
  );
}

// Livro (sebo)
export function BookIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 6c-1.5-1.3-4-2-8-2v14c4 0 6.5.7 8 2 1.5-1.3 4-2 8-2V4c-4 0-6.5.7-8 2Z" />
      <path d="M12 6v14" />
    </svg>
  );
}

export function UserIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4 3.6-6.5 8-6.5s8 2.5 8 6.5" />
    </svg>
  );
}

// Balão de conversa com telefone (WhatsApp)
export function WhatsappIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M3.5 20.5 5 16a8.5 8.5 0 1 1 3.2 3.3Z" />
      <path d="M9 9.2c0 3 2.8 5.8 5.8 5.8l1-1.6-2-1-1 .8a4.6 4.6 0 0 1-2-2l.8-1-1-2Z" />
    </svg>
  );
}

// Losango (Pix)
export function PixIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="m12 3 9 9-9 9-9-9Z" />
      <path d="m8 12 4-4 4 4-4 4Z" />
    </svg>
  );
}

export function CopyIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="9" y="9" width="11" height="11" rx="2" />
      <path d="M5 15V6a2 2 0 0 1 2-2h9" />
    </svg>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="m5 12 5 5L20 7" />
    </svg>
  );
}

export function FacebookIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M15 3h-2.5A3.5 3.5 0 0 0 9 6.5V9H7v3h2v9h3v-9h2.5l.5-3h-3V7a1 1 0 0 1 1-1H15Z" />
    </svg>
  );
}

export function ArrowRightIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

// Mão segurando um coração (doação)
export function HandHeartIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 11.5c-2.2-1.7-4-3.2-4-5.1A2.1 2.1 0 0 1 12 5.3a2.1 2.1 0 0 1 4 1.1c0 1.9-1.8 3.4-4 5.1Z" />
      <path d="M2 14.5h3.5l3-1.2h4a1.6 1.6 0 0 1 0 3.2H9.5" />
      <path d="M12.5 16.5 18 13.8a1.7 1.7 0 0 1 2 2.6L14 20.5H6.5L4 21.5" />
    </svg>
  );
}

// Cabeça de gato
export function CatIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M5 9.2V3.5l4 3.3h6l4-3.3v5.7c.9 1.3 1.5 2.8 1.5 4.4 0 4.2-3.8 7.4-8.5 7.4s-8.5-3.2-8.5-7.4c0-1.6.6-3.1 1.5-4.4Z" />
      <path d="M9 12.5v.5M15 12.5v.5" />
      <path d="m11 15.5 1 .8 1-.8" />
    </svg>
  );
}

// Casa com coração (adoção)
export function HomeHeartIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M3 11 12 3l9 8" />
      <path d="M5 9.5V21h14V9.5" />
      <path d="M12 18c-1.7-1.3-3-2.4-3-3.8a1.5 1.5 0 0 1 3-.6 1.5 1.5 0 0 1 3 .6c0 1.4-1.3 2.5-3 3.8Z" />
    </svg>
  );
}

export function CalendarIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18M8 3v4M16 3v4" />
    </svg>
  );
}

// Escudo com cruz (saúde / castração)
export function HealthIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="m12 3 7 3v5c0 5-3.5 8.5-7 10-3.5-1.5-7-5-7-10V6Z" />
      <path d="M12 9v6M9 12h6" />
    </svg>
  );
}

// Patinha preenchida (espaços reservados de imagens)
export function PawIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <ellipse cx="6" cy="10" rx="2.1" ry="2.7" />
      <ellipse cx="10" cy="5.5" rx="2.2" ry="2.9" />
      <ellipse cx="14" cy="5.5" rx="2.2" ry="2.9" />
      <ellipse cx="18" cy="10" rx="2.1" ry="2.7" />
      <path d="M12 11c-2.8 0-6 3.6-6 6.3 0 2 1.5 2.8 3.1 2.8 1.2 0 2-.6 2.9-.6s1.7.6 2.9.6c1.6 0 3.1-.8 3.1-2.8 0-2.7-3.2-6.3-6-6.3Z" />
    </svg>
  );
}
