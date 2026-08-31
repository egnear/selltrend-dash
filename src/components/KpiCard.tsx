interface Props {
  label: string;
  value: string;
  hint?: string;
  accent?: "fuchsia" | "sky" | "emerald" | "amber";
}

const ACCENTS: Record<NonNullable<Props["accent"]>, string> = {
  fuchsia: "from-fuchsia-500/20 to-fuchsia-500/0 text-fuchsia-300",
  sky: "from-sky-500/20 to-sky-500/0 text-sky-300",
  emerald: "from-emerald-500/20 to-emerald-500/0 text-emerald-300",
  amber: "from-amber-500/20 to-amber-500/0 text-amber-300",
};

export function KpiCard({ label, value, hint, accent = "fuchsia" }: Props) {
  return (
    <div className={`glass-card rounded-2xl p-5 bg-gradient-to-br ${ACCENTS[accent]}`}>
      <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-2 text-2xl md:text-3xl font-semibold text-white">{value}</p>
      {hint ? <p className="mt-1 text-xs text-slate-400">{hint}</p> : null}
    </div>
  );
}
