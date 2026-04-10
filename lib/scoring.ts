import { questions } from "@/data/questions";
import { personalities, Personality } from "@/data/personalities";
import { dimensions } from "@/data/dimensions";

type Scores = [number, number, number, number, number, number];

export function computeScores(answers: number[]): Scores {
  const dimIds = dimensions.map((d) => d.id);
  const rawScores = new Array(6).fill(0);
  const maxPossible = new Array(6).fill(0);

  questions.forEach((q, qi) => {
    const answer = answers[qi] ?? 1;
    q.effects.forEach((effect) => {
      const dimIndex = dimIds.indexOf(effect.dim);
      if (dimIndex === -1) return;
      rawScores[dimIndex] += effect.scores[answer];
      maxPossible[dimIndex] += Math.max(...effect.scores);
    });
  });

  return dimIds.map((_, i) => {
    if (maxPossible[i] === 0) return 50;
    const minPossible = questions.reduce((sum, q) => {
      const effect = q.effects.find((e) => e.dim === dimIds[i]);
      return sum + (effect ? Math.min(...effect.scores) : 0);
    }, 0);
    const normalized =
      ((rawScores[i] - minPossible) / (maxPossible[i] - minPossible)) * 100;
    return Math.round(Math.min(100, Math.max(0, normalized)));
  }) as Scores;
}

export function matchPersonality(scores: Scores): Personality {
  let bestMatch = personalities[0];
  let bestDistance = Infinity;

  for (const p of personalities) {
    const distance = Math.sqrt(
      p.profile.reduce(
        (sum, val, i) => sum + Math.pow(val - scores[i], 2),
        0
      )
    );
    if (distance < bestDistance) {
      bestDistance = distance;
      bestMatch = p;
    }
  }

  return bestMatch;
}
