interface Props {
  current: number;
  total: number;
}

export default function ProgressBar({ current, total }: Props) {
  const pct = ((current + 1) / total) * 100;
  return (
    <div className="w-full">
      <div className="flex justify-between text-xs text-[var(--color-text-secondary)] mb-2">
        <span>
          已完成 {current} / {total} 题
        </span>
        <span>{Math.round(pct)}%</span>
      </div>
      <div className="h-2 bg-[var(--color-primary-light)] rounded-full overflow-hidden">
        <div
          className="h-full bg-[var(--color-primary)] rounded-full transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
