import { render } from "@react-email/render";
import { Resend } from "resend";
import { ResultReadyEmail } from "@/emails/ResultReadyEmail";
import { isDemoMode } from "@/lib/security";

export type EmailTemplate =
  | "free_result_ready"
  | "full_plan_unlocked"
  | "welcome"
  | "day_1_mission"
  | "plan_reminder"
  | "weekly_checkin"
  | "payment_approved"
  | "payment_pending"
  | "payment_rejected"
  | "subscription_started"
  | "subscription_cancelled"
  | "password_recovery"
  | "data_export"
  | "account_deleted";

export async function sendTransactionalEmail(input: {
  to: string;
  template: EmailTemplate;
  subject: string;
  payload?: Record<string, unknown>;
}) {
  const html = await render(ResultReadyEmail({ name: String(input.payload?.name || "Voce") }));
  const text = `Virada IA\n\n${input.subject}\n\nAcesse sua conta para continuar.`;

  if (isDemoMode() || !process.env.RESEND_API_KEY) {
    return { provider: "local", status: "recorded", html, text };
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  return resend.emails.send({
    from: process.env.EMAIL_FROM || "Virada IA <no-reply@viradaia.com.br>",
    to: input.to,
    replyTo: process.env.EMAIL_REPLY_TO,
    subject: input.subject,
    html,
    text,
    headers: {
      "List-Unsubscribe": "<mailto:descadastro@viradaia.com.br>"
    }
  });
}
