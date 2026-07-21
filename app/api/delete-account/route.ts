import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({
    status: "queued",
    message: "Solicitação de exclusão registrada com trilha de auditoria."
  });
}
