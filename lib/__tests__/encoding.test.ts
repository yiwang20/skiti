import { encodeScores, decodeScores } from "../encoding";

describe("encodeScores", () => {
  it("encodes 6 dimension scores (0-100) into a 12-char string", () => {
    const scores: [number, number, number, number, number, number] = [50, 75, 25, 100, 0, 60];
    const encoded = encodeScores(scores);
    expect(encoded).toHaveLength(12);
    expect(typeof encoded).toBe("string");
  });

  it("round-trips correctly", () => {
    const scores: [number, number, number, number, number, number] = [50, 75, 25, 100, 0, 60];
    const encoded = encodeScores(scores);
    const decoded = decodeScores(encoded);
    expect(decoded).toEqual(scores);
  });

  it("handles all zeros", () => {
    const scores: [number, number, number, number, number, number] = [0, 0, 0, 0, 0, 0];
    const decoded = decodeScores(encodeScores(scores));
    expect(decoded).toEqual(scores);
  });

  it("handles all 100s", () => {
    const scores: [number, number, number, number, number, number] = [100, 100, 100, 100, 100, 100];
    const decoded = decodeScores(encodeScores(scores));
    expect(decoded).toEqual(scores);
  });
});

describe("decodeScores", () => {
  it("returns null for invalid input", () => {
    expect(decodeScores("")).toBeNull();
    expect(decodeScores("abc")).toBeNull();
    expect(decodeScores("toolongstring123")).toBeNull();
  });
});
