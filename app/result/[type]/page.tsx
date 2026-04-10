import { Suspense } from "react";
import { personalities } from "@/data/personalities";
import ResultContent from "./ResultContent";

export function generateStaticParams() {
  return personalities.map((p) => ({ type: p.slug }));
}

export default function ResultPage() {
  return (
    <Suspense
      fallback={
        <main className="flex-1 flex items-center justify-center">
          <p>加载中...</p>
        </main>
      }
    >
      <ResultContent />
    </Suspense>
  );
}
