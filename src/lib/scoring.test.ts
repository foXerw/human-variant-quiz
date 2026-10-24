import { describe, expect, it } from "vitest";
import type { Answers, Question, Rationale } from "@/lib/types";
import {
  RATIONALE_WEIGHTS,
  calculateResult,
  formatOdds,
  generateShareText,
  getTitle,
  isComplete,
  percentileOf,
  roundTo1,
  scoreDistribution,
  totalWeight,
  weightOf,
} from "./scoring";
import { questions as REAL_QUESTIONS } from "@/data/questions";

/** 测试夹具：覆盖全部四种 rationale 层级，权重 3/2/1/1，总权重 7 */
function q(
  id: string,
  rationale: Rationale,
  goodFrequency: number,
  category: Question["category"] = "sensory",
): Question {
  return {
    id,
    category,
    title: `题目${id}`,
    question: `${id}？`,
    options: [{ label: `${id}好` }, { label: `${id}坏` }],
    goodOption: 0,
    goodFrequency,
    rationale,
    explanation: "解释",
  };
}

const QUESTIONS: Question[] = [
  q("q1", "risk", 0.5),
  q("q2", "function", 0.5, "body"),
  q("q3", "neutral", 0.5, "body"),
  q("q4", "bandwidth", 0.5, "brain"),
];

const allGood: Answers = { q1: 0, q2: 0, q3: 0, q4: 0 };
const allBad: Answers = { q1: 1, q2: 1, q3: 1, q4: 1 };
const partial: Answers = { q1: 0, q2: 1, q3: 0, q4: 1 }; // raw = 3+1 = 4 / 7

describe("权重体系", () => {
  it("rationale 层级决定权重：risk 3 / function 2 / bandwidth 1 / neutral 1", () => {
    expect(weightOf(QUESTIONS[0])).toBe(3);
    expect(weightOf(QUESTIONS[1])).toBe(2);
    expect(weightOf(QUESTIONS[2])).toBe(1);
    expect(weightOf(QUESTIONS[3])).toBe(1);
    expect(totalWeight(QUESTIONS)).toBe(7);
    expect(RATIONALE_WEIGHTS.risk).toBeGreaterThan(RATIONALE_WEIGHTS.function);
  });
});

describe("roundTo1", () => {
  it("保留 1 位小数且不产生浮点尾差", () => {
    expect(roundTo1(84.95)).toBe(85);
    expect(roundTo1(0.1 + 0.2)).toBe(0.3);
    expect(roundTo1(4 / 7 * 100)).toBe(57.1);
  });
});

describe("isComplete", () => {
  it("缺任何一题都算未完成", () => {
    expect(isComplete({ q1: 0, q2: 1, q3: 0 }, QUESTIONS)).toBe(false);
    expect(isComplete(allGood, QUESTIONS)).toBe(true);
  });
});

describe("calculateResult：配置完成度", () => {
  it("全部好极 → 恰好 100 + 究极人类候选", () => {
    const result = calculateResult(allGood, QUESTIONS)!;
    expect(result.totalScore).toBe(100);
    expect(result.titleInfo.title).toBe("究极人类候选");
  });

  it("加权完成度 = Σ(权重×好极)/Σ权重：raw 4/7 → 57.1", () => {
    const result = calculateResult(partial, QUESTIONS)!;
    expect(result.totalScore).toBe(57.1);
  });

  it("单调性：任一题从坏极翻到好极，总分严格上升", () => {
    const base = calculateResult(allBad, QUESTIONS)!.totalScore;
    const flipQ3 = calculateResult({ ...allBad, q3: 0 }, QUESTIONS)!.totalScore;
    const flipQ1 = calculateResult({ ...allBad, q1: 0 }, QUESTIONS)!.totalScore;
    expect(flipQ3).toBeGreaterThan(base);
    expect(flipQ1).toBeGreaterThan(flipQ3); // 权重更大的题贡献更大
  });

  it("答题不完整时返回 null（全部答完才能出结果）", () => {
    expect(calculateResult({ q1: 0, q2: 1 }, QUESTIONS)).toBeNull();
    expect(calculateResult({}, QUESTIONS)).toBeNull();
  });

  it("分类得分 = 该类别加权完成度", () => {
    const result = calculateResult(partial, QUESTIONS)!;
    const byCat = Object.fromEntries(result.categories.map((c) => [c.category, c]));
    expect(byCat.sensory.average).toBe(100); // q1 好极，权重 3/3
    expect(byCat.body.average).toBe(33.3); // q2 坏(2) + q3 好(1) → 1/3
    expect(byCat.brain.average).toBe(0); // q4 坏极
  });

  it("分项明细带好极标记、权重与依据标签", () => {
    const result = calculateResult(partial, QUESTIONS)!;
    const q1 = result.items.find((i) => i.questionId === "q1")!;
    const q2 = result.items.find((i) => i.questionId === "q2")!;
    expect(q1.isGood).toBe(true);
    expect(q1.weight).toBe(3);
    expect(q1.rationaleLabel).toBe("健康/安全风险");
    expect(q2.isGood).toBe(false);
    expect(q2.selectedLabel).toBe("q2坏");
  });

  it("perfectProbability = 所有好极频率之积", () => {
    const result = calculateResult(allGood, QUESTIONS)!;
    expect(result.perfectProbability).toBeCloseTo(0.5 ** 4, 10);
    expect(formatOdds(result.perfectProbability)).toBe("16 分之一");
  });

  it("空题库返回 null，不抛异常", () => {
    expect(calculateResult({}, [])).toBeNull();
  });
});

