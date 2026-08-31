import { NextRequest, NextResponse } from "next/server";
import { buildDashboardSummary } from "@/lib/aggregate";
import type { Period, Platform } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const platform = (searchParams.get("platform") as Platform | "all") ?? "all";
  const period = (searchParams.get("period") as Period) ?? "day";
  const category = searchParams.get("category") ?? "all";

  try {
    const summary = await buildDashboardSummary({ platform, period, category });
    return NextResponse.json(summary);
  } catch (error) {
    console.error("Erro ao montar o resumo do dashboard", error);
    return NextResponse.json({ error: "Falha ao gerar dados do dashboard" }, { status: 500 });
  }
}
