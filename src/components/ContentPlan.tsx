import type { ContentSuggestion } from "@/lib/types";

const REACH_COLOR: Record<ContentSuggestion["expectedReach"], string> = {
  "Muito alto": "text-fuchsia-300 bg-fuchsia-500/15",
  Alto: "text-sky-300 bg-sky-500/15",
  Médio: "text-amber-300 bg-amber-500/15",
};

export function ContentPlan({ data }: { data: ContentSuggestion[] }) {
  return (
    <div className="glass-card rounded-2xl p-5">
      <h3 className="text-sm font-semibold text-slate-200 mb-4">O que produzir agora (plano de conteúdo)</h3>
      <ol className="flex flex-col gap-3">
        {data.map((c, idx) => (
          <li key={idx} className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <span className="text-xs font-semibold text-slate-500 mt-0.5">{c.timeframe}</span>
            <div className="flex-1">
              <p className="text-white font-medium">{c.title}</p>
              <p className="text-xs text-slate-400 mt-0.5">
                {c.category.emoji} {c.category.name} · {c.format}
              </p>
            </div>
            <span className={`shrink-0 rounded-full text-xs font-semibold px-2.5 py-1 ${REACH_COLOR[c.expectedReach]}`}>
              {c.expectedReach}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
