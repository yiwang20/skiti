"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Question } from "@/data/questions";

interface Props {
  question: Question;
  questionIndex: number;
  selectedAnswer: number | null;
  onSelect: (answerIndex: number) => void;
}

const labels = ["A", "B", "C"];

export default function QuestionCard({
  question,
  questionIndex,
  selectedAnswer,
  onSelect,
}: Props) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={questionIndex}
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -30 }}
        transition={{ duration: 0.25 }}
      >
        <h2 className="text-lg md:text-xl font-bold mb-6 leading-relaxed">
          {question.text}
        </h2>
        <div className="flex flex-col gap-3">
          {question.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => onSelect(i)}
              className={`text-left px-5 py-4 rounded-xl border transition-all text-sm leading-relaxed ${
                selectedAnswer === i
                  ? "border-[var(--color-primary)] bg-[var(--color-primary-light)]"
                  : "border-[var(--color-border)] bg-[var(--color-card)] hover:border-[var(--color-primary)]"
              }`}
            >
              <span className="font-medium mr-2">{labels[i]}</span>
              {opt}
            </button>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
