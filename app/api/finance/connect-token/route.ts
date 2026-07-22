import { NextResponse } from "next/server";
import { z } from "zod";
import { getFinancialDataProvider } from "@/lib/financial-provider";

const schema = z.object({
  userId: z.string().min(2).default("demo-user"),
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
  const parsed = schema.safeParse(await request.json().catch(() => ({})));

  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_connect_token_payload" }, { status: 400 });
  }

  const url = new URL(request.url);
  const provider = getFinancialDataProvider();
  const token = await provider.createConnectToken({
    ...parsed.data,
    webhookUrl: `${url.origin}/api/finance/webhook/pluggy`
  });

  return NextResponse.json({
    ...token,
    readOnly: true,
    bankPasswordHandledByProvider: true,
    bankCredentialsStoredByVirada: false,
    externalActionCreated: false
  });
}
