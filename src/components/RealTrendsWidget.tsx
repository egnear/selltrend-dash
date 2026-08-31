import type { RealTrendItem } from "@/lib/types";

export function RealTrendsWidget({ data }: { data: RealTrendItem[] }) {
  if (data.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-slate-200 mb-2">Tendências reais do Brasil agora</h3>
        <p className="text-sm text-slate-500">
          O Google Trends está indisponível no momento. Tente atualizar novamente em alguns minutos.
        </p>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-1">
        <h3 className="text-sm font-semibold text-slate-200">🔴 Tendências reais do Brasil agora</h3>
        <span className="text-[10px] font-semibold text-emerald-300 bg-emerald-500/15 rounded-full px-2 py-0.5">
          AO VIVO · Google Trends
        </span>
      </div>
      <p className="text-xs text-slate-500 mb-4">
        Assuntos que estão sendo mais buscados no Brasil neste momento. Se algum bater com uma das suas categorias, ele
        ganha destaque nas recomendações abaixo — ótimo gancho para vídeos rápidos.
      </p>
      <div className="flex flex-col gap-2">
        {data.map((trend, idx) => (
          <div
            key={`${trend.title}-${idx}`}
            className="flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2"
          >
            <div className="min-w-0">
              <p className="text-sm text-white font-medium truncate">{trend.title}</p>
              {trend.newsTitle ? <p className="text-xs text-slate-500 truncate">{trend.newsTitle}</p> : null}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {trend.matchedCategory ? (
                <span className="text-[10px] font-semibold text-fuchsia-300 bg-fuchsia-500/15 rounded-full px-2 py-1">
                  {trend.matchedCategory.emoji} combina com o seu catálogo
                </span>
              ) : null}
              <span className="text-xs text-slate-400">{trend.approxTraffic} buscas</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
