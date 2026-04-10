import { notFound } from "next/navigation";
import Link from "next/link";
import { personalities } from "@/data/personalities";
import { dimensions } from "@/data/dimensions";
import DimensionChart from "@/components/DimensionChart";
import PersonalityCard from "@/components/PersonalityCard";

export function generateStaticParams() {
  return personalities.map((p) => ({ slug: p.slug }));
}

export default function TypeDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const personality = personalities.find((p) => p.slug === params.slug);
  if (!personality) notFound();

  const suggestions = personalities
    .filter((p) => p.slug !== personality.slug)
    .slice(0, 3);

  return (
    <main className="flex-1 max-w-3xl mx-auto px-4 py-8 md:py-16">
      <div className="mb-2 text-sm text-[var(--color-text-secondary)]">
        <Link href="/types" className="hover:underline">
          人格类型
        </Link>
        {" / "}
        {personality.code}（{personality.name}）
      </div>

      <div className="bg-[var(--color-card)] rounded-2xl border border-[var(--color-border)] p-6 md:p-8 mb-8">
        <p className="text-xs font-mono text-[var(--color-text-secondary)] mb-1">
          {personality.code}
        </p>
        <h1 className="text-3xl font-bold mb-2">{personality.name}</h1>
        <p className="text-[var(--color-primary)] font-medium mb-4">
          {personality.slogan}
        </p>
        <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
          {personality.description}
        </p>
      </div>

      <section className="mb-10">
        <h2 className="text-xl font-bold mb-4">
          {personality.code} 的典型维度落点
        </h2>
        <div className="grid gap-3">
          {dimensions.map((dim, i) => (
            <DimensionChart
              key={dim.id}
              dimension={dim}
              score={personality.profile[i]}
            />
          ))}
        </div>
      </section>

      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">看看其他人格</h2>
          <Link
            href="/test"
            className="text-sm text-[var(--color-primary)] hover:underline"
          >
            去做测试
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {suggestions.map((p) => (
            <PersonalityCard key={p.slug} personality={p} />
          ))}
        </div>
      </section>
    </main>
  );
}
