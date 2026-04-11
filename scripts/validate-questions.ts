/**
 * Validation: each personality must match itself when answering its "ideal script".
 * Also runs Monte Carlo to check distribution balance.
 */
import { questions } from "../data/questions";
import { personalities } from "../data/personalities";
import {
  computePersonalityScores,
  matchPersonality,
  getTopMatches,
} from "../lib/scoring";

const OPTIONS = ["A", "B", "C"] as const;

function idealAnswersFor(slug: string): number[] {
  // Pick option that maximizes (slug points - max competitor points)
  // This avoids the bug where slug=0 defaults to A and lets competitors accumulate
  return questions.map((q) => {
    let bestIdx = 0;
    let bestAdvantage = -Infinity;
    for (let i = 0; i < 3; i++) {
      const opt = q.effects[OPTIONS[i]];
      const slugPts = opt[slug] ?? 0;
      let maxOther = 0;
      for (const [k, v] of Object.entries(opt)) {
        if (k !== slug && v > maxOther) maxOther = v;
      }
      const advantage = slugPts - maxOther;
      if (advantage > bestAdvantage) {
        bestAdvantage = advantage;
        bestIdx = i;
      }
    }
    return bestIdx;
  });
}

function signatureCount(slug: string): number {
  let n = 0;
  for (const q of questions) {
    for (const opt of OPTIONS) {
      if ((q.effects[opt][slug] ?? 0) >= 3) {
        n++;
        break;
      }
    }
  }
  return n;
}

function strongCount(slug: string): number {
  let n = 0;
  for (const q of questions) {
    for (const opt of OPTIONS) {
      if ((q.effects[opt][slug] ?? 0) >= 2) {
        n++;
        break;
      }
    }
  }
  return n;
}

function maxIdealScore(slug: string): number {
  return questions.reduce((sum, q) => {
    const a = Math.max(
      q.effects.A[slug] ?? 0,
      q.effects.B[slug] ?? 0,
      q.effects.C[slug] ?? 0
    );
    return sum + a;
  }, 0);
}

console.log("=== Per-personality coverage and self-match ===\n");
const failures: string[] = [];
let warnSig = 0;
const idealRows: Array<[string, number, number, number, string, number, string]> = [];

for (const p of personalities) {
  const ideal = idealAnswersFor(p.slug);
  const scores = computePersonalityScores(ideal);
  const top = getTopMatches(ideal, 3);
  const topSlug = top[0].personality.slug;
  const topScore = top[0].score;
  const ownScore = scores[p.slug];
  const sigN = signatureCount(p.slug);
  const strongN = strongCount(p.slug);
  const maxIdeal = maxIdealScore(p.slug);
  const margin = topSlug === p.slug ? top[1] ? topScore - top[1].score : 999 : ownScore - topScore;

  const status = topSlug === p.slug ? "OK" : `FAIL → ${topSlug}(${topScore})`;
  if (topSlug !== p.slug) failures.push(`${p.slug} → matched ${topSlug}`);
  if (sigN < 5) warnSig++;

  idealRows.push([p.slug, sigN, strongN, maxIdeal, status, margin, top.slice(0, 3).map((t) => `${t.personality.slug}(${t.score})`).join(", ")]);
}

idealRows.sort((a, b) => (a[4] === "OK" ? 1 : 0) - (b[4] === "OK" ? 1 : 0));
console.log("slug".padEnd(10), "sig≥3".padStart(6), "sig≥2".padStart(6), "maxIdeal".padStart(9), "status".padEnd(20), "margin".padStart(7), "top3");
for (const [slug, sig, strong, maxI, status, margin, top3] of idealRows) {
  console.log(
    slug.padEnd(10),
    String(sig).padStart(6),
    String(strong).padStart(6),
    String(maxI).padStart(9),
    status.padEnd(20),
    String(margin).padStart(7),
    top3
  );
}

console.log("\n=== Failures ===");
if (failures.length === 0) {
  console.log("✅ All personalities self-match.");
} else {
  console.log(`❌ ${failures.length} failures:`);
  for (const f of failures) console.log("  -", f);
}

// === Structural ceiling (max possible points each personality can earn) ===
// liveQ   = # questions where slug appears in at least one option (slug can score)
// maxCeil = sum of max(A,B,C) for slug across all questions (greedy ceiling)
// refs    = total (question,option) pairs where slug > 0 (footprint size)
// totalPts= sum of all slug points across the whole question bank
console.log("\n=== Structural ceiling (sorted asc by maxCeil) ===");
const ceilings = personalities.map((p) => {
  let liveQ = 0;
  let maxC = 0;
  let refs = 0;
  let totalPts = 0;
  for (const q of questions) {
    let qHasSlug = false;
    let qMax = 0;
    for (const opt of OPTIONS) {
      const v = q.effects[opt][p.slug] ?? 0;
      if (v > 0) {
        qHasSlug = true;
        refs++;
        totalPts += v;
        if (v > qMax) qMax = v;
      }
    }
    if (qHasSlug) liveQ++;
    maxC += qMax;
  }
  return { slug: p.slug, liveQ, maxC, refs, totalPts };
});
ceilings.sort((a, b) => a.maxC - b.maxC);
console.log(
  "slug".padEnd(10),
  "liveQ".padStart(6),
  "maxCeil".padStart(8),
  "refs".padStart(6),
  "totalPts".padStart(9)
);
for (const c of ceilings) {
  console.log(
    c.slug.padEnd(10),
    String(c.liveQ).padStart(6),
    String(c.maxC).padStart(8),
    String(c.refs).padStart(6),
    String(c.totalPts).padStart(9)
  );
}

// === Monte Carlo distribution ===
console.log("\n=== Monte Carlo (100k random answers) ===");
const counts: Record<string, number> = {};
for (const p of personalities) counts[p.slug] = 0;

const N = 100_000;
for (let i = 0; i < N; i++) {
  const ans = questions.map(() => Math.floor(Math.random() * 3));
  const m = matchPersonality(ans);
  counts[m.slug]++;
}

const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
const ideal = (1 / personalities.length) * 100;
console.log(`Ideal share: ${ideal.toFixed(2)}% per personality (${personalities.length} total)\n`);
for (const [slug, n] of sorted) {
  const pct = (n / N) * 100;
  let flag = "";
  if (pct > ideal * 3) flag = " 🔴 (>3x mean)";
  else if (pct > ideal * 2) flag = " 🟠 (>2x mean)";
  else if (pct < ideal * 0.3) flag = " 🔴 (<0.3x mean)";
  else if (pct < ideal * 0.5) flag = " 🟠 (<0.5x mean)";
  console.log(`${slug.padEnd(10)} ${String(n).padStart(6)}  ${pct.toFixed(2).padStart(5)}%${flag}`);
}

const reachable = Object.values(counts).filter((c) => c > 0).length;
console.log(`\nReachable via random: ${reachable} / ${personalities.length}`);

// === Coverage warnings ===
console.log("\n=== Coverage warnings ===");
if (warnSig > 0) {
  console.log(`${warnSig} personalities have <5 signature questions (sig≥3)`);
  for (const [slug, sig] of idealRows.map(r => [r[0], r[1]] as [string, number])) {
    if (sig < 5) console.log(`  - ${slug}: ${sig}`);
  }
} else {
  console.log("✅ All personalities have ≥5 signature questions");
}
