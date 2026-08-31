import type { DataSourceInfo } from "@/lib/types";

const STATUS_STYLE: Record<DataSourceInfo["status"], { dot: string; label: string; text: string }> = {
  ao_vivo: { dot: "bg-emerald-400", label: "🟢 Ao vivo", text: "text-emerald-300" },
  aguardando_credenciais: { dot: "bg-amber-400", label: "🟡 Aguardando credenciais", text: "text-amber-300" },
  indisponivel: { dot: "bg-rose-400", label: "🔴 Indisponível agora", text: "text-rose-300" },
};

export function ConnectionsPanel({ data }: { data: DataSourceInfo[] }) {
  return (
    <div className="glass-card rounded-2xl p-5">
      <h3 className="text-sm font-semibold text-slate-200 mb-1">Conexões com APIs externas</h3>
      <p className="text-xs text-slate-500 mb-4">
        Isso mostra exatamente quais fontes de dados de terceiros estão plugadas agora e o que falta para ativar cada
        uma com números 100% reais da sua conta.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {data.map((source) => {
          const style = STATUS_STYLE[source.status];
          return (
            <div key={source.id} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <div className="flex items-center justify-between gap-2">
                <p className="text-white font-medium text-sm">{source.label}</p>
                <span className={`h-2 w-2 rounded-full shrink-0 ${style.dot}`} />
              </div>
              <p className={`text-xs font-semibold mt-1 ${style.text}`}>{style.label}</p>
              <p className="text-xs text-slate-400 mt-2">{source.description}</p>
              <div className="flex items-center justify-between mt-3 text-[11px] text-slate-500">
                <code className="bg-black/30 rounded px-1.5 py-0.5">{source.envVar}</code>
                <a
                  href={source.setupUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sky-400 hover:text-sky-300 underline"
                >
                  Configurar →
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
