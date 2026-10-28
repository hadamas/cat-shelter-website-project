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

export function MapPinIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21Z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </svg>
  );
}

// Vassoura (limpeza)
export function BroomIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M19 3 12.5 9.5" />
      <path d="M8.5 9.5 14.5 15.5" />
      <path d="M8.5 9.5c-2 .5-4 2.5-5 5.5L9 20.5c3-1 5-3 5.5-5" />
      <path d="M6 17.5 4.5 19M9.5 13.5l-3.5 3.5" />
    </svg>
  );
}

// Tigela (alimentação)
export function BowlIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M3 11h18a9 9 0 0 1-18 0Z" />
      <path d="M8 7.5c1-1 2-1 3 0s2 1 3 0 2-1 3 0" />
    </svg>
  );
}

// Cápsula (medicação)
export function PillIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="2.5" y="8.5" width="19" height="7" rx="3.5" transform="rotate(-45 12 12)" />
      <path d="m8.5 8.5 7 7" />
    </svg>
  );
}

// Balão de festa (eventos)
export function BalloonIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 15c-3.3 0-6-3-6-6.5S8.7 2.5 12 2.5s6 2.5 6 6-2.7 6.5-6 6.5Z" />
      <path d="m11 15-.8 1.5h3.6L13 15" />
      <path d="M12 16.5c0 2-2 2.5-2 5" />
    </svg>
  );
}

// Barraca de feira (feiras de adoção)
export function TentIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M3 9.5 5 4h14l2 5.5" />
      <path d="M3 9.5c0 1.4 1 2.5 2.25 2.5S7.5 10.9 7.5 9.5c0 1.4 1 2.5 2.25 2.5S12 10.9 12 9.5c0 1.4 1 2.5 2.25 2.5s2.25-1.1 2.25-2.5c0 1.4 1 2.5 2.25 2.5S21 10.9 21 9.5" />
      <path d="M5 12v9h14v-9M10 21v-5h4v5" />
    </svg>
  );
}

export function CameraIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 7.5h3l1.5-2.5h7L17 7.5h3a1 1 0 0 1 1 1V19a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8.5a1 1 0 0 1 1-1Z" />
      <circle cx="12" cy="13.5" r="3.5" />
    </svg>
  );
}

export function SunIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  );
}

export function MoonIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5Z" />
    </svg>
  );
}

export function ExternalLinkIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M14 4h6v6M20 4l-9 9" />
      <path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
    </svg>
  );
}

// Caixa (doação de itens)
export function BoxIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="m3 7.5 9-4.5 9 4.5v9L12 21l-9-4.5Z" />
      <path d="m3 7.5 9 4.5 9-4.5M12 12v9" />
      <path d="m7.5 5.2 9 4.6" />
    </svg>
  );
}

// Sacola de compras
export function ShoppingBagIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M5 8h14l-1 12.5H6Z" />
      <path d="M9 10V6.5a3 3 0 0 1 6 0V10" />
    </svg>
  );
}

// Calendário com coração (contribuição mensal)
export function CalendarHeartIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18M8 3v4M16 3v4" />
      <path d="M12 18.5c-1.6-1.2-3-2.2-3-3.5a1.5 1.5 0 0 1 3-.6 1.5 1.5 0 0 1 3 .6c0 1.3-1.4 2.3-3 3.5Z" />
    </svg>
  );
}
