// Observed 5th/95th percentile score for each dimension under random answers.
// Used to rescale raw scores (which rarely reach 0 or 100) into a visual
// position on the dimension bar, so "high" actually looks high and "low"
// actually looks low.
//
// Regenerate with `npx tsx scripts/calibrate.ts` and copy the percentile table.

const OBSERVED_RANGES: [number, number][] = [
  [27, 68], // s1 技术风格
  [17, 75], // s2 选道偏好
  [30, 67], // s3 社交属性
  [21, 71], // s4 装扮执念
  [27, 63], // s5 摸鱼指数
  [17, 83], // s6 装备心态
];

/**
 * Map a raw score (0-100) on dimension `dimIndex` to a visual position (0-100)
 * based on the observed achievable range. Clamped to [0, 100].
 */
export function rescaleForDisplay(dimIndex: number, rawScore: number): number {
  const [lo, hi] = OBSERVED_RANGES[dimIndex];
  if (hi <= lo) return 50;
  const t = ((rawScore - lo) / (hi - lo)) * 100;
  return Math.max(0, Math.min(100, Math.round(t)));
}
