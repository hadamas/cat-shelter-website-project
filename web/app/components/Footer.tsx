import Image from "next/image";
import Link from "next/link";
import { cacheLife } from "next/cache";
import { navItems, siteConfig, socialLinks } from "@/app/lib/site";
import NavLink from "./NavLink";
import { BookIcon, FacebookIcon, InstagramIcon, ShirtIcon } from "./icons";

const socials = [
  { label: "Instagram do gatil", href: socialLinks.instagram, Icon: InstagramIcon },
  { label: "Facebook do gatil", href: socialLinks.facebook, Icon: FacebookIcon },
  { label: "Instagram do brechó", href: socialLinks.brecho, Icon: ShirtIcon },
  { label: "Instagram do sebo de livros", href: socialLinks.sebo, Icon: BookIcon },
];

// Com cacheComponents ativo, valores que mudam (como a data atual) não podem
// ser lidos direto num componente pré-renderizado. "use cache" calcula o ano
// no build e revalida diariamente — o footer continua estático e rápido.
async function CopyrightYear() {
  "use cache";
  cacheLife("days");
  return new Date().getFullYear();
}

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-black/5 bg-white">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex flex-col items-center gap-6 py-8 md:flex-row md:justify-between">
          <Link href="/" aria-label="Gatos de Francisca — página inicial">
            <Image
              src="/images/logo.png"
              alt="Gatos de Francisca"
              width={1014}
              height={589}
              sizes="80px"
              className="h-12 w-auto"
            />
          </Link>

          <nav aria-label="Rodapé">
            <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-main-brown/80">
              {navItems.map((item) => (
                <li key={item.label}>
                  <NavLink
                    href={item.href}
                    className="transition-colors hover:text-main-blue"
                    activeClassName="text-main-blue"
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <ul className="flex items-center gap-3">
            {socials.map(({ label, href, Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  title={label}
                  className="grid size-9 place-items-center rounded-lg bg-main-blue/10 text-main-blue transition-colors hover:bg-main-blue hover:text-white"
                >
                  <Icon width={18} height={18} />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <p className="border-t border-black/10 py-5 text-center text-xs text-main-brown/70">
          © <CopyrightYear /> {siteConfig.name}. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
