import Image from "next/image";
import Link from "next/link";

// Moldura das telas de login/senha: formulário à esquerda e foto à direita
// (a foto só aparece em telas maiores), seguindo o wireframe.
export default function AuthCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-main-orange/[0.07] px-4 py-10 md:px-12 md:py-16">
      <div className="mx-auto grid max-w-4xl overflow-hidden rounded-3xl bg-white shadow-lg md:grid-cols-2">
        <div className="p-8 sm:p-10">
          <Link href="/" aria-label="Gatos de Francisca — página inicial" className="inline-block">
            <Image src="/images/logo.png" alt="Gatos de Francisca" width={1014} height={589} sizes="96px" className="h-12 w-auto" />
          </Link>
          <h1 className="mt-8 text-4xl text-main-blue">{title}</h1>
          {subtitle && <div className="mt-2 text-sm text-main-brown/75">{subtitle}</div>}
          <div className="mt-8">{children}</div>
        </div>
        {/* Ilustração (só em telas maiores), sobre o mesmo azul da página de Contato */}
        <div className="relative hidden bg-[#baeffd] md:block">
          <Image
            src="/images/login/worker.webp"
            alt=""
            fill
            sizes="450px"
            className="object-contain object-bottom p-10 pb-0"
          />
        </div>
      </div>
    </section>
  );
}
