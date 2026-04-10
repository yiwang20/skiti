type Scores = [number, number, number, number, number, number];

export function encodeScores(scores: Scores): string {
  return scores
    .map((s) => {
      const clamped = Math.round(Math.min(100, Math.max(0, s)));
      return clamped.toString(36).padStart(2, "0");
    })
    .join("");
}

export function decodeScores(encoded: string): Scores | null {
  if (!encoded || encoded.length !== 12) return null;
  try {
    const scores = Array.from({ length: 6 }, (_, i) => {
      const chunk = encoded.slice(i * 2, i * 2 + 2);
      const val = parseInt(chunk, 36);
      if (isNaN(val) || val < 0 || val > 100) throw new Error("invalid");
      return val;
    }) as Scores;
    return scores;
  } catch {
    return null;
  }
}
