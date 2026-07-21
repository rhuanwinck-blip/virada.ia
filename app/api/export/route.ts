import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({
    status: "queued",
    message: "Exportação de dados registrada. Em produção, o arquivo é enviado por e-mail autenticado."
  });
}
