"use client";

import { CATEGORIES, PLATFORMS } from "@/lib/constants";
import type { Period, Platform } from "@/lib/types";

interface Props {
  platform: Platform | "all";
  period: Period;
  category: string | "all";
  onChange: (next: { platform?: Platform | "all"; period?: Period; category?: string | "all" }) => void;
  onRefresh: () => void;
  lastUpdated: Date | null;
  loading: boolean;
}

const PERIODS: { id: Period; label: string; guide: string }[] = [
  { id: "hour", label: "Hora", guide: "Últimas 24h, hora a hora — o que postar e vender AGORA." },
  { id: "day", label: "Dia", guide: "Panorama de hoje — planeje o conteúdo e as ofertas do dia." },
  { id: "week", label: "Semana", guide: "Últimos 7 dias — descubra o melhor dia da semana por categoria." },
  { id: "month", label: "Mês", guide: "Últimos 30 dias — tendência estável para decidir em que nicho investir." },
];

function formatClock(date: Date | null) {
  if (!date) return "—";
  return date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

export function FiltersBar({ platform, period, category, onChange, onRefresh, lastUpdated, loading }: Props) {
  const activeGuide = PERIODS.find((p) => p.id === period)?.guide;

  return (
    <div className="glass-card rounded-2xl p-4 md:p-5 flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 text-sm text-slate-300">
          <span>
            Última atualização: <span className="text-white font-medium">{formatClock(lastUpdated)}</span>
          </span>
          <button
            onClick={onRefresh}
            disabled={loading}
            className="flex items-center gap-1.5 rounded-lg bg-fuchsia-500/90 hover:bg-fuchsia-500 disabled:opacity-60 disabled:cursor-not-allowed text-white text-xs font-semibold px-3 py-1.5 transition-colors"
          >
            <span className={loading ? "animate-spin" : ""}>⟳</span>
            {loading ? "Atualizando…" : "Atualizar agora"}
          </button>
        </div>
        <div className="flex rounded-xl overflow-hidden border border-white/10">
          {PERIODS.map((p) => (
            <button
              key={p.id}
              onClick={() => onChange({ period: p.id })}
              title={p.guide}
              className={`px-4 py-1.5 text-sm font-medium transition-colors ${
                period === p.id ? "bg-fuchsia-500/90 text-white" : "bg-white/5 text-slate-300 hover:bg-white/10"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {activeGuide ? <p className="text-xs text-slate-500">💡 {activeGuide}</p> : null}

      <div className="flex flex-wrap gap-3">
        <select
          value={platform}
          onChange={(e) => onChange({ platform: e.target.value as Platform | "all" })}
          className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-slate-100"
        >
          <option value="all">Todas as plataformas</option>
          {PLATFORMS.map((p) => (
            <option key={p.id} value={p.id}>
              {p.label}
            </option>
          ))}
        </select>

        <select
          value={category}
          onChange={(e) => onChange({ category: e.target.value })}
          className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-slate-100"
        >
          <option value="all">Todas as categorias</option>
          {CATEGORIES.map((c) => (
            <option key={c.id} value={c.id}>
              {c.emoji} {c.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

