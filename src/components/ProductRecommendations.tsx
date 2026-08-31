import type { ProductRecommendation } from "@/lib/types";
import { PLATFORMS } from "@/lib/constants";

function platformLabel(id: string) {
  return PLATFORMS.find((p) => p.id === id)?.label ?? id;
}

export function ProductRecommendations({ data }: { data: ProductRecommendation[] }) {
  return (
    <div className="glass-card rounded-2xl p-5">
      <h3 className="text-sm font-semibold text-slate-200 mb-4">O que vender agora</h3>
      <div className="flex flex-col gap-3">
        {data.map((p, idx) => (
          <div key={`${p.product}-${idx}`} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-white font-semibold">
                  {p.category.emoji} {p.product}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">{platformLabel(p.platform)} · {p.priceBand}</p>
              </div>
              <span className="shrink-0 rounded-full bg-fuchsia-500/20 text-fuchsia-300 text-xs font-semibold px-2.5 py-1">
                Score {p.demandScore}
              </span>
            </div>
            <p className="text-sm text-slate-300 mt-2">{p.reason}</p>
            <p className="text-xs text-emerald-400 mt-2 font-medium">Janela ideal: {p.bestWindow}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
