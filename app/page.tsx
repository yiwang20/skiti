import Link from "next/link";
import { personalities } from "@/data/personalities";
import PersonalityCard from "@/components/PersonalityCard";

const previewPersonalities = personalities.slice(0, 3);

export default function Home() {
  return (
    <main className="flex-1">
      {/* Hero */}
      <section className="max-w-5xl mx-auto px-4 py-16 md:py-24">
        <p className="text-xs uppercase tracking-widest text-[var(--color-text-secondary)] mb-4">
          Ski Type Indicator
        </p>
        <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-6">
          SKTI 滑雪人格测试，
          <br />
          测测你是哪种滑雪人。
        </h1>
        <p className="text-[var(--color-text-secondary)] max-w-xl mb-8">
          SKTI 是一套面向滑雪爱好者的人格测试。回答 30 道题，从技术风格到摸鱼指数，
          6 个维度帮你找到最匹配的滑雪人格。纯属娱乐，切勿当真。
        </p>
        <div className="flex gap-3">
          <Link
            href="/test"
            className="bg-[var(--color-primary)] text-white px-6 py-2.5 rounded-full text-sm font-medium hover:opacity-90 transition-opacity"
          >
            开始测试
          </Link>
          <Link
            href="/types"
            className="border border-[var(--color-border)] px-6 py-2.5 rounded-full text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-primary-light)] transition-colors"
          >
            浏览 {personalities.length} 种人格
          </Link>
          <Link
            href="/about"
            className="border border-[var(--color-border)] px-6 py-2.5 rounded-full text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-primary-light)] transition-colors"
          >
            了解测试说明
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-5xl mx-auto px-4 pb-16">
        <h2 className="text-2xl font-bold mb-6">
          SKTI 采用 6 组人格切面。
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-[var(--color-card)] rounded-xl border border-[var(--color-border)] p-5">
            <p className="text-2xl font-bold">30 道</p>
            <p className="text-sm text-[var(--color-text-secondary)]">
              正式题目数量
            </p>
          </div>
          <div className="bg-[var(--color-card)] rounded-xl border border-[var(--color-border)] p-5">
            <p className="text-2xl font-bold">{personalities.length} 种</p>
            <p className="text-sm text-[var(--color-text-secondary)]">
              人格类型
            </p>
          </div>
          <div className="bg-[var(--color-card)] rounded-xl border border-[var(--color-border)] p-5">
            <p className="text-2xl font-bold">6 维</p>
            <p className="text-sm text-[var(--color-text-secondary)]">
              从技术到摸鱼，全方位扫描
            </p>
          </div>
        </div>
      </section>

      {/* Preview personalities */}
      <section className="max-w-5xl mx-auto px-4 pb-16">
        <h2 className="text-2xl font-bold mb-6">部分人格预览</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {previewPersonalities.map((p) => (
            <PersonalityCard key={p.slug} personality={p} />
          ))}
        </div>
      </section>
    </main>
  );
}
