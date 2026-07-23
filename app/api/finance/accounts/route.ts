import { NextResponse } from "next/server";
import { FinanceAuthError, getFinanceAccessContext } from "@/lib/finance-access";
import { getFinancialDataProvider } from "@/lib/financial-provider";
import { listFinancialSyncTargets } from "@/lib/financial-sync";

export async function GET(request: Request) {
  try {
    const context = await getFinanceAccessContext();
    const { searchParams } = new URL(request.url);
    const connectionId = searchParams.get("connectionId") ?? undefined;
    const provider = getFinancialDataProvider();
    const targetIds =
      context.production && !context.sandbox && !connectionId
        ? (await listFinancialSyncTargets(context.userId)).map((connection) => connection.id)
        : [connectionId];

    const snapshots = await Promise.all(
      targetIds.map(async (targetId) => ({
        accounts: await provider.listAccounts(targetId),
        balances: await provider.listBalances(targetId)
      }))
    );

    const accounts = snapshots.flatMap((snapshot) => snapshot.accounts);
    const balances = snapshots.flatMap((snapshot) => snapshot.balances);

    return NextResponse.json({
      provider: provider.name,
      sandbox: accounts.length ? accounts.every((account) => account.sandbox) : context.sandbox,
      authenticated: context.authenticated,
      readOnly: true,
      accounts,
      balances
    });
  } catch (error) {
    if (error instanceof FinanceAuthError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    throw error;
  }
}
