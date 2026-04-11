/**
 * Tune question effects to achieve both:
 *  1. Each personality self-matches its own ideal answer script
 *  2. Monte Carlo distribution is balanced (every share between 0.5% and 8%)
 *
 * Approach: alternate between fixing self-match failures (reduce dominators on
 * loser's preferred options, boost loser) and balancing distribution (reduce
 * over-represented personalities, boost under-represented).
 */
import * as fs from "fs";
import * as path from "path";
import { questions } from "../data/questions";
import { personalities } from "../data/personalities";

type Effects = Record<string, number>;
type QuestionEffects = { A: Effects; B: Effects; C: Effects };

const OPTIONS = ["A", "B", "C"] as const;

const eff: QuestionEffects[] = questions.map((q) => ({
  A: { ...q.effects.A },
  B: { ...q.effects.B },
  C: { ...q.effects.C },
}));

function scoreOf(answers: number[], slug: string): number {
  let s = 0;
  for (let i = 0; i < eff.length; i++) {
    s += eff[i][OPTIONS[answers[i]]][slug] ?? 0;
  }
  return s;
}

function idealAnswers(slug: string): number[] {
  return eff.map((e) => {
    let bestI = 0;
    let bestV = -Infinity;
    for (let i = 0; i < 3; i++) {
      const v = e[OPTIONS[i]][slug] ?? 0;
      if (v > bestV) {
        bestV = v;
        bestI = i;
      }
    }
    return bestI;
  });
}

function topSlug(answers: number[]): { slug: string; score: number; second: string; secondScore: number } {
  let bestSlug = personalities[0].slug;
  let bestScore = -Infinity;
  let secondSlug = bestSlug;
  let secondScore = -Infinity;
  for (const p of personalities) {
    const s = scoreOf(answers, p.slug);
    if (s > bestScore) {
      secondSlug = bestSlug;
      secondScore = bestScore;
      bestSlug = p.slug;
      bestScore = s;
    } else if (s > secondScore) {
      secondSlug = p.slug;
      secondScore = s;
    }
  }
  return { slug: bestSlug, score: bestScore, second: secondSlug, secondScore };
}

function checkSelfMatch(): { failures: Array<{ slug: string; winner: string; ownScore: number; winnerScore: number; ideal: number[] }>; passes: number } {
  const failures: Array<{ slug: string; winner: string; ownScore: number; winnerScore: number; ideal: number[] }> = [];
  let passes = 0;
  for (const p of personalities) {
    const ideal = idealAnswers(p.slug);
    const top = topSlug(ideal);
    if (top.slug === p.slug) {
      passes++;
    } else {
      failures.push({
        slug: p.slug,
        winner: top.slug,
        ownScore: scoreOf(ideal, p.slug),
        winnerScore: top.score,
        ideal,
      });
    }
  }
  return { failures, passes };
}

function monteCarlo(N = 30000): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const p of personalities) counts[p.slug] = 0;
  for (let i = 0; i < N; i++) {
    const ans = eff.map(() => Math.floor(Math.random() * 3));
    const t = topSlug(ans);
    counts[t.slug]++;
  }
  return counts;
}

function fixSelfMatchFailures(): boolean {
  const { failures } = checkSelfMatch();
  if (failures.length === 0) return false;
  failures.sort((a, b) => (a.winnerScore - a.ownScore) - (b.winnerScore - b.ownScore));
  for (const f of failures) {
    // ADD-ONLY strategy: boost slug on its preferred options where it has > 0 points
    let boosts = 0;
    const deficit = f.winnerScore - f.ownScore;
    const maxBoosts = Math.max(4, deficit + 2);
    for (let qi = 0; qi < eff.length && boosts < maxBoosts; qi++) {
      const opt = OPTIONS[f.ideal[qi]];
      const cur = eff[qi][opt][f.slug] ?? 0;
      if (cur >= 1 && cur < 5) {
        eff[qi][opt][f.slug] = cur + 1;
        boosts++;
      }
    }
  }
  return true;
}

