import { redirect } from "next/navigation";
import { LoginClient } from "@/components/LoginClient";
import { getCurrentUserAccess, normalizeNextPath } from "@/lib/auth-access";

type LoginPageProps = {
  searchParams?: Promise<{ next?: string; mode?: string; state?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const nextPath = normalizeNextPath(params?.next, "/dashboard");
  const access = await getCurrentUserAccess({ claimEntitlement: true });

  if (access.hasAccess) {
    redirect(nextPath);
  }

  const notice =
    params?.state === "payment-approved"
      ? "Pagamento recebido. Ative o acesso com o mesmo e-mail usado no Mercado Pago."
      : params?.state === "signed-out"
        ? "Voce saiu da conta com seguranca."
        : params?.state === "callback-error"
          ? "Nao conseguimos concluir a confirmacao do e-mail. Tente entrar novamente."
          : access.authenticated && !access.hasAccess
            ? "Esta conta ainda nao tem acesso ativo. Use o mesmo e-mail da compra ou compre um acesso."
            : undefined;

  const initialMode = params?.state === "payment-approved" || params?.mode === "acesso"
    ? "acesso"
    : params?.mode === "cadastro"
      ? "cadastro"
      : "login";

  return <LoginClient initialMode={initialMode} nextPath={nextPath} notice={notice} />;
}
