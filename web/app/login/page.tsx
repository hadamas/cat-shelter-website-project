import type { Metadata } from "next";
import AuthCard from "@/app/components/auth/AuthCard";
import LoginForm from "@/app/components/auth/LoginForm";
import { whatsappHref } from "@/app/lib/site";

export const metadata: Metadata = {
  title: "Entrar",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <AuthCard
      title="Entrar"
      subtitle={
        <>
          Área exclusiva para voluntários e administradores. Ainda não tem acesso?{" "}
          <a
            href={whatsappHref("Olá! Sou voluntário(a) do Gatos de Francisca e gostaria de acesso à área do site.")}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-main-blue hover:underline"
          >
            Fale com a gente
          </a>
          .
        </>
      }
    >
      <LoginForm />
    </AuthCard>
  );
}
