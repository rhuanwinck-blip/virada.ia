import { NextResponse } from "next/server";
import { getFinancialDataProvider } from "@/lib/financial-provider";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const connectionId = searchParams.get("connectionId") ?? undefined;
  const provider = getFinancialDataProvider();
  const [accounts, balances] = await Promise.all([
    provider.listAccounts(connectionId),
    provider.listBalances(connectionId)
  ]);

  return NextResponse.json({
    provider: provider.name,
    sandbox: accounts.every((account) => account.sandbox),
    readOnly: true,
    accounts,
    balances
  });
}
