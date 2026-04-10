import { Dimension } from "@/data/dimensions";

interface Props {
  dimension: Dimension;
  score: number;
}

export default function DimensionChart({ dimension, score }: Props) {
  return (
    <div className="bg-[var(--color-card)] rounded-xl border border-[var(--color-border)] p-4">
      <div className="flex justify-between text-xs text-[var(--color-text-secondary)] mb-1">
        <span>{dimension.id.toUpperCase()} {dimension.name}</span>
        <span className="text-[10px] uppercase">
          {dimension.type === "serious"
            ? "核心维度"
            : dimension.type === "funny"
            ? "搞笑维度"
            : "混搭维度"}
        </span>
      </div>
      <div className="flex items-center gap-3 text-xs">
        <span className="w-24 text-right shrink-0 text-[var(--color-text-secondary)]">
          {dimension.lowLabel}
        </span>
        <div className="flex-1 h-3 bg-[var(--color-primary-light)] rounded-full overflow-hidden relative">
          <div
            className="h-full bg-[var(--color-primary)] rounded-full transition-all duration-500"
            style={{ width: `${score}%` }}
          />
        </div>
        <span className="w-24 shrink-0 text-[var(--color-text-secondary)]">
          {dimension.highLabel}
        </span>
      </div>
    </div>
  );
}
