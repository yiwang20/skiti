import { personalities } from "@/data/personalities";
import PersonalityCard from "@/components/PersonalityCard";

export default function TypesPage() {
  return (
    <main className="flex-1 max-w-5xl mx-auto px-4 py-8 md:py-16">
      <p className="text-xs uppercase tracking-widest text-[var(--color-text-secondary)] mb-2">
        All Personality Types
      </p>
      <h1 className="text-3xl md:text-4xl font-bold mb-2">
        {personalities.length} 种 SKTI 人格类型总览
      </h1>
      <p className="text-[var(--color-text-secondary)] mb-8">
        这里收录了全部 SKTI 结果类型。可以先快速浏览每一种人格，也可以直接进入测试页面。
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {personalities.map((p) => (
          <PersonalityCard key={p.slug} personality={p} />
        ))}
      </div>
    </main>
  );
}
