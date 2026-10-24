import { describe, expect, it } from "vitest";
import { questions } from "./questions";
import type { Category } from "@/types/quiz";

/** 数据契约测试：保证题目数据在结构与评分口径上自洽 */
describe("questions 数据契约", () => {
  it("id 唯一且非空", () => {
    const ids = questions.map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids.every((id) => id.length > 0)).toBe(true);
  });

  it("每题恰好两个选项，分数在 0–100 之间", () => {
    for (const q of questions) {
      expect(q.options.length).toBe(2);
      for (const o of q.options) {
        expect(o.score).toBeGreaterThanOrEqual(0);
        expect(o.score).toBeLessThanOrEqual(100);
      }
    }
  });

  it("类别全部合法且三个类别都有覆盖", () => {
    const valid: Category[] = ["sensory", "body", "brain"];
    for (const q of questions) expect(valid).toContain(q.category);
    const used = new Set(questions.map((q) => q.category));
    for (const c of valid) expect(used.has(c)).toBe(true);
  });

  it("选项分数允许并列，但每题两选项不应完全同分（保证二分有意义）", () => {
    for (const q of questions) {
      expect(q.options[0].score).not.toBe(q.options[1].score);
    }
  });

  it("每题都有解释文本", () => {
    for (const q of questions) expect(q.explanation.length).toBeGreaterThan(0);
  });
});
