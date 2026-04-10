"use client";

import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { personalities } from "@/data/personalities";
import { dimensions } from "@/data/dimensions";
import { decodeScores } from "@/lib/encoding";
import DimensionChart from "@/components/DimensionChart";
import ShareButtons from "@/components/ShareButtons";
import PersonalityCard from "@/components/PersonalityCard";

export default function ResultContent() {
  const params = useParams();
  const searchParams = useSearchParams();

  const typeSlug = params.type as string;
  const scoresParam = searchParams.get("s");
  const scores = scoresParam ? decodeScores(scoresParam) : null;

  const personality = personalities.find((p) => p.slug === typeSlug);
  if (!personality) {
    return (
      <main className="flex-1 flex items-center justify-center">
        <p>找不到这个人格类型。</p>
      </main>
    );
  }

  const suggestions = personalities
    .filter((p) => p.slug !== typeSlug)
    .slice(0, 3);

  return (
    <main className="flex-1 max-w-3xl mx-auto px-4 py-8 md:py-16">
      <div
        id="share-card"
        className="bg-[var(--color-card)] rounded-2xl border border-[var(--color-border)] p-6 md:p-8 mb-6"
      >
        <p className="text-sm text-[var(--color-text-secondary)] mb-1">
          你的滑雪人格是：
        </p>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex flex-col items-center md:items-start">
            <h1 className="text-3xl font-bold mb-1">{personality.name}</h1>
            <p className="text-lg font-mono text-[var(--color-text-secondary)]">
              {personality.code}
            </p>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-[var(--color-primary)] mb-2">
              {personality.slogan}
            </p>
            <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
              {personality.description}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 mb-10">
        <ShareButtons personalityName={personality.slug} />
        <Link
          href="/test"
          className="text-sm px-4 py-2 rounded-lg border border-[var(--color-border)] hover:bg-[var(--color-primary-light)] transition-colors"
        >
          重新测试
        </Link>
      </div>

      {scores && (
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4">
            {personality.code} 的维度落点
          </h2>
          <div className="grid gap-3">
            {dimensions.map((dim, i) => (
              <DimensionChart key={dim.id} dimension={dim} score={scores[i]} />
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="text-xl font-bold mb-4">看看其他几种滑雪人格</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {suggestions.map((p) => (
            <PersonalityCard key={p.slug} personality={p} />
          ))}
        </div>
      </section>
    </main>
  );
}
