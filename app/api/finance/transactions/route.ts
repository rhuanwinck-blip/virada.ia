import { NextResponse } from "next/server";
import { buildFinancialOverview, getFinancialDataProvider, type FinancialCategory } from "@/lib/financial-provider";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const provider = getFinancialDataProvider();
  const transactions = await provider.listTransactions({
    connectionId: searchParams.get("connectionId") ?? undefined,
    from: searchParams.get("from") ?? undefined,
    to: searchParams.get("to") ?? undefined,
    category: (searchParams.get("category") as FinancialCategory | null) ?? undefined
  });

  const accounts = await provider.listAccounts(searchParams.get("connectionId") ?? undefined);
  const bills = await provider.listBills(searchParams.get("connectionId") ?? undefined);

  return NextResponse.json({
    provider: provider.name,
    sandbox: transactions.every((transaction) => transaction.sandbox),
    readOnly: true,
    rawDataPreserved: true,
    userCorrectionsStoredSeparately: true,
    transactions,
    overview: buildFinancialOverview(accounts, transactions, bills)
  });
}
