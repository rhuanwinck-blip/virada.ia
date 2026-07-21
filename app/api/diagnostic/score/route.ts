import { NextResponse } from "next/server";
import { z } from "zod";
import { scoreDiagnostic } from "@/lib/scoring";

const bodySchema = z.object({
  answers: z.record(z.number().min(1).max(5))
});

export async function POST(request: Request) {
  const parsed = bodySchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_answers" }, { status: 400 });
  }

  return NextResponse.json(scoreDiagnostic(parsed.data.answers));
}
