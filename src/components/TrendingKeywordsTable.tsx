import type { TrendingKeyword } from "@/lib/types";

export function TrendingKeywordsTable({ data }: { data: TrendingKeyword[] }) {
  return (
    <div className="glass-card rounded-2xl p-5">
      <h3 className="text-sm font-semibold text-slate-200 mb-4">Palavras e conteúdos em alta agora</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-400 border-b border-white/10">
              <th className="py-2 pr-3 font-medium">Palavra-chave</th>
              <th className="py-2 pr-3 font-medium">Categoria</th>
              <th className="py-2 pr-3 font-medium">Volume</th>
              <th className="py-2 pr-3 font-medium">Crescimento</th>
              <th className="py-2 pr-3 font-medium">Formato sugerido</th>
              <th className="py-2 pr-3 font-medium">Fonte</th>
            </tr>
          </thead>
          <tbody>
            {data.slice(0, 10).map((k) => (
              <tr key={`${k.keyword}-${k.category.id}`} className="border-b border-white/5 hover:bg-white/5">
                <td className="py-2 pr-3 text-white font-medium">
                  {k.keyword}
                  {k.isRealSignal ? <span className="ml-2 text-[10px] text-emerald-400">● ao vivo</span> : null}
                </td>
                <td className="py-2 pr-3 text-slate-300">
                  {k.category.emoji} {k.category.name}
                </td>
                <td className="py-2 pr-3 text-slate-300">{k.searchVolume.toLocaleString("pt-BR")}</td>
                <td className={`py-2 pr-3 font-medium ${k.growthPct >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                  {k.growthPct >= 0 ? "+" : ""}
                  {k.growthPct}%
                </td>
                <td className="py-2 pr-3 text-slate-300">{k.suggestedFormat}</td>
                <td className="py-2 pr-3 text-slate-500">{k.source}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
