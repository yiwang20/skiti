import { questions } from "../data/questions";
import { personalities } from "../data/personalities";
import { computeScores, matchPersonality } from "../lib/scoring";

// Step 1: Sample distribution from 100k random answers
const N = 100000;
const samples: number[][] = Array.from({ length: 6 }, () => []);
for (let i = 0; i < N; i++) {
  const answers = Array.from({ length: questions.length }, () =>
    Math.floor(Math.random() * 3)
  );
  const scores = computeScores(answers);
  scores.forEach((s, idx) => samples[idx].push(s));
}

// Sort each dimension to compute percentiles
samples.forEach((arr) => arr.sort((a, b) => a - b));

function pct(dim: number, p: number): number {
  const arr = samples[dim];
  const idx = Math.floor((p / 100) * arr.length);
  return arr[Math.min(idx, arr.length - 1)];
}

// Print percentile table
console.log("=== Observed percentiles per dimension ===");
console.log("dim | p05 | p15 | p25 | p50 | p75 | p85 | p95");
for (let i = 0; i < 6; i++) {
  console.log(
    `s${i + 1}  | ${pct(i, 5).toString().padStart(3)} | ${pct(i, 15).toString().padStart(3)} | ${pct(i, 25).toString().padStart(3)} | ${pct(i, 50).toString().padStart(3)} | ${pct(i, 75).toString().padStart(3)} | ${pct(i, 85).toString().padStart(3)} | ${pct(i, 95).toString().padStart(3)}`
  );
}

// Step 2: Map level strings to percentiles
const LEVEL_PCT: Record<string, number> = {
  vlow: 5,
  low: 25,
  mid: 50,
  high: 75,
  vhigh: 95,
};

// Step 3: Define new intent for each personality
// [s1 tech, s2 trail, s3 social, s4 fashion, s5 slacker, s6 gear]
type Level = keyof typeof LEVEL_PCT;
const intent: Record<string, [Level, Level, Level, Level, Level, Level]> = {
  sofa:      ["low",   "low",   "mid",   "mid",   "vhigh", "low"],   // slacker lodge-lover
  yolo:      ["vhigh", "high",  "mid",   "low",   "vlow",  "low"],   // reckless
  gucci:     ["low",   "low",   "high",  "vhigh", "high",  "high"],  // fashion queen
  gps:       ["mid",   "mid",   "vhigh", "low",   "low",   "mid"],   // leader
  "404":     ["high",  "high",  "low",   "low",   "low",   "mid"],   // lone backcountry
  bling:     ["low",   "low",   "mid",   "high",  "mid",   "vhigh"], // gear nerd
  npc:       ["low",   "low",   "low",   "low",   "mid",   "low"],   // generic
  drama:     ["mid",   "low",   "vhigh", "mid",   "mid",   "low"],   // social drama
  ice:       ["high",  "high",  "vlow",  "vlow",  "vlow",  "mid"],   // cold loner
  wifi:      ["mid",   "low",   "high",  "high",  "mid",   "mid"],   // content creator
  sensei:    ["mid",   "low",   "vhigh", "low",   "low",   "mid"],   // teacher
  vip:       ["mid",   "low",   "mid",   "high",  "high",  "vhigh"], // luxury
  penguin:   ["vlow",  "vlow",  "mid",   "low",   "mid",   "low"],   // beginner
  pro:       ["vhigh", "vhigh", "low",   "low",   "vlow",  "high"],  // top skill
  couple:    ["low",   "low",   "high",  "high",  "mid",   "mid"],   // couple vibe
  stamp:     ["mid",   "high",  "mid",   "low",   "low",   "low"],   // collector
  park:      ["high",  "high",  "high",  "mid",   "vlow",  "high"],  // park rat
  photo:     ["low",   "low",   "high",  "high",  "high",  "high"],  // photographer
  drunk:     ["mid",   "low",   "high",  "mid",   "vhigh", "low"],   // drunk
  early:     ["high",  "high",  "vlow",  "low",   "vlow",  "mid"],   // early riser
  rental:    ["mid",   "low",   "low",   "vlow",  "mid",   "vlow"],  // cheap rental
  safety:    ["vlow",  "vlow",  "high",  "low",   "mid",   "high"],  // safety freak
  groupie:   ["low",   "low",   "vhigh", "mid",   "mid",   "low"],   // group leader
  zen:       ["mid",   "mid",   "vlow",  "vlow",  "low",   "low"],   // zen
  flex:      ["high",  "high",  "high",  "high",  "mid",   "high"],  // flex traveler
};

// Step 4: Compute new profiles
const newProfiles: Record<string, [number, number, number, number, number, number]> = {};
for (const [slug, levels] of Object.entries(intent)) {
  newProfiles[slug] = levels.map((lv, i) => pct(i, LEVEL_PCT[lv])) as any;
}

console.log("\n=== New profiles ===");
for (const p of personalities) {
  console.log(`${p.slug.padEnd(10)} ${JSON.stringify(newProfiles[p.slug])}`);
}

// Step 5: Test matching with new profiles
// Monkey-patch for simulation
function matchWithNewProfiles(scores: [number, number, number, number, number, number]): string {
  let bestSlug = "";
  let bestDist = Infinity;
  for (const [slug, profile] of Object.entries(newProfiles)) {
    const d = Math.sqrt(
      profile.reduce((sum, v, i) => sum + (v - scores[i]) ** 2, 0)
    );
    if (d < bestDist) {
      bestDist = d;
      bestSlug = slug;
    }
  }
  return bestSlug;
}

const counts: Record<string, number> = {};
personalities.forEach((p) => (counts[p.slug] = 0));
for (let i = 0; i < N; i++) {
  const answers = Array.from({ length: questions.length }, () =>
    Math.floor(Math.random() * 3)
  );
  const scores = computeScores(answers);
  const slug = matchWithNewProfiles(scores);
  counts[slug]++;
}

console.log("\n=== Monte Carlo with NEW profiles ===");
const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
sorted.forEach(([slug, n]) => {
  const p = ((n / N) * 100).toFixed(2);
  const bar = "█".repeat(Math.round(Number(p) / 2));
  console.log(`${slug.padEnd(10)} ${n.toString().padStart(6)} (${p.padStart(5)}%) ${bar}`);
});

// Summary stats
const pcts = Object.values(counts).map((n) => (n / N) * 100);
const max = Math.max(...pcts);
const min = Math.min(...pcts);
const top5 = pcts.sort((a, b) => b - a).slice(0, 5).reduce((a, b) => a + b, 0);
console.log(`\nMax: ${max.toFixed(2)}%  Min: ${min.toFixed(2)}%  Top5: ${top5.toFixed(2)}%`);

// Output as TS literals for pasting
console.log("\n=== TypeScript profile patches ===");
for (const p of personalities) {
  console.log(`  ${p.slug}: ${JSON.stringify(newProfiles[p.slug])},`);
}
