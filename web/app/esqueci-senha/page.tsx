import type { Metadata } from "next";
import AuthCard from "@/app/components/auth/AuthCard";
import ForgotPasswordForm from "@/app/components/auth/ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Esqueci minha senha",
  robots: { index: false, follow: false },
};

export default function ForgotPasswordPage() {
  return (
    <AuthCard title="Esqueci minha senha" subtitle="Digite o e-mail da sua conta e enviaremos um link para criar uma nova senha.">
      <ForgotPasswordForm />
    </AuthCard>
  );
}
