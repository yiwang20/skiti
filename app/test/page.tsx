"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { questions } from "@/data/questions";
import { computeScores, matchPersonality } from "@/lib/scoring";
import { encodeScores } from "@/lib/encoding";
import QuestionCard from "@/components/QuestionCard";
import ProgressBar from "@/components/ProgressBar";

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function TestPage() {
  const router = useRouter();
  const [shuffledQuestions, setShuffledQuestions] = useState(() =>
    shuffleArray(questions)
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(
    () => new Array(questions.length).fill(null)
  );

  const currentQuestion = shuffledQuestions[currentIndex];

  const handleSelect = useCallback(
    (answerIndex: number) => {
      const newAnswers = [...answers];
      const originalIndex = questions.indexOf(currentQuestion);
      newAnswers[originalIndex] = answerIndex;
      setAnswers(newAnswers);

      setTimeout(() => {
        if (currentIndex < shuffledQuestions.length - 1) {
          setCurrentIndex((i) => i + 1);
        } else {
          const finalAnswers = newAnswers.map((a) => a ?? 1);
          const scores = computeScores(finalAnswers);
          const personality = matchPersonality(scores);
          const encoded = encodeScores(scores);
          router.push(`/result/${personality.slug}?s=${encoded}`);
        }
      }, 300);
    },
    [answers, currentIndex, currentQuestion, shuffledQuestions, router]
  );

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex((i) => i - 1);
  };

  const handleReshuffle = () => {
    setShuffledQuestions(shuffleArray(questions));
    setCurrentIndex(0);
    setAnswers(new Array(questions.length).fill(null));
  };

  const originalIndex = questions.indexOf(currentQuestion);
  const currentAnswer = answers[originalIndex];

  return (
    <main className="flex-1 max-w-2xl mx-auto px-4 py-8 md:py-16">
      <h1 className="text-2xl md:text-3xl font-bold mb-2">
        一题一题答，最后直接落到你的人格页。
      </h1>
      <p className="text-sm text-[var(--color-text-secondary)] mb-8">
        这套测试共 {questions.length} 题，题目与结果直接映射。完成后会跳转到你的人格详情页。
      </p>

      <ProgressBar current={currentIndex} total={shuffledQuestions.length} />

      <div className="mt-8">
        <QuestionCard
          question={currentQuestion}
          questionIndex={currentIndex}
          selectedAnswer={currentAnswer}
          onSelect={handleSelect}
        />
      </div>

      <div className="flex gap-3 mt-8">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="text-sm px-4 py-2 rounded-lg border border-[var(--color-border)] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[var(--color-primary-light)] transition-colors"
        >
          上一题
        </button>
        <button
          onClick={handleReshuffle}
          className="text-sm px-4 py-2 rounded-lg border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-primary-light)] transition-colors"
        >
          重新随机题序
        </button>
      </div>
    </main>
  );
}
