import { createSupabaseServerClient } from "@/lib/supabase";
import { getRuntimeEnv, isDemoMode } from "@/lib/security";

export type FinanceAccessContext = {
  userId: string;
  authenticated: boolean;
  demo: boolean;
  sandbox: boolean;
  production: boolean;
};

const demoUserId = "demo-user";

export async function getFinanceAccessContext(): Promise<FinanceAccessContext> {
  const env = getRuntimeEnv();
  const demo = isDemoMode();
  const sandbox = env.OPEN_FINANCE_SANDBOX !== "false";
  const production = env.APP_ENV === "production";
  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = supabase ? await supabase.auth.getUser() : { data: { user: null } };

  if (user?.id) {
    return {
      userId: user.id,
      authenticated: true,
      demo,
      sandbox,
      production
    };
  }

  if (demo || sandbox || !production) {
    return {
      userId: env.OPEN_FINANCE_SYSTEM_USER_ID ?? demoUserId,
      authenticated: false,
      demo,
      sandbox: true,
      production
    };
  }

  throw new FinanceAuthError("finance_auth_required");
}

export function assertFinancialProductionAllowed(context: FinanceAccessContext) {
  if (context.production && !context.demo && !context.sandbox && !context.authenticated) {
    throw new FinanceAuthError("finance_auth_required");
  }
}

export function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

export class FinanceAuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "FinanceAuthError";
  }
}
