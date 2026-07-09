import { buscarProcesso } from "@/lib/datajud";
import { DatajudError } from "@/types/processo";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const ERROR_STATUS: Record<string, number> = {
  INVALID_NUMBER: 400,
  NOT_FOUND: 404,
  RATE_LIMIT: 429,
  CONNECTION_ERROR: 502,
};

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("Authorization");
  const expected = `Bearer ${process.env.DATAJUD_INTERNAL_SECRET}`;

  if (!process.env.DATAJUD_INTERNAL_SECRET || authHeader !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const numero = searchParams.get("numero");

  if (!numero) {
    return NextResponse.json(
      { error: "Parâmetro 'numero' é obrigatório" },
      { status: 400 },
    );
  }

  try {
    const { processo, fromCache } = await buscarProcesso(numero);
    return NextResponse.json({ processo, fromCache });
  } catch (err) {
    if (err instanceof DatajudError) {
      const status = ERROR_STATUS[err.type] ?? 500;
      return NextResponse.json(
        { error: err.message, type: err.type },
        { status },
      );
    }

    console.error("[processos/buscar] Erro inesperado:", err);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}
