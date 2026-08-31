import type { NewsItem } from "@/lib/types";

export function LiveNewsWidget({ data }: { data: NewsItem[] }) {
  if (data.length === 0) return null;

  return (
    <div className="glass-card rounded-2xl p-5">
      <div className="flex flex-wrap items-center gap-2 mb-1">
        <h3 className="text-sm font-semibold text-slate-200">📰 Assuntos em circulação no Brasil</h3>
        <span className="text-[10px] font-semibold text-emerald-300 bg-emerald-500/15 rounded-full px-2 py-0.5">
          AO VIVO · Google News
        </span>
      </div>
      <p className="text-xs text-slate-500 mb-4">
        Use manchetes como gancho para conteúdo, desde que exista relação verdadeira com seu produto e sem afirmar algo que a notícia não diz.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {data.slice(0, 8).map((news, index) => (
          <a
            key={`${news.title}-${index}`}
            href={news.url ?? "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 hover:bg-white/[0.07] transition-colors"
          >
            <p className="text-sm font-medium text-white line-clamp-2">{news.title}</p>
            {news.source ? <p className="text-xs text-slate-500 mt-1">{news.source}</p> : null}
          </a>
        ))}
      </div>
    </div>
  );
}
