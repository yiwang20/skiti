import { computeScores, matchPersonality } from "../scoring";
import { questions } from "../../data/questions";
import { personalities } from "../../data/personalities";

describe("computeScores", () => {
  it("returns 6 scores between 0 and 100", () => {
    const answers = new Array(questions.length).fill(1);
    const scores = computeScores(answers);
    expect(scores).toHaveLength(6);
    scores.forEach((s) => {
      expect(s).toBeGreaterThanOrEqual(0);
      expect(s).toBeLessThanOrEqual(100);
    });
  });

  it("all-A and all-C produce different scores", () => {
    const allA = new Array(questions.length).fill(0);
    const allC = new Array(questions.length).fill(2);
    const scoresA = computeScores(allA);
    const scoresC = computeScores(allC);
    expect(scoresA).not.toEqual(scoresC);
  });
});

describe("matchPersonality", () => {
  it("returns a valid personality slug", () => {
    const answers = new Array(questions.length).fill(1);
    const scores = computeScores(answers);
    const personality = matchPersonality(scores);
    expect(personalities.some((p) => p.slug === personality.slug)).toBe(true);
  });
});
