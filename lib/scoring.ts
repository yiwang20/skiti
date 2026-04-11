import { questions } from "@/data/questions";
import { personalities, Personality } from "@/data/personalities";

type Scores = [number, number, number, number, number, number];

const OPTIONS = ["A", "B", "C"] as const;

/** Compute raw points for every personality from a set of answers. */
export function computePersonalityScores(
  answers: number[]
): Record<string, number> {
  const scores: Record<string, number> = {};
  for (const p of personalities) scores[p.slug] = 0;

  questions.forEach((q, qi) => {
    const a = answers[qi];
    if (a == null || a < 0 || a > 2) return;
    const optKey = OPTIONS[a];
    const effect = q.effects[optKey];
    if (!effect) return;
    for (const [slug, points] of Object.entries(effect)) {
      if (slug in scores) scores[slug] += points;
    }
  });

  return scores;
}

/** Return the top match (highest score; ties broken by personality order). */
export function matchPersonality(answers: number[]): Personality {
  const scores = computePersonalityScores(answers);
  let best: Personality = personalities[0];
  let bestScore = -Infinity;
  for (const p of personalities) {
    if (scores[p.slug] > bestScore) {
      bestScore = scores[p.slug];
      best = p;
    }
  }
  return best;
}

/** Return top N matches with their scores. */
export function getTopMatches(
  answers: number[],
  n = 3
): Array<{ personality: Personality; score: number }> {
  const scores = computePersonalityScores(answers);
  return personalities
    .map((p) => ({ personality: p, score: scores[p.slug] }))
    .sort((a, b) => b.score - a.score)
    .slice(0, n);
}

/**
 * Compute the displayed dimension bars from answers.
 * Strategy: blended profile of top-3 matches, weighted by score.
 * This makes the bars personality-aware while preserving slight user variation.
 */
export function computeScores(answers: number[]): Scores {
  const top = getTopMatches(answers, 3);
  if (top.length === 0 || top[0].score <= 0) {
    return [50, 50, 50, 50, 50, 50];
  }
  const totalWeight = top.reduce((s, t) => s + Math.max(0, t.score), 0);
  if (totalWeight <= 0) {
    return top[0].personality.profile.slice() as Scores;
  }
  const blended = [0, 0, 0, 0, 0, 0];
  for (const { personality, score } of top) {
    const w = Math.max(0, score) / totalWeight;
    personality.profile.forEach((v, i) => {
      blended[i] += v * w;
    });
  }
  return blended.map((v) => Math.round(v)) as Scores;
}
