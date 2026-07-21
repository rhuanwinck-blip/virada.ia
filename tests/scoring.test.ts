import { describe, expect, it } from "vitest";
import { demoAnswers, questions } from "@/lib/questions";
import { detectContradictions, scoreDiagnostic } from "@/lib/scoring";

describe("scoreDiagnostic", () => {
  it("returns deterministic scores for the same answers", () => {
    const first = scoreDiagnostic(demoAnswers);
    const second = scoreDiagnostic(demoAnswers);

    expect(first).toEqual(second);
    expect(first.viradaIndex).toBeGreaterThanOrEqual(0);
    expect(first.viradaIndex).toBeLessThanOrEqual(100);
    expect(first.pillarScores).toHaveLength(6);
    expect(first.thirtyDayPlan).toHaveLength(30);
  });

  it("normalizes all question answers without missing pillars", () => {
    const allFive = Object.fromEntries(questions.map((question) => [question.key, 5]));
    const result = scoreDiagnostic(allFive);

    expect(result.pillarScores.every((pillar) => pillar.score >= 0 && pillar.score <= 100)).toBe(true);
    expect(result.topBlockers).toHaveLength(3);
  });

  it("detects meaningful contradictions", () => {
    const contradictions = detectContradictions({
      priority_defined: 5,
      too_many_goals: 5,
      keeps_small_commitments: 5,
      abandons_plans: 5
    });

    expect(contradictions.map((item) => item.key)).toContain("direction-overload");
    expect(contradictions.map((item) => item.key)).toContain("commitment-abandon");
  });
});
