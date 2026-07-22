import { NextResponse } from "next/server";
import { z } from "zod";
import { getFinancialDataProvider, sandboxFinancialConnections } from "@/lib/financial-provider";

const createSchema = z.object({
  userId: z.string().min(2).default("demo-user"),
  providerItemId: z.string().optional(),
  institutionId: z.string().optional(),
  connectToken: z.string().optional()
});

const actionSchema = z.object({
  connectionId: z.string().min(2),
  action: z.enum(["refresh", "revoke", "reconnect", "remove_data"])
});

export async function GET() {
  return NextResponse.json({
    provider: process.env.FINANCIAL_DATA_PROVIDER ?? "pluggy",
    sandbox: true,
    readOnly: true,
    connections: sandboxFinancialConnections
  });
}

export async function POST(request: Request) {
  const parsed = createSchema.safeParse(await request.json().catch(() => ({})));

  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_connection_payload" }, { status: 400 });
  }

  const provider = getFinancialDataProvider();
  const connection = await provider.createConnection(parsed.data);

  return NextResponse.json({
    connection,
    backendValidated: connection.status !== "conectada",
    message: "Conexao iniciada. A conclusao real depende de confirmacao backend via API ou webhook."
  });
}

export async function PATCH(request: Request) {
  const parsed = actionSchema.safeParse(await request.json().catch(() => null));

  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_connection_action" }, { status: 400 });
  }

  const provider = getFinancialDataProvider();

  if (parsed.data.action === "refresh" || parsed.data.action === "reconnect") {
    const result = await provider.refreshConnection(parsed.data.connectionId);
    return NextResponse.json({
      ...result,
      action: parsed.data.action,
      sandbox: true,
      externalMoneyMovement: false
    });
  }

  if (parsed.data.action === "remove_data") {
    return NextResponse.json({
      status: "revogada",
      action: "remove_data",
      message: "Dados financeiros sandbox removidos da analise local. Em producao, a exclusao deve registrar auditoria e retenção LGPD.",
      externalMoneyMovement: false
    });
  }

  const result = await provider.revokeConnection(parsed.data.connectionId);
  return NextResponse.json({
    ...result,
    action: parsed.data.action,
    externalMoneyMovement: false
  });
}
