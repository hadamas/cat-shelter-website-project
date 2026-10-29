import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon, CakeIcon, HomeIcon } from "@/app/components/icons";
import ButtonLink from "@/app/components/ui/ButtonLink";
import { adoptCta, adoptionFormUrl } from "@/app/content/adocao";
import type { Cat } from "@/app/lib/cats";
import { formatMonths, monthsBetween } from "@/app/lib/dates";
import SexBadge from "./SexBadge";
import { EditCatButton } from "./admin/AdminCatButtons";

// Card de um gatinho na listagem.
// Foto, nome e "Conhecer" levam à página do gatinho; "Quero adotar" abre o formulário.
// Admins veem também um botão de editar (lápis) sobre a foto.
export default function CatCard({ cat, today }: { cat: Cat; today: string }) {
  const href = `/como-ajudar/adote/${cat.slug}`;
  const photo = cat.photos[0];

  return (
    <article className="relative flex h-full flex-col overflow-hidden rounded-3xl border border-main-orange/20 bg-white transition hover:-translate-y-1 hover:shadow-lg">
      <EditCatButton cat={cat} />
      <Link href={href} className="relative block aspect-square overflow-hidden bg-main-orange/10" tabIndex={-1} aria-hidden>
        {photo && (
          <Image
            src={photo.src}
            alt=""
            fill
            sizes="(min-width: 1024px) 230px, (min-width: 768px) 30vw, 50vw"
            className="object-cover transition duration-500 hover:scale-105"
          />
        )}
      </Link>

      <div className="flex flex-1 flex-col p-3 sm:p-4">
        <div className="flex items-center justify-between gap-2">
          <h3 className="truncate text-xl text-main-orange sm:text-2xl">
            <Link href={href} className="hover:text-main-blue">
              {cat.name}
            </Link>
          </h3>
          <SexBadge sex={cat.sex} />
        </div>

        <dl className="mt-2 space-y-1 text-xs text-main-brown/80 sm:text-sm">
          <div className="flex items-center gap-1.5">
            <dt>
              <CakeIcon width={15} height={15} className="text-main-orange" aria-hidden />
              <span className="sr-only">Idade</span>
            </dt>
            <dd>{formatMonths(monthsBetween(cat.birthDate, today))}</dd>
          </div>
          <div className="flex items-center gap-1.5">
            <dt>
              <HomeIcon width={15} height={15} className="text-main-orange" aria-hidden />
              <span className="sr-only">Tempo no gatil</span>
            </dt>
            <dd>No gatil há {formatMonths(monthsBetween(cat.arrivalDate, today))}</dd>
          </div>
        </dl>

        <Link
          href={href}
          className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-main-blue hover:underline"
        >
          Conhecer <span className="sr-only">{cat.name}</span>
          <ArrowRightIcon width={14} height={14} aria-hidden />
        </Link>

        <div className="mt-auto pt-4">
          <ButtonLink href={adoptionFormUrl} external className="w-full px-3! py-2.5!">
            {adoptCta}
            <span className="sr-only"> {cat.name}</span>
          </ButtonLink>
        </div>
      </div>
    </article>
  );
}
