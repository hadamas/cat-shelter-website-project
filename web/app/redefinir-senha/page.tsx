import type { Metadata } from "next";
import AuthCard from "@/app/components/auth/AuthCard";
import ResetPasswordForm from "@/app/components/auth/ResetPasswordForm";

export const metadata: Metadata = {
  title: "Criar nova senha",
  robots: { index: false, follow: false },
};

export default function ResetPasswordPage() {
  return (
    <AuthCard title="Criar nova senha" subtitle="Escolha a senha que você vai usar para entrar no site.">
      <ResetPasswordForm />
    </AuthCard>
  );
}
