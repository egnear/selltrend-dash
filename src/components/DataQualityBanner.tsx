import type { DataQuality } from "@/lib/types";

export function DataQualityBanner({ quality }: { quality: DataQuality }) {
  const liveCount = quality.liveSources.length;

  return (
    <aside className="data-quality-banner" aria-label="Qualidade dos dados">
      <div className="data-quality-indicator" aria-hidden="true">{liveCount}</div>
      <div>
        <p className="font-semibold text-sm">{liveCount > 0 ? `${liveCount} fonte${liveCount > 1 ? "s" : ""} ao vivo` : "Sem fontes ao vivo"}</p>
        <p className="text-xs mt-0.5">
          {liveCount > 0 ? `${quality.liveSources.join(" e ")} alimentam tendências atuais.` : "Conecte fontes para receber sinais atuais."}
          {" "}Vendas e rankings permanecem estimativas até a integração oficial das lojas estar implementada.
        </p>
      </div>
    </aside>
  );
}