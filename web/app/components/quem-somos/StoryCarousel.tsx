"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { ImageRef } from "@/app/content/quem-somos";

// Fotos empilhadas que se alternam com fade (opacidade) a cada `intervalMs`.
// Pausa quando o mouse está em cima e quando a aba do navegador não está visível.
export default function StoryCarousel({ images, intervalMs = 5000 }: { images: ImageRef[]; intervalMs?: number }) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || images.length < 2) return;
    const id = setInterval(() => {
      if (document.visibilityState === "visible") setCurrent((i) => (i + 1) % images.length);
    }, intervalMs);
    return () => clearInterval(id);
  }, [paused, images.length, intervalMs]);

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] bg-main-orange/10 shadow-xl">
        {images.map((img, i) => (
          <Image
            key={img.src}
            src={img.src}
            alt={img.alt}
            fill
            sizes="(min-width: 1152px) 480px, (min-width: 768px) 45vw, 100vw"
            loading={i === 0 ? "eager" : "lazy"}
            aria-hidden={i !== current}
            className={`object-cover transition-opacity duration-1000 ease-in-out ${
              i === current ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
      </div>

      {/* Indicadores: também permitem escolher a foto */}
      <div className="mt-4 flex justify-center gap-2">
        {images.map((img, i) => (
          <button
            key={img.src}
            type="button"
            onClick={() => setCurrent(i)}
            aria-label={`Mostrar foto ${i + 1} de ${images.length}`}
            aria-current={i === current}
            className={`h-2 rounded-full transition-all ${
              i === current ? "w-6 bg-main-orange" : "w-2 bg-main-brown/20 hover:bg-main-brown/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
