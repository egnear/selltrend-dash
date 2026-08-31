"use client";

import type { HeatmapCell } from "@/lib/types";

const DAY_LABELS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

function colorFor(intensity: number): string {
  if (intensity > 85) return "bg-fuchsia-500";
  if (intensity > 65) return "bg-fuchsia-500/70";
  if (intensity > 45) return "bg-fuchsia-500/45";
  if (intensity > 25) return "bg-fuchsia-500/25";
  return "bg-white/5";
}

export function HourHeatmap({ data }: { data: HeatmapCell[] }) {
  const now = new Date();

  return (
    <div className="glass-card rounded-2xl p-5 overflow-x-auto">
      <h3 className="text-sm font-semibold text-slate-200 mb-4">
        Melhor hora para vender e postar (intensidade por dia da semana)
      </h3>
      <div className="min-w-[640px]">
        <div className="grid grid-cols-[40px_repeat(24,1fr)] gap-1 text-[10px] text-slate-400 mb-1">
          <span />
          {Array.from({ length: 24 }, (_, h) => (
            <span key={h} className="text-center">
              {h % 3 === 0 ? h : ""}
            </span>
          ))}
        </div>
        {DAY_LABELS.map((label, day) => (
          <div key={label} className="grid grid-cols-[40px_repeat(24,1fr)] gap-1 mb-1 items-center">
            <span className="text-xs text-slate-400">{label}</span>
            {Array.from({ length: 24 }, (_, hour) => {
              const cell = data.find((c) => c.dayOfWeek === day && c.hour === hour);
              const isNow = now.getDay() === day && now.getHours() === hour;
              return (
                <div
                  key={hour}
                  title={`${label} ${hour}h — intensidade ${cell?.intensity ?? 0}`}
                  className={`h-4 rounded-sm ${colorFor(cell?.intensity ?? 0)} ${
                    isNow ? "ring-2 ring-amber-300" : ""
                  }`}
                />
              );
            })}
          </div>
        ))}
      </div>
      <p className="text-xs text-slate-500 mt-3">
        O quadrado destacado em âmbar mostra o dia/hora atual. Quanto mais rosa, maior a intensidade de vendas e buscas.
      </p>
    </div>
  );
}
