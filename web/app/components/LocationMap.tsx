import { shelterAddressLine, siteConfig } from "@/app/lib/site";
import { MapPinIcon } from "./icons";

// Seção "Onde estamos": endereço + mapa do Google Maps incorporado.
// Usa o modo de incorporação simples do Google Maps (não precisa de chave de API).
// Reaproveitável em outras páginas (ex.: Contato).
export default function LocationMap({
  title = "Onde estamos",
  subtitle = "Nosso gatil fica no Grajaú, na Zona Norte do Rio de Janeiro.",
}: {
  title?: string;
  subtitle?: string;
}) {
  // Busca só pelo endereço: o nome do gatil só ajuda depois que ele tiver
  // um Perfil da Empresa no Google (aí dá para usar `${siteConfig.name}, ${shelterAddressLine}`).
  const address = encodeURIComponent(shelterAddressLine);

  return (
    <section
      aria-labelledby="location-title"
      className="grid items-center gap-10 bg-main-orange/[0.07] px-6 py-16 md:grid-cols-5 md:gap-12 md:px-12 md:py-20"
    >
      <div className="text-center md:col-span-2 md:text-left">
        <h2 id="location-title" className="text-3xl text-main-blue md:text-4xl">
          {title}
        </h2>
        <p className="mt-3 text-main-brown/80">{subtitle}</p>

        <address className="mt-6 flex items-start justify-center gap-3 not-italic text-main-brown md:justify-start">
          <MapPinIcon width={22} height={22} className="mt-0.5 shrink-0 text-main-orange" />
          <span className="text-left leading-relaxed">{shelterAddressLine}</span>
        </address>

        <a
          href={`https://www.google.com/maps/dir/?api=1&destination=${address}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-main-orange px-6 py-3 text-sm font-bold text-main-brown transition-colors hover:bg-main-blue hover:text-white"
        >
          Como chegar
        </a>
      </div>

      <div className="overflow-hidden rounded-3xl border border-black/5 shadow-lg md:col-span-3">
        <iframe
          title={`Mapa: localização do ${siteConfig.name}`}
          src={`https://www.google.com/maps?q=${address}&output=embed`}
          className="block aspect-[4/3] w-full md:aspect-[16/11]"
          loading="lazy" // só carrega quando o usuário chega perto do mapa
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>
    </section>
  );
}
