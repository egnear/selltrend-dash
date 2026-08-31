"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { PlatformShare } from "@/lib/types";

const COLORS = ["#e879f9", "#f97316", "#facc15"];

export function PlatformShareChart({ data }: { data: PlatformShare[] }) {
  return (
    <div className="glass-card rounded-2xl p-5">
      <h3 className="text-sm font-semibold text-slate-200 mb-4">Participação por plataforma</h3>
      <ResponsiveContainer width="100%" height={240}>
        <PieChart>
          <Pie data={data} dataKey="salesVolume" nameKey="label" innerRadius={55} outerRadius={90} paddingAngle={3}>
            {data.map((entry, index) => (
              <Cell key={entry.platform} fill={COLORS[index % COLORS.length]} stroke="none" />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ background: "#0f1024", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12 }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="flex flex-col gap-2 mt-2">
        {data.map((p, i) => (
          <div key={p.platform} className="flex items-center justify-between text-sm text-slate-300">
            <span className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
              {p.label}
            </span>
            <span className="font-medium text-white">{p.sharePct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
