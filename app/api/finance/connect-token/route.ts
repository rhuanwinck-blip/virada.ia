import { NextResponse } from "next/server";
import { z } from "zod";
import { FinanceAuthError, getFinanceAccessContext } from "@/lib/finance-access";
import { getFinancialDataProvider } from "@/lib/financial-provider";

const schema = z.object({
  redirectUrl: z.string().url().optional(),
  connectionId: z.string().optional()
});

export async function GET() {
  return NextResponse.json({
    provider: process.env.FINANCIAL_DATA_PROVIDER ?? "pluggy",
    sandbox: process.env.OPEN_FINANCE_SANDBOX !== "false",
    readOnly: true,
    asksForBankPassword: false,
    paymentInitiationEnabled: false
  });
}

export async function POST(request: Request) {
  try {
    const parsed = schema.safeParse(await request.json().catch(() => ({})));

    if (!parsed.success) {
      return NextResponse.json({ error: "invalid_connect_token_payload" }, { status: 400 });
    }

    const context = await getFinanceAccessContext();
    const url = new URL(request.url);
    const provider = getFinancialDataProvider();
    const token = await provider.createConnectToken({
      userId: context.userId,
      ...parsed.data,
      webhookUrl: `${url.origin}/api/finance/webhook/pluggy`
    });

    return NextResponse.json({
      ...token,
      authenticated: context.authenticated,
      readOnly: true,
      bankPasswordHandledByProvider: true,
      bankCredentialsStoredByVirada: false,
      externalActionCreated: false
    });
  } catch (error) {
    if (error instanceof FinanceAuthError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    throw error;
  }
}
