import Link from "next/link";

export default function NotFound() {
  return (
    <section className="px-6 py-24 text-center md:px-12">
      <p className="text-6xl" aria-hidden>
        🐾
      </p>
      <h1 className="mt-4 text-4xl text-main-blue">Página não encontrada</h1>
      <p className="mt-3 text-main-brown/80">Parece que esse gatinho fugiu… a página que você procura não existe.</p>
      <Link
        href="/"
        className="mt-8 inline-block rounded-full bg-main-orange px-6 py-3 font-bold text-main-brown transition-colors hover:bg-main-blue hover:text-white"
      >
        Voltar para a Home
      </Link>
    </section>
  );
}
