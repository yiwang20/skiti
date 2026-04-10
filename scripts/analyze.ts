import { questions } from "../data/questions";
import { personalities } from "../data/personalities";
import { computeScores, matchPersonality } from "../lib/scoring";

// Extreme cases
const allA = new Array(questions.length).fill(0);
const allB = new Array(questions.length).fill(1);
const allC = new Array(questions.length).fill(2);

console.log("=== Extreme cases ===");
console.log("All A scores:", computeScores(allA));
console.log("All A match:", matchPersonality(computeScores(allA)).slug);
console.log("All B scores:", computeScores(allB));
console.log("All B match:", matchPersonality(computeScores(allB)).slug);
console.log("All C scores:", computeScores(allC));
console.log("All C match:", matchPersonality(computeScores(allC)).slug);

// Monte Carlo
const counts: Record<string, number> = {};
personalities.forEach((p) => (counts[p.slug] = 0));
const N = 100000;
for (let i = 0; i < N; i++) {
  const answers = Array.from({ length: questions.length }, () =>
    Math.floor(Math.random() * 3)
  );
  const p = matchPersonality(computeScores(answers));
  counts[p.slug]++;
}

console.log("\n=== Monte Carlo (100k random answers) ===");
const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
sorted.forEach(([slug, n]) => {
  const pct = ((n / N) * 100).toFixed(2);
  const marker = n === 0 ? "  ❌ UNREACHABLE" : "";
  console.log(`${slug.padEnd(12)} ${n.toString().padStart(6)} (${pct}%)${marker}`);
});

const unreachable = sorted.filter(([_, n]) => n === 0).map(([s]) => s);
console.log(`\nUnreachable via random: ${unreachable.length} / ${personalities.length}`);
if (unreachable.length > 0) console.log(unreachable);
