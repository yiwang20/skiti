import Link from "next/link";
import { dimensions } from "@/data/dimensions";
import { questions } from "@/data/questions";
import { personalities } from "@/data/personalities";

export default function AboutPage() {
  return (
    <main className="flex-1 max-w-3xl mx-auto px-4 py-8 md:py-16">
      <p className="text-xs uppercase tracking-widest text-[var(--color-text-secondary)] mb-2">
        About SKTI
      </p>
      <h1 className="text-3xl md:text-4xl font-bold mb-4">关于 SKTI 测试</h1>
      <p className="text-[var(--color-text-secondary)] mb-10">
        SKTI 是一套轻松有趣的滑雪人格测试。它不会把人塞进严肃的心理学框架，
        而是更关注你在雪场的行为习惯、社交风格和摸鱼指数，让结果既好笑又真实。
      </p>

      <div className="grid grid-cols-3 gap-4 mb-10">
        <div className="bg-[var(--color-card)] rounded-xl border border-[var(--color-border)] p-5">
          <p className="text-2xl font-bold">{questions.length} 道</p>
          <p className="text-sm text-[var(--color-text-secondary)]">正式题目数量</p>
        </div>
        <div className="bg-[var(--color-card)] rounded-xl border border-[var(--color-border)] p-5">
          <p className="text-2xl font-bold">{personalities.length} 种</p>
          <p className="text-sm text-[var(--color-text-secondary)]">人格类型</p>
        </div>
        <div className="bg-[var(--color-card)] rounded-xl border border-[var(--color-border)] p-5">
          <p className="text-2xl font-bold">{dimensions.length} 维</p>
          <p className="text-sm text-[var(--color-text-secondary)]">人格切面</p>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-4">SKTI 从 6 组切面看滑雪人格</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-10">
        {dimensions.map((dim) => (
          <div
            key={dim.id}
            className="bg-[var(--color-card)] rounded-xl border border-[var(--color-border)] p-5"
          >
            <p className="text-xs font-mono text-[var(--color-text-secondary)] mb-1">
              {dim.id.toUpperCase()} ·{" "}
              {dim.type === "serious" ? "核心维度" : dim.type === "funny" ? "搞笑维度" : "混搭维度"}
            </p>
            <h3 className="font-bold mb-1">{dim.name}</h3>
            <p className="text-sm text-[var(--color-text-secondary)]">
              {dim.lowLabel} ↔ {dim.highLabel}
            </p>
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-bold mb-4">最简单的方式是直接开始测试</h2>
      <Link
        href="/test"
        className="inline-block bg-[var(--color-primary)] text-white px-6 py-2.5 rounded-full text-sm font-medium hover:opacity-90 transition-opacity"
      >
        进入测试
      </Link>
    </main>
  );
}
