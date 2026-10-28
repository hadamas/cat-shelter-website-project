"use client";

import Image from "next/image";
import { useState } from "react";
import type { CatPhoto } from "@/app/lib/cats";

// Foto grande + miniaturas clicáveis (as miniaturas só aparecem se houver mais de uma foto).
export default function PhotoGallery({ photos, name }: { photos: CatPhoto[]; name: string }) {
  const [current, setCurrent] = useState(0);
  const photo = photos[current];
  if (!photo) return null;

  return (
    <div>
      <div className="relative aspect-square overflow-hidden rounded-3xl bg-main-orange/10 shadow-lg">
        <Image
          key={photo.src + current}
          src={photo.src}
          alt={photo.alt}
          fill
          preload={current === 0}
          sizes="(min-width: 1152px) 520px, (min-width: 768px) 45vw, 100vw"
          className="animate-[fadeIn_.4s_ease] object-cover"
        />
      </div>

      {photos.length > 1 && (
        <ul className="mt-3 flex flex-wrap gap-2" aria-label={`Fotos de ${name}`}>
          {photos.map((p, i) => (
            <li key={p.src + i}>
              <button
                type="button"
                onClick={() => setCurrent(i)}
                aria-label={`Ver foto ${i + 1} de ${photos.length}`}
                aria-current={i === current}
                className={`relative block size-16 overflow-hidden rounded-xl ring-2 transition sm:size-20 ${
                  i === current ? "ring-main-orange" : "ring-transparent opacity-70 hover:opacity-100"
                }`}
              >
                <Image src={p.src} alt="" fill sizes="80px" className="object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
