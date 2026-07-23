import { NextResponse } from "next/server";
import { z } from "zod";
import { FinanceAuthError, getFinanceAccessContext } from "@/lib/finance-access";
import { getFinancialDataProvider } from "@/lib/financial-provider";
import { runFinancialSync } from "@/lib/financial-sync";
import { persistFinancialSnapshot, removeFinancialData } from "@/lib/financial-store";

const createSchema = z.object({
  providerItemId: z.string().optional(),
  institutionId: z.string().optional(),
  connectToken: z.string().optional()
});

const actionSchema = z.object({
  connectionId: z.string().min(2),
  action: z.enum(["refresh", "revoke", "reconnect", "remove_data"])
});

export async function GET() {
  try {
    const context = await getFinanceAccessContext();
    const provider = getFinancialDataProvider();
    const connections = await provider.listConnections(context.userId);

    return NextResponse.json({
      provider: provider.name,
      sandbox: connections.every((connection) => connection.sandbox),
      authenticated: context.authenticated,
      readOnly: true,
      connections
    });
  } catch (error) {
    if (error instanceof FinanceAuthError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    throw error;
  }
}

export async function POST(request: Request) {
  try {
    const parsed = createSchema.safeParse(await request.json().catch(() => ({})));

    if (!parsed.success) {
      return NextResponse.json({ error: "invalid_connection_payload" }, { status: 400 });
    }

    const context = await getFinanceAccessContext();
    const provider = getFinancialDataProvider();
    const connection = await provider.createConnection({ ...parsed.data, userId: context.userId });
    const persistence = await persistFinancialSnapshot({
      userId: context.userId,
      connections: [connection],
      accounts: [],
      balances: [],
      transactions: [],
      creditCards: [],
      bills: [],
      investments: []
    });

    return NextResponse.json({
      connection,
      persistence,
      backendValidated: connection.status !== "conectada",
      message: "Conexao iniciada. A conclusao real depende de confirmacao backend via API ou webhook."
    });
  } catch (error) {
    if (error instanceof FinanceAuthError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    throw error;
  }
}

export async function PATCH(request: Request) {
  try {
    const parsed = actionSchema.safeParse(await request.json().catch(() => null));

    if (!parsed.success) {
      return NextResponse.json({ error: "invalid_connection_action" }, { status: 400 });
    }

    const context = await getFinanceAccessContext();
    const provider = getFinancialDataProvider();

    if (parsed.data.action === "refresh" || parsed.data.action === "reconnect") {
      const result = await provider.refreshConnection(parsed.data.connectionId);
      const sync = await runFinancialSync({
        userId: context.userId,
        connectionId: parsed.data.connectionId,
        kind: parsed.data.action === "refresh" ? "manual" : "initial"
      });

      return NextResponse.json({
        ...result,
        action: parsed.data.action,
        sync,
        sandbox: sync.sandbox,
        externalMoneyMovement: false
      });
    }

    if (parsed.data.action === "remove_data") {
      const removal = await removeFinancialData({
        userId: context.userId,
        connectionId: parsed.data.connectionId
      });
      return NextResponse.json({
        status: "revogada",
        action: "remove_data",
        removal,
        message: "Dados financeiros locais removidos da analise. A revogacao no provider deve usar a acao revoke quando houver item real.",
        externalMoneyMovement: false
      });
    }

    const result = await provider.revokeConnection(parsed.data.connectionId);
    const removal = await removeFinancialData({
      userId: context.userId,
      connectionId: parsed.data.connectionId
    });
    return NextResponse.json({
      ...result,
      action: parsed.data.action,
      removal,
      externalMoneyMovement: false
    });
  } catch (error) {
    if (error instanceof FinanceAuthError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    throw error;
  }
}