function balanceDistribution(targetMin: number, targetMax: number): boolean {
  const counts = monteCarlo();
  const N = 30000;
  let any = false;

  // Find over-represented and under-represented
  const over: Array<[string, number]> = [];
  const under: Array<[string, number]> = [];
  for (const [slug, c] of Object.entries(counts)) {
    const pct = c / N;
    if (pct > targetMax) over.push([slug, pct]);
    if (pct < targetMin) under.push([slug, pct]);
  }
  over.sort((a, b) => b[1] - a[1]);
  under.sort((a, b) => a[1] - b[1]);

  // Reduce over-represented but ONLY non-signature entries (≤3 points).
  // Signature entries (4-5) are semantically meaningful and protected.
  for (const [slug] of over.slice(0, 5)) {
    const candidates: Array<[number, "A" | "B" | "C"]> = [];
    for (let qi = 0; qi < eff.length; qi++) {
      for (const opt of OPTIONS) {
        const v = eff[qi][opt][slug] ?? 0;
        if (v >= 2 && v <= 3) candidates.push([qi, opt]);
      }
    }
    candidates.sort(() => Math.random() - 0.5);
    for (const [qi, opt] of candidates.slice(0, 4)) {
      const v = eff[qi][opt][slug];
      eff[qi][opt][slug] = v - 1;
      if (eff[qi][opt][slug] === 0) delete eff[qi][opt][slug];
      any = true;
    }
  }

  // Boost under-represented: pick 5 random options where they have ≥1 point and add 1
  for (const [slug] of under.slice(0, 8)) {
    const candidates: Array<[number, "A" | "B" | "C"]> = [];
    for (let qi = 0; qi < eff.length; qi++) {
      for (const opt of OPTIONS) {
        const v = eff[qi][opt][slug] ?? 0;
        if (v >= 1 && v < 5) candidates.push([qi, opt]);
      }
    }
    candidates.sort(() => Math.random() - 0.5);
    for (const [qi, opt] of candidates.slice(0, 4)) {
      const v = eff[qi][opt][slug] ?? 0;
      eff[qi][opt][slug] = v + 1;
      any = true;
    }
  }

  return any;
}

console.log("Initial...");
let { passes } = checkSelfMatch();
console.log(`Self-match: ${passes}/${personalities.length}`);

const TARGET_MIN = 0.015; // 1.5%
const TARGET_MAX = 0.06; // 6%

const MAX_OUTER = 80;
for (let outer = 0; outer < MAX_OUTER; outer++) {
  // Phase 1: fix self-match failures
  for (let inner = 0; inner < 30; inner++) {
    const { failures } = checkSelfMatch();
    if (failures.length === 0) break;
    fixSelfMatchFailures();
  }

  ({ passes } = checkSelfMatch());

  // Phase 2: balance distribution
  const counts = monteCarlo();
  const N = 30000;
  const overCount = Object.values(counts).filter((c) => c / N > TARGET_MAX).length;
  const underCount = Object.values(counts).filter((c) => c / N < TARGET_MIN).length;

  console.log(`Outer ${outer}: self-match ${passes}/${personalities.length}, over=${overCount}, under=${underCount}`);

  if (passes === personalities.length && overCount === 0 && underCount === 0) {
    console.log("✅ Both criteria met!");
    break;
  }

  balanceDistribution(TARGET_MIN, TARGET_MAX);
}

// Final validation
console.log("\n=== Final ===");
({ passes } = checkSelfMatch());
console.log(`Self-match: ${passes}/${personalities.length}`);
const finalCounts = monteCarlo(50000);
const N = 50000;
const sorted = Object.entries(finalCounts).sort((a, b) => b[1] - a[1]);
console.log("Distribution:");
for (const [slug, c] of sorted) {
  const pct = ((c / N) * 100).toFixed(2);
  let flag = "";
  if (c / N > TARGET_MAX) flag = " 🔴 over";
  if (c / N < TARGET_MIN) flag = " 🔴 under";
  console.log(`  ${slug.padEnd(10)} ${pct.padStart(5)}%${flag}`);
}

// Write back
function formatEffects(e: Effects): string {
  const entries = Object.entries(e).filter(([_, v]) => v > 0);
  entries.sort(([a], [b]) => a.localeCompare(b));
  return `{ ${entries.map(([k, v]) => /^\d/.test(k) || k.includes("-") ? `"${k}": ${v}` : `${k}: ${v}`).join(", ")} }`;
}

const original = fs.readFileSync(path.join(__dirname, "../data/questions.ts"), "utf-8");
let updated = original;

questions.forEach((q, qi) => {
  const newA = formatEffects(eff[qi].A);
  const newB = formatEffects(eff[qi].B);
  const newC = formatEffects(eff[qi].C);
  // Match by id instead of text to avoid quote escaping issues
  const blockRegex = new RegExp(
    `(id: ${q.id},[\\s\\S]*?effects: \\{[\\s\\S]*?A: )\\{[^}]*\\}([\\s\\S]*?B: )\\{[^}]*\\}([\\s\\S]*?C: )\\{[^}]*\\}`,
    "m"
  );
  if (blockRegex.test(updated)) {
    updated = updated.replace(blockRegex, `$1${newA}$2${newB}$3${newC}`);
  } else {
    console.warn(`Could not find block for Q${q.id}`);
  }
});

fs.writeFileSync(path.join(__dirname, "../data/questions.ts"), updated);
console.log("\nWrote tuned questions.ts");
