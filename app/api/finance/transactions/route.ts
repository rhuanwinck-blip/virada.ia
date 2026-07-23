import { NextResponse } from "next/server";
import { FinanceAuthError, getFinanceAccessContext } from "@/lib/finance-access";
import { buildFinancialOverview, getFinancialDataProvider, type FinancialCategory } from "@/lib/financial-provider";
import { listFinancialSyncTargets } from "@/lib/financial-sync";

export async function GET(request: Request) {
  try {
    const context = await getFinanceAccessContext();
    const { searchParams } = new URL(request.url);
    const provider = getFinancialDataProvider();
    const connectionId = searchParams.get("connectionId") ?? undefined;
    const category = (searchParams.get("category") as FinancialCategory | null) ?? undefined;
    const targetIds =
      context.production && !context.sandbox && !connectionId
        ? (await listFinancialSyncTargets(context.userId)).map((connection) => connection.id)
        : [connectionId];

    const snapshots = await Promise.all(
      targetIds.map(async (targetId) => ({
        accounts: await provider.listAccounts(targetId),
        bills: await provider.listBills(targetId),
        transactions: await provider.listTransactions({
          connectionId: targetId,
          from: searchParams.get("from") ?? undefined,
          to: searchParams.get("to") ?? undefined,
          category
        })
      }))
    );

    const transactions = snapshots.flatMap((snapshot) => snapshot.transactions);
    const accounts = snapshots.flatMap((snapshot) => snapshot.accounts);
    const bills = snapshots.flatMap((snapshot) => snapshot.bills);

    return NextResponse.json({
      provider: provider.name,
      sandbox: transactions.length ? transactions.every((transaction) => transaction.sandbox) : context.sandbox,
      authenticated: context.authenticated,
      readOnly: true,
      rawDataPreserved: true,
      userCorrectionsStoredSeparately: true,
      transactions,
      overview: buildFinancialOverview(accounts, transactions, bills)
    });
  } catch (error) {
    if (error instanceof FinanceAuthError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    throw error;
  }
}