describe("常模百分位（精确泊松二项 DP）", () => {
  it("分布总概率为 1，格点数 = 总权重+1", () => {
    const dist = scoreDistribution(QUESTIONS);
    expect(dist.length).toBe(8);
    const sum = Array.from(dist).reduce((a, b) => a + b, 0);
    expect(sum).toBeCloseTo(1, 10);
  });

  it("全好百分位 ≈ 100，全坏 ≈ 0，且随 raw 单调", () => {
    const dist = scoreDistribution(QUESTIONS);
    const pAll = percentileOf(7, dist);
    const pNone = percentileOf(0, dist);
    const pMid = percentileOf(4, dist);
    // 夹具频率全为 0.5：P(全好) = 1/16 → 全好百分位 = 100 − 0.5×6.25 = 96.875
    expect(pAll).toBeCloseTo(96.875, 6);
    expect(pNone).toBeCloseTo(3.125, 6); // 100 − 96.875，对称
    expect(pMid).toBeGreaterThan(pNone);
    expect(pAll).toBeGreaterThan(pMid);
  });

  it("对称频率（全 0.5）下中位 raw 的百分位 ≈ 50", () => {
    const dist = scoreDistribution(QUESTIONS);
    // 期望 raw = Σ w·g = 3.5，介于 3 与 4 之间，两者百分位应夹住 50
    expect(percentileOf(3, dist)).toBeLessThan(50);
    expect(percentileOf(4, dist)).toBeGreaterThan(50);
  });

  it("calculateResult 输出的 percentile 与手工 DP 一致", () => {
    const result = calculateResult(partial, QUESTIONS)!;
    const dist = scoreDistribution(QUESTIONS);
    expect(result.percentile).toBe(roundTo1(percentileOf(4, dist)));
  });
});

describe("称号阈值", () => {
  it("按校准后的区间命中正确称号（32 题版：E=61.5, σ=8.1）", () => {
    expect(getTitle(100).title).toBe("究极人类候选");
    expect(getTitle(99.9).title).toBe("高配多面手");
    expect(getTitle(73).title).toBe("高配多面手");
    expect(getTitle(72.9).title).toBe("标准高配");
    expect(getTitle(62).title).toBe("标准高配");
    expect(getTitle(61.9).title).toBe("特色配置型");
    expect(getTitle(51).title).toBe("特色配置型");
    expect(getTitle(50.9).title).toBe("极端偏科型");
    expect(getTitle(0).title).toBe("极端偏科型");
  });
});

describe("真实题库 sanity", () => {
  it("32 题、全好 = 100 且百分位 > 99.9", () => {
    expect(REAL_QUESTIONS.length).toBe(32);
    const answers: Answers = Object.fromEntries(
      REAL_QUESTIONS.map((q) => [q.id, q.goodOption]),
    );
    const result = calculateResult(answers, REAL_QUESTIONS)!;
    expect(result.totalScore).toBe(100);
    expect(result.percentile).toBeGreaterThan(99.9);
    expect(result.titleInfo.title).toBe("究极人类候选");
  });

  it("全坏极的完成度为 0，且模拟人群均值落在 55–70 区间（阈值校准前提）", () => {
    const answers: Answers = Object.fromEntries(
      REAL_QUESTIONS.map((q) => [q.id, (1 - q.goodOption) as 0 | 1]),
    );
    const result = calculateResult(answers, REAL_QUESTIONS)!;
    expect(result.totalScore).toBe(0);
    // 模拟人群期望完成度 = Σ w·g / Σ w × 100
    const totalW = totalWeight(REAL_QUESTIONS);
    const expected =
      (REAL_QUESTIONS.reduce((s, q) => s + weightOf(q) * q.goodFrequency, 0) /
        totalW) *
      100;
    expect(expected).toBeGreaterThan(55);
    expect(expected).toBeLessThan(70);
  });
});

describe("generateShareText", () => {
  it("默认隐私模式（scores）不包含任何选项文案", () => {
    const result = calculateResult(partial, QUESTIONS)!;
    const text = generateShareText(result, "scores");
    expect(text).toContain("57.1");
    expect(text).toContain("常模百分位");
    expect(text).not.toContain("q2坏"); // 不暴露具体选择
    expect(text).toContain("非医学诊断");
  });

  it("details 模式包含每题的好极/对照极与选项明细", () => {
    const result = calculateResult(partial, QUESTIONS)!;
    const text = generateShareText(result, "details");
    expect(text).toContain("题目q1：好极 ✓（q1好）");
    expect(text).toContain("题目q2：对照极（q2坏）");
  });
});
