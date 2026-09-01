"use client";

import { useEffect, useState } from "react";
import type { DataSourceInfo, DashboardSummary } from "@/lib/types";

const STATUS = {
  ao_vivo: { label: "Conectado", className: "text-emerald-300 bg-emerald-500/15 border-emerald-400/20" },
  aguardando_credenciais: { label: "Pronto para conectar", className: "text-amber-300 bg-amber-500/15 border-amber-400/20" },
  indisponivel: { label: "Indisponível", className: "text-rose-300 bg-rose-500/15 border-rose-400/20" },
} as const;

function ProviderCard({ source }: { source: DataSourceInfo }) {
  const status = STATUS[source.status];
  const noSetupNeeded = source.envVar.startsWith("—");

  return (
    <article className="glass-card rounded-2xl p-5 flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="font-semibold text-white">{source.label}</h2>
          <p className="text-sm text-slate-400 mt-1">{source.description}</p>
        </div>
        <span className={`shrink-0 border rounded-full px-2.5 py-1 text-xs font-semibold ${status.className}`}>
          {status.label}
        </span>
      </div>

      {noSetupNeeded ? (
        <p className="rounded-lg bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">
          Esta fonte pública já está funcionando. O dashboard a atualiza automaticamente.
        </p>
      ) : (
        <div className="rounded-lg bg-white/[0.04] border border-white/10 p-3 text-sm text-slate-300 space-y-2">
          <p>
            <span className="font-semibold text-white">1.</span> Entre no portal oficial e autorize o acesso da sua conta.
          </p>
          <p>
            <span className="font-semibold text-white">2.</span> Cadastre o token na Vercel como variável de ambiente:
          </p>
          <code className="block bg-black/30 rounded px-2 py-1.5 text-xs text-sky-300 break-all">{source.envVar}</code>
          <p>
            <span className="font-semibold text-white">3.</span> Faça um novo deploy. O status aqui mudará para “Conectado”.
          </p>
        </div>
      )}

      <div className="flex flex-wrap gap-2 mt-auto">
        <a
          href={source.setupUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg bg-fuchsia-500 px-3 py-2 text-sm font-semibold text-white hover:bg-fuchsia-400 transition-colors"
        >
          {noSetupNeeded ? "Abrir fonte" : "Entrar no portal oficial"}
        </a>
        {!noSetupNeeded ? (
          <a
            href="https://vercel.com/egnear/automato/settings/environment-variables"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-white/15 px-3 py-2 text-sm font-medium text-slate-200 hover:bg-white/10 transition-colors"
          >
            Abrir variáveis na Vercel
          </a>
        ) : null}
      </div>
    </article>
  );
}

function DisconnectCard({ source }: { source: DataSourceInfo }) {
  const noSetupNeeded = source.envVar.startsWith("—");

  return (
    <article className="glass-card rounded-2xl p-5 flex flex-col gap-4">
      <div>
        <h2 className="font-semibold text-white">{source.label}</h2>
        <p className="text-sm text-slate-400 mt-1">
          {noSetupNeeded
            ? "É uma fonte pública. Ela não usa token seu e não há nada para remover."
            : "Remova a variável abaixo na Vercel para desligar esta integração e abrir espaço para outra API."}
        </p>
      </div>

      {noSetupNeeded ? (
        <div className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-slate-300">
          Fonte pública controlada pelo projeto. Ela pode ser removida futuramente do código, mas não guarda credenciais.
        </div>
      ) : (
        <div className="rounded-lg border border-rose-400/20 bg-rose-500/10 p-3 text-sm text-slate-300 space-y-2">
          <p>Na Vercel, localize e exclua esta variável:</p>
          <code className="block bg-black/30 rounded px-2 py-1.5 text-xs text-rose-200 break-all">{source.envVar}</code>
          <p>Depois use “Redeploy” para o dashboard reconhecer que a fonte foi desconectada.</p>
        </div>
      )}

      {!noSetupNeeded ? (
        <a
          href="https://vercel.com/egnear/automato/settings/environment-variables"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto w-fit rounded-lg border border-rose-300/35 bg-rose-500/10 px-3 py-2 text-sm font-semibold text-rose-100 hover:bg-rose-500/20 transition-colors"
        >
          Abrir e remover na Vercel →
        </a>
      ) : null}
    </article>
  );
}

export default function ConexoesPage() {
  const [sources, setSources] = useState<DataSourceInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<"connect" | "disconnect">("connect");

  useEffect(() => {
    fetch("/api/summary?platform=all&period=day&category=all", { cache: "no-store" })
      .then((response) => response.json())
      .then((data: DashboardSummary) => setSources(data.dataSources))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="integrations-page flex-1 px-4 md:px-8 py-6 max-w-[1400px] w-full mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-fuchsia-300">Integrações</p>
          <h1 className="mt-1 text-3xl font-bold text-white">Conectar suas fontes de dados</h1>
          <p className="mt-2 max-w-3xl text-sm text-slate-400">
            Conecte somente contas que são suas. Seus tokens ficam protegidos nas variáveis da Vercel e nunca são digitados nesta tela.
          </p>
        </div>
      </div>

      <section className="glass-card rounded-2xl p-5 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="font-semibold text-white">Gerencie as suas integrações</h2>
            <p className="text-xs text-slate-400 mt-1">Adicione ou remova tokens sem expor segredos no navegador.</p>
          </div>
          <div className="flex rounded-xl border border-white/10 overflow-hidden" role="tablist" aria-label="Modo de integração">
            <button
              role="tab"
              aria-selected={mode === "connect"}
              onClick={() => setMode("connect")}
              className={`px-4 py-2 text-sm font-semibold transition-colors ${mode === "connect" ? "bg-orange-500 text-white" : "bg-white/5 text-slate-300 hover:bg-white/10"}`}
            >
              Conectar
            </button>
            <button
              role="tab"
              aria-selected={mode === "disconnect"}
              onClick={() => setMode("disconnect")}
              className={`px-4 py-2 text-sm font-semibold transition-colors ${mode === "disconnect" ? "bg-rose-500 text-white" : "bg-white/5 text-slate-300 hover:bg-white/10"}`}
            >
              Desconectar
            </button>
          </div>
        </div>

        {mode === "connect" ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
            {[
              ["1", "Autorize", "Entre no portal da plataforma com a sua conta de vendedor ou criador."],
              ["2", "Cadastre o token", "Copie o token recebido para as variáveis de ambiente da Vercel."],
              ["3", "Atualize", "Faça Redeploy. O dashboard detectará a integração automaticamente."],
            ].map(([number, title, text]) => (
              <div key={number} className="flex gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-orange-500/20 text-sm font-bold text-orange-100">{number}</span>
                <div>
                  <p className="text-sm font-semibold text-white">{title}</p>
                  <p className="text-xs text-slate-400 mt-1">{text}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-4 text-sm text-slate-300">
            Para remover uma integração, apague o token correspondente na Vercel. Isso não remove sua conta da plataforma,
            apenas encerra o acesso deste dashboard.
          </p>
        )}
      </section>

      {loading ? (
        <p className="text-slate-400">Lendo status das integrações…</p>
      ) : (
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {sources.map((source) => mode === "connect" ? <ProviderCard key={source.id} source={source} /> : <DisconnectCard key={source.id} source={source} />)}
        </section>
      )}
    </main>
  );
}