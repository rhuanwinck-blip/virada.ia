import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  action: z.enum(["status", "prepare_event"]).default("status"),
  title: z.string().optional(),
  start: z.string().optional(),
  end: z.string().optional(),
  confirmedByUser: z.boolean().default(false)
});

export async function GET() {
  return NextResponse.json({
    provider: "google_calendar",
    status: hasGoogleCredentials() ? "ready" : "needs_credentials",
    requiredEnv: ["GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET", "GOOGLE_REDIRECT_URI"],
    externalActionCreated: false
  });
}

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => null));

  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_calendar_payload" }, { status: 400 });
  }

  if (!parsed.data.confirmedByUser) {
    return NextResponse.json(
      {
        prepared: true,
        externalActionCreated: false,
        requiresUserConfirmation: true,
        message: "Evento preparado. Confirme antes de criar no Google Calendar."
      },
      { status: 202 }
    );
  }

  if (!hasGoogleCredentials()) {
    return NextResponse.json(
      {
        prepared: true,
        externalActionCreated: false,
        mode: "demo",
        message: "Credenciais do Google Calendar ausentes. Evento nao foi enviado."
      },
      { status: 202 }
    );
  }

  return NextResponse.json({
    prepared: true,
    externalActionCreated: false,
    mode: "ready_contract",
    message: "Contrato pronto para chamada OAuth/Calendar. Implementacao real deve usar token do usuario."
  });
}

function hasGoogleCredentials() {
  return Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET && process.env.GOOGLE_REDIRECT_URI);
}
