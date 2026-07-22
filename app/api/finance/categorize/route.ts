import { NextResponse } from "next/server";
import { z } from "zod";
import { categorizeTransaction } from "@/lib/financial-provider";

const schema = z.object({
  transactionId: z.string().optional(),
  description: z.string().min(2).max(500),
  amount: z.number(),
  previousUserCategory: z.string().optional()
});

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => null));

  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_categorization_payload" }, { status: 400 });
  }

  const result = categorizeTransaction({
    description: parsed.data.description,
    amount: parsed.data.amount,
    previousUserCategory: parsed.data.previousUserCategory as Parameters<typeof categorizeTransaction>[0]["previousUserCategory"]
  });

  return NextResponse.json({
    transactionId: parsed.data.transactionId,
    ...result,
    originalValueChanged: false,
    originalDateChanged: false,
    originalInstitutionChanged: false,
    userMustConfirm: result.requiresConfirmation
  });
}
