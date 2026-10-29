import Link from "next/link";
import { contactInfo, languages, whatsappHref } from "@/app/lib/site";
import CopyPix from "./CopyPix";
import { WhatsappIcon } from "./icons";
import UserMenu from "./auth/UserMenu";

// Faixa discreta acima do header. Rola junto com a página;
// só o Header principal fica fixo no topo.
export default function TopBar() {
  const current = "pt"; // TODO: virá da rota quando implementarmos os idiomas

  return (
    <div className="border-b border-main-blue/10 bg-[#f0f9fc] text-xs text-main-brown/80">
      <div className="mx-auto flex h-9 max-w-6xl items-center justify-between gap-4 px-4">
        <div className="flex min-w-0 items-center gap-4">
          <p className="hidden truncate lg:block">{contactInfo.tagline}</p>
          <span aria-hidden className="hidden h-3 w-px bg-main-brown/20 lg:block" />
          <a
            href={whatsappHref()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 transition-colors hover:text-main-blue"
          >
            <WhatsappIcon width={14} height={14} />
            <span className="hidden sm:inline">WhatsApp:</span>
            <span className="font-semibold">{contactInfo.whatsappLabel}</span>
          </a>
          <span aria-hidden className="hidden h-3 w-px bg-main-brown/20 md:block" />
          <span className="hidden md:inline-flex">
            <CopyPix pixKey={contactInfo.pixKey} />
          </span>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <UserMenu />
          <span aria-hidden className="h-3 w-px bg-main-brown/20" />
          <ul className="flex items-center gap-1" aria-label="Idioma">
            {languages.map((lang) => {
              const active = lang.code === current;
              return (
                <li key={lang.code}>
                  <Link
                    href={lang.code === "pt" ? "/" : `/${lang.code}`}
                    prefetch={false}
                    lang={lang.code}
                    hrefLang={lang.code}
                    aria-current={active ? "true" : undefined}
                    title={lang.name}
                    className={
                      active
                        ? "rounded px-1.5 py-0.5 font-semibold text-main-blue"
                        : "rounded px-1.5 py-0.5 transition-colors hover:text-main-blue"
                    }
                  >
                    {lang.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
