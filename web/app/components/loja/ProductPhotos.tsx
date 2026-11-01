"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@/app/components/icons";
import type { ProductPhoto } from "@/app/lib/shop";

// Fotos do card: no celular, desliza com o dedo; setas discretas nas laterais
// (só quando há mais de uma foto). Clicar na foto abre a página do produto.
export default function ProductPhotos({ photos, href, name }: { photos: ProductPhoto[]; href: string; name: string }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);
  const many = photos.length > 1;

  function go(index: number) {
    const track = trackRef.current;
    if (!track) return;
    const next = (index + photos.length) % photos.length;
    track.scrollTo({ left: next * track.clientWidth, behavior: "smooth" });
  }

  return (
    <div className="group/photos relative size-full">
      <div
        ref={trackRef}
        onScroll={(e) => {
          const t = e.currentTarget;
          setCurrent(Math.round(t.scrollLeft / t.clientWidth));
        }}
        className="scrollbar-none flex size-full snap-x snap-mandatory overflow-x-auto"
      >
        {photos.map((p, i) => (
          <Link
            key={p.src + i}
            href={href}
            tabIndex={i === 0 ? 0 : -1}
            aria-label={i === 0 ? `Ver detalhes de ${name}` : undefined}
            aria-hidden={i === 0 ? undefined : true}
            className="relative block size-full shrink-0 snap-center"
          >
            <Image
              src={p.src}
              alt={i === 0 ? p.alt : ""}
              fill
              sizes="(min-width: 1024px) 250px, (min-width: 768px) 30vw, 50vw"
              className="object-cover transition duration-500 group-hover/photos:scale-[1.03]"
            />
          </Link>
        ))}
      </div>

      {many && (
        <>
          <button
            type="button"
            onClick={() => go(current - 1)}
            aria-label="Foto anterior"
            className="absolute left-1.5 top-1/2 grid size-7 -translate-y-1/2 place-items-center rounded-full bg-white/80 text-main-brown shadow-sm transition-opacity hover:bg-white sm:opacity-0 sm:group-hover/photos:opacity-100 sm:focus-visible:opacity-100"
          >
            <ChevronLeftIcon width={16} height={16} />
          </button>
          <button
            type="button"
            onClick={() => go(current + 1)}
            aria-label="Próxima foto"
            className="absolute right-1.5 top-1/2 grid size-7 -translate-y-1/2 place-items-center rounded-full bg-white/80 text-main-brown shadow-sm transition-opacity hover:bg-white sm:opacity-0 sm:group-hover/photos:opacity-100 sm:focus-visible:opacity-100"
          >
            <ChevronRightIcon width={16} height={16} />
          </button>
          <div aria-hidden className="pointer-events-none absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1">
            {photos.map((p, i) => (
              <span
                key={p.src + i}
                className={`size-1.5 rounded-full transition-colors ${i === current ? "bg-white" : "bg-white/50"}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
