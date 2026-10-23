import Image from "next/image";
import Link from "next/link";
import { donationHref, navItems } from "@/app/lib/site";
import { ChevronDownIcon, MenuIcon, SearchIcon } from "./icons";

// Server Component: o dropdown funciona só com CSS (hover + foco pelo teclado),
// então nenhum JavaScript é enviado ao navegador por este componente.
export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between gap-6 px-4">
        <Link href="/" aria-label="Gatos de Francisca — página inicial" className="shrink-0">
          <Image
            src="/images/logo.png"
            alt="Gatos de Francisca"
            width={1014}
            height={589}
            loading="eager"
            fetchPriority="high"
            sizes="96px"
            className="h-14 w-auto"
          />
        </Link>

        {/* Navegação desktop */}
        <nav aria-label="Principal" className="hidden md:block">
          <ul className="flex items-center gap-8 text-sm font-medium text-main-brown">
            {navItems.map((item) =>
              item.children ? (
                <li key={item.label} className="group relative">
                  <Link
                    href={item.href}
                    aria-haspopup="true"
                    className="flex items-center gap-1 py-2 transition-colors hover:text-main-blue"
                  >
                    {item.label}
                    <ChevronDownIcon
                      width={16}
                      height={16}
                      className="transition-transform group-hover:rotate-180 group-focus-within:rotate-180"
                    />
                  </Link>
                  <ul className="invisible absolute left-1/2 top-full w-52 -translate-x-1/2 translate-y-1 rounded-xl border border-black/5 bg-white p-2 opacity-0 shadow-lg transition-all group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                    {item.children.map((child) => (
                      <li key={child.label}>
                        <Link
                          href={child.href}
                          className="block rounded-lg px-3 py-2 transition-colors hover:bg-main-orange/15 hover:text-main-blue"
                        >
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
              ) : (
                <li key={item.label}>
                  <Link href={item.href} className="py-2 transition-colors hover:text-main-blue">
                    {item.label}
                  </Link>
                </li>
              ),
            )}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          {/* Busca: funcionalidade será implementada depois */}
          <button
            type="button"
            aria-label="Buscar"
            className="grid size-11 place-items-center rounded-full border border-main-brown/20 text-main-brown transition-colors hover:border-main-blue hover:text-main-blue"
          >
            <SearchIcon />
          </button>
          <Link
            href={donationHref}
            className="hidden rounded-full bg-main-orange px-6 py-3 text-sm font-bold text-main-brown transition-colors hover:bg-main-blue hover:text-white sm:inline-block"
          >
            Doação
          </Link>

          {/* Menu mobile: <details> nativo, sem JavaScript */}
          <details className="group/menu relative md:hidden">
            <summary
              aria-label="Abrir menu"
              className="grid size-11 cursor-pointer list-none place-items-center rounded-full border border-main-brown/20 text-main-brown [&::-webkit-details-marker]:hidden"
            >
              <MenuIcon />
            </summary>
            <nav
              aria-label="Menu mobile"
              className="absolute right-0 top-14 w-64 rounded-xl border border-black/5 bg-white p-3 shadow-lg"
            >
              <ul className="flex flex-col text-main-brown">
                {navItems.map((item) => (
                  <li key={item.label}>
                    <Link href={item.href} className="block rounded-lg px-3 py-2 font-medium hover:bg-main-orange/15">
                      {item.label}
                    </Link>
                    {item.children && (
                      <ul className="ml-3 border-l border-main-orange/40 pl-2">
                        {item.children.map((child) => (
                          <li key={child.label}>
                            <Link href={child.href} className="block rounded-lg px-3 py-1.5 text-sm hover:bg-main-orange/15">
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
                <li className="mt-2">
                  <Link
                    href={donationHref}
                    className="block rounded-full bg-main-orange px-4 py-2 text-center font-bold text-main-brown"
                  >
                    Doação
                  </Link>
                </li>
              </ul>
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}
