"use client";

import { useEffect, useRef } from "react";

// Vídeo decorativo do Hero: começa a tocar sozinho ao carregar a página,
// sem som e em loop.
// - muted + playsInline são obrigatórios para o autoplay funcionar
//   (principalmente no iPhone e no Chrome).
// - O play() no useEffect garante o início mesmo se o navegador ignorar
//   o atributo autoPlay durante a hidratação do React.
export default function HeroVideo({
  src,
  poster,
  className = "",
}: {
  src: string;
  poster: string;
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    video.muted = true;
    video.play().catch(() => {
      // Se o navegador bloquear (ex.: modo economia de bateria), a imagem de capa continua visível.
    });
  }, []);

  return (
    <video
      ref={ref}
      className={className}
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      autoPlay
      preload="auto"
      aria-hidden="true"
      tabIndex={-1}
    />
  );
}
