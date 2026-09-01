"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { FiltersBar } from "@/components/FiltersBar";
import { KpiCard } from "@/components/KpiCard";
import { VolumeChart } from "@/components/VolumeChart";
import { CategoryBarChart } from "@/components/CategoryBarChart";
import { PlatformShareChart } from "@/components/PlatformShareChart";
import { HourHeatmap } from "@/components/HourHeatmap";
import { TrendingKeywordsTable } from "@/components/TrendingKeywordsTable";
import { ProductRecommendations } from "@/components/ProductRecommendations";
import { ContentPlan } from "@/components/ContentPlan";
import { LiveNewsWidget } from "@/components/LiveNewsWidget";
import { RealTrendsWidget } from "@/components/RealTrendsWidget";
import type { DashboardSummary, Period, Platform } from "@/lib/types";

export default function Home() {
  const [platform, setPlatform] = useState<Platform | "all">("all");
  const [period, setPeriod] = useState<Period>("day");
  const [category, setCategory] = useState<string | "all">("all");
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ platform, period, category });
    try {
      const res = await fetch(`/api/summary?${params.toString()}`, { cache: "no-store" });
      const data = await res.json();
      setSummary(data);
      setLastUpdated(new Date());
    } finally {
      setLoading(false);
    }
  }, [platform, period, category]);

  useEffect(() => {
    load();
    const interval = setInterval(load, 60_000);
    return () => clearInterval(interval);
  }, [load]);

  return (
    <main className="flex-1 px-4 md:px-8 py-6 max-w-[1400px] w-full mx-auto flex flex-col gap-6">
      <header className="automatos-header flex flex-wrap items-start justify-between gap-4 rounded-2xl p-5 md:p-6">
        <div className="flex items-center gap-4">
          <div className="tomato-mark" aria-hidden="true">
            <span className="tomato-leaf" />
            <span className="tomato-gear tomato-gear-a">⚙</span>
            <span className="tomato-gear tomato-gear-b">⚙</span>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-200">Inteligência de comércio</p>
            <h1 className="text-3xl md:text-4xl font-bold text-white">Automatos</h1>
            <p className="text-sm text-slate-300">
              Dados, tendências e decisões práticas para vender e criar conteúdo no momento certo.
            </p>
          </div>
        </div>
        <Link href="/conexoes" className="rounded-lg border border-orange-300/35 bg-orange-400/15 px-3 py-2 text-sm font-semibold text-orange-100 hover:bg-orange-400/25 transition-colors">
          Gerenciar integrações →
        </Link>
      </header>

      <FiltersBar
        platform={platform}
        period={period}
        category={category}
        loading={loading}
        lastUpdated={lastUpdated}
        onRefresh={load}
        onChange={(next) => {
          if (next.platform !== undefined) setPlatform(next.platform);
          if (next.period !== undefined) setPeriod(next.period);
          if (next.category !== undefined) setCategory(next.category);
        }}
      />

      {summary ? (
        <>
          <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <KpiCard
              label="Volume de vendas (índice)"
              value={summary.kpis.totalSalesVolume.toLocaleString("pt-BR")}
              hint="Soma estimada entre plataformas selecionadas"
              accent="fuchsia"
            />
            <KpiCard
              label="Conteúdo pesquisado (índice)"
              value={summary.kpis.totalContentVolume.toLocaleString("pt-BR")}
              hint="Buscas + engajamento nas categorias"
              accent="sky"
            />
            <KpiCard
              label="Categoria em destaque"
              value={summary.kpis.bestCategoryNow}
              hint={`Crescimento médio ${summary.kpis.avgGrowthPct >= 0 ? "+" : ""}${summary.kpis.avgGrowthPct}%`}
              accent="emerald"
            />
            <KpiCard
              label="Melhor horário do dia"
              value={summary.kpis.bestHourLabel}
              hint="Pico histórico de vendas e buscas"
              accent="amber"
            />
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <VolumeChart data={summary.timeline} />
            </div>
            <PlatformShareChart data={summary.platformShares} />
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <CategoryBarChart data={summary.categoryStats} />
            </div>
            <ContentPlan data={summary.contentPlan} />
          </section>

          <HourHeatmap data={summary.heatmap} />

          <RealTrendsWidget data={summary.realTrendsNow} />

          <LiveNewsWidget data={summary.newsNow} />

          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TrendingKeywordsTable data={summary.trendingKeywords} />
            <ProductRecommendations data={summary.productRecommendations} />
          </section>

          <footer className="text-xs text-slate-600 pb-6">
            Gerado às {new Date(summary.generatedAt).toLocaleString("pt-BR")} · Consulte “Gerenciar integrações” para
            ver as fontes ativas e trocar APIs.
          </footer>
        </>
      ) : (
        <div className="flex items-center justify-center py-24 text-slate-400">Carregando dados do mercado…</div>
      )}
    </main>
  );
}
