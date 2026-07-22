import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  to: z.string().min(8).optional(),
  message: z.string().min(2).max(1000),
  confirmedByUser: z.boolean().default(false)
});

export async function GET() {
  return NextResponse.json({
    provider: "whatsapp_cloud_api",
    status: hasWhatsAppCredentials() ? "ready" : "needs_credentials",
    requiredEnv: ["WHATSAPP_TOKEN", "WHATSAPP_PHONE_NUMBER_ID"],
    externalMessageSent: false
  });
}

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => null));

  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_whatsapp_payload" }, { status: 400 });
  }

  if (!parsed.data.confirmedByUser) {
    return NextResponse.json(
      {
        prepared: true,
        externalMessageSent: false,
        requiresUserConfirmation: true,
        message: "Mensagem preparada. Confirme antes de enviar pelo WhatsApp oficial."
      },
      { status: 202 }
    );
  }

  if (!hasWhatsAppCredentials()) {
    return NextResponse.json(
      {
        prepared: true,
        externalMessageSent: false,
        mode: "demo",
        message: "Credenciais do WhatsApp ausentes. Nenhuma mensagem foi enviada."
      },
      { status: 202 }
    );
  }

  return NextResponse.json({
    prepared: true,
    externalMessageSent: false,
    mode: "ready_contract",
    message: "Contrato pronto para envio real via Cloud API apos consentimento e template aprovado."
  });
}

function hasWhatsAppCredentials() {
  return Boolean(process.env.WHATSAPP_TOKEN && process.env.WHATSAPP_PHONE_NUMBER_ID);
}
