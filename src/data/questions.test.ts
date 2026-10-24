import { describe, expect, it } from "vitest";
import { questions } from "./questions";
import type { Category, Rationale } from "@/types/quiz";

/** 数据契约测试：保证题目数据在结构与评分口径上自洽 */
describe("questions 数据契约", () => {
  it("id 唯一且非空", () => {
    const ids = questions.map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids.every((id) => id.length > 0)).toBe(true);
  });

  it("每题恰好两个选项，且选项文案不重复", () => {
    for (const q of questions) {
      expect(q.options.length).toBe(2);
      expect(q.options[0].label).not.toBe(q.options[1].label);
    }
  });

  it("goodOption 只能是 0 或 1", () => {
    for (const q of questions) expect([0, 1]).toContain(q.goodOption);
  });

  it("goodFrequency 在 (0, 1) 开区间内", () => {
    for (const q of questions) {
      expect(q.goodFrequency).toBeGreaterThan(0);
      expect(q.goodFrequency).toBeLessThan(1);
    }
  });

  it("rationale 全部合法，且四个层级都有使用", () => {
    const valid: Rationale[] = ["risk", "function", "bandwidth", "neutral"];
    for (const q of questions) expect(valid).toContain(q.rationale);
    const used = new Set(questions.map((q) => q.rationale));
    for (const r of valid) expect(used.has(r)).toBe(true);
  });

  it("类别全部合法且三个类别都有覆盖", () => {
    const valid: Category[] = ["sensory", "body", "brain"];
    for (const q of questions) expect(valid).toContain(q.category);
    const used = new Set(questions.map((q) => q.category));
    for (const c of valid) expect(used.has(c)).toBe(true);
  });

  it("每题都有题干与解释文本", () => {
    for (const q of questions) {
      expect(q.question.length).toBeGreaterThan(0);
      expect(q.explanation.length).toBeGreaterThan(0);
    }
  });
});
