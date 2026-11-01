// "Esqueleto" mostrado enquanto a página de um gato ou produto carrega:
// blocos cinzas no lugar do título, da foto e das informações.
export default function DetailSkeleton({ label }: { label: string }) {
  const block = "animate-pulse rounded-2xl bg-main-brown/[0.07]";
  return (
    <div role="status" aria-label={label}>
      <div className="border-b border-main-orange/20 px-6 py-12 md:px-12">
        <div className={`${block} h-3 w-40`} />
        <div className={`${block} mt-5 h-11 w-2/3 max-w-md`} />
      </div>
      <div className="grid gap-10 px-6 py-12 md:grid-cols-2 md:gap-12 md:px-12 md:py-16">
        <div className={`${block} aspect-square rounded-3xl`} />
        <div className="space-y-4">
          <div className={`${block} h-9 w-1/3`} />
          <div className={`${block} h-4 w-full`} />
          <div className={`${block} h-4 w-5/6`} />
          <div className={`${block} h-4 w-2/3`} />
          <div className={`${block} mt-8 h-12 w-full rounded-full`} />
        </div>
      </div>
    </div>
  );
}
