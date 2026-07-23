import { NextResponse } from "next/server";
import { z } from "zod";
import { FinanceAuthError, getFinanceAccessContext } from "@/lib/finance-access";
import { isValidCronRequest, runFinancialCronSync, runFinancialSync } from "@/lib/financial-sync";

const schema = z.object({
  connectionId: z.string().optional(),
  kind: z.enum(["initial", "incremental", "manual", "webhook"]).default("manual"),
  from: z.string().optional(),
  to: z.string().optional(),
  force: z.boolean().optional()
});

export async function GET(request: Request) {
  if (!isValidCronRequest(request)) {
    return NextResponse.json({ error: "invalid_cron_secret" }, { status: 401 });
  }

  return NextResponse.json(await runFinancialCronSync());
}

export async function POST(request: Request) {
  try {
    const parsed = schema.safeParse(await request.json().catch(() => ({})));
    if (!parsed.success) {
      return NextResponse.json({ error: "invalid_financial_sync_payload" }, { status: 400 });
    }

    const context = await getFinanceAccessContext();
    const result = await runFinancialSync({
      userId: context.userId,
      ...parsed.data
    });

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof FinanceAuthError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    throw error;
  }
}
