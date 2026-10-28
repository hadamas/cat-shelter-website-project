import ButtonLink from "@/app/components/ui/ButtonLink";
import CopyField from "@/app/components/ui/CopyField";
import {
  BookIcon,
  BoxIcon,
  CalendarHeartIcon,
  CheckIcon,
  ExternalLinkIcon,
  PixIcon,
  ShirtIcon,
  ShoppingBagIcon,
  WhatsappIcon,
} from "@/app/components/icons";
import type { DonationCard } from "@/app/content/doacoes";
import { whatsappHref } from "@/app/lib/site";

const icons = {
  pix: PixIcon,
  monthly: CalendarHeartIcon,
  box: BoxIcon,
  bag: ShoppingBagIcon,
  shirt: ShirtIcon,
  book: BookIcon,
};

export default function DonationCardItem({ card }: { card: DonationCard }) {
  const Icon = icons[card.icon];
  const href = card.cta?.href ?? (card.cta?.whatsappMessage ? whatsappHref(card.cta.whatsappMessage) : undefined);
  const isWhatsapp = !card.cta?.href && Boolean(card.cta?.whatsappMessage);

  return (
    <article
      id={card.id}
      aria-labelledby={`${card.id}-title`}
      className="flex h-full scroll-mt-28 flex-col rounded-3xl border border-main-orange/25 bg-white p-6 text-center transition hover:border-main-blue/40 hover:shadow-lg md:p-7"
    >
      <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-main-blue/10 text-main-blue">
        <Icon width={28} height={28} strokeWidth={1.7} />
      </span>
      <h3 id={`${card.id}-title`} className="mt-4 text-2xl text-main-orange">
        {card.title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-main-brown/80">{card.description}</p>

      {card.items && (
        <ul className="mx-auto mt-4 space-y-1.5 text-left text-sm text-main-brown/90">
          {card.items.map((item) => (
            <li key={item} className="flex gap-2">
              <CheckIcon width={16} height={16} className="mt-0.5 shrink-0 text-main-blue" />
              {item}
            </li>
          ))}
        </ul>
      )}

      {/* empurra cupom/botão para o rodapé do card, alinhando os cards da mesma linha */}
      <div className="mt-auto space-y-3 pt-6">
        {card.copy && <CopyField label={card.copy.label} value={card.copy.value} />}

        {card.cta && href && (
          <ButtonLink href={href} external variant={card.copy ? "primary" : "outline"} className="w-full">
            {isWhatsapp && <WhatsappIcon width={16} height={16} />}
            {card.cta.label}
            {!isWhatsapp && <ExternalLinkIcon width={14} height={14} />}
          </ButtonLink>
        )}

        {card.cta && !href && card.soon && (
          <p className="rounded-2xl bg-main-blue/[0.06] px-4 py-3 text-xs text-main-brown/80">
            {card.soon}{" "}
            <a
              href={whatsappHref("Olá! Vim pelo site do Gatos de Francisca e gostaria de contribuir todo mês.")}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-main-blue underline-offset-2 hover:underline"
            >
              Abrir WhatsApp
            </a>
          </p>
        )}
      </div>
    </article>
  );
}
