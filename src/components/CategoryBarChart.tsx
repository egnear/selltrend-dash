"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { CategoryStat } from "@/lib/types";

export function CategoryBarChart({ data }: { data: CategoryStat[] }) {
  const chartData = data.slice(0, 8).map((c) => ({
    name: `${c.category.emoji} ${c.category.name}`,
    Vendas: c.salesVolume,
    Conteúdo: c.contentVolume,
  }));

  return (
    <div className="glass-card rounded-2xl p-5">
      <h3 className="text-sm font-semibold text-slate-200 mb-4">Ranking de categorias (vendas x conteúdo)</h3>
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={chartData} layout="vertical" margin={{ left: 24, right: 16 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" horizontal={false} />
          <XAxis type="number" stroke="#94a3b8" fontSize={12} />
          <YAxis type="category" dataKey="name" width={170} stroke="#94a3b8" fontSize={11} tickLine={false} />
          <Tooltip
            contentStyle={{ background: "#0f1024", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12 }}
            labelStyle={{ color: "#e2e8f0" }}
          />
          <Bar dataKey="Vendas" fill="#e879f9" radius={[0, 6, 6, 0]} />
          <Bar dataKey="Conteúdo" fill="#38bdf8" radius={[0, 6, 6, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
