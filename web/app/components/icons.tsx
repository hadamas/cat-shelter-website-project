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
