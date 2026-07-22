import { NextResponse } from "next/server";
import { z } from "zod";
import { parseAssistantIntent } from "@/lib/assistant-core";

const schema = z.object({
  message: z.string().min(2).max(2000),
  channel: z.enum(["text", "audio-transcript"]).default("text")
});

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => null));

  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_assistant_payload" }, { status: 400 });
  }

  const draft = parseAssistantIntent(parsed.data.message);

  return NextResponse.json({
    mode: process.env.OPENAI_API_KEY ? "ready_for_openai" : "demo_parser",
    channel: parsed.data.channel,
    draft,
    externalActionCreated: false,
    requiresUserConfirmation: true
  });
}
