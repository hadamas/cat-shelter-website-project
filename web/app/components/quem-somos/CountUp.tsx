"use client";

import { useEffect, useRef } from "react";

// Número que conta de 0 até `value` quando aparece na tela (uma vez só).
// - O HTML já vem com o número final (bom para SEO e para quem está sem JavaScript).
// - Ao carregar, se o número ainda não está visível, ele volta para 0 e espera o usuário rolar até ele.
// - A contagem atualiza o texto direto no DOM, sem re-renderizar o React a cada quadro.
export default function CountUp({
  value,
  prefix = "",
  suffix = "",
  duration = 1600,
  className = "",
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const format = (n: number) => `${prefix}${n.toLocaleString("pt-BR")}${suffix}`;
    let frame = 0;

    const animate = () => {
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - t, 3); // começa rápido e desacelera no final
        el.textContent = format(Math.round(eased * value));
        if (t < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    };

    el.textContent = format(0);
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          animate();
          observer.disconnect();
        }
      },
      { threshold: 0.5 },
    );
    observer.observe(el);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value, prefix, suffix, duration]);

  return (
    <>
      <span ref={ref} aria-hidden="true" className={className}>
        {`${prefix}${value.toLocaleString("pt-BR")}${suffix}`}
      </span>
      {/* leitores de tela ouvem só o valor final, sem a contagem */}
      <span className="sr-only">{`${prefix}${value}${suffix}`}</span>
    </>
  );
}
