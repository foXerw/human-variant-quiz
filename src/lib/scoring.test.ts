import { describe, expect, it } from "vitest";
import type { Answers, Question } from "@/lib/types";
import {
  calculateResult,
  generateShareText,
  getTitle,
  isComplete,
  roundTo1,
} from "./scoring";

/** 测试专用夹具：与真实题目结构一致，但分数为整数便于断言 */
const QUESTIONS: Question[] = [
  {
    id: "q1",
    category: "sensory",
    title: "香菜反应",
    question: "吃香菜你尝到什么？",
    options: [
      { label: "香", score: 100 },
      { label: "肥皂味", score: 90 },
    ],
    explanation: "OR6A2 变体。",
  },
  {
    id: "q2",
    category: "body",
    title: "喝酒脸红",
    question: "喝酒后？",
    options: [
      { label: "不变色", score: 100 },
      { label: "上脸", score: 70 },
    ],
    explanation: "ALDH2 变体。",
  },
  {
    id: "q3",
    category: "body",
    title: "晕 3D",
    question: "玩 3D 游戏？",
    options: [
      { label: "无压力", score: 100 },
      { label: "头晕", score: 80 },
    ],
    explanation: "感觉冲突。",
  },
  {
    id: "q4",
    category: "brain",
    title: "脑中的画面",
    question: "想象苹果？",
    options: [
      { label: "看到了", score: 100 },
      { label: "一片黑", score: 85 },
    ],
    explanation: "心象谱系。",
  },
];

const allFirst: Answers = { q1: 0, q2: 0, q3: 0, q4: 0 };
const mixed: Answers = { q1: 1, q2: 1, q3: 0, q4: 1 }; // 90, 70, 100, 85

describe("roundTo1", () => {
  it("保留 1 位小数且不产生浮点尾差", () => {
    expect(roundTo1(84.95)).toBe(85);
    expect(roundTo1(0.1 + 0.2)).toBe(0.3);
    expect(roundTo1(76.6666666)).toBe(76.7);
  });
});

describe("isComplete", () => {
  it("缺任何一题都算未完成", () => {
    expect(isComplete({ q1: 0, q2: 1, q3: 0 }, QUESTIONS)).toBe(false);
    expect(isComplete(mixed, QUESTIONS)).toBe(true);
  });
});

describe("calculateResult", () => {
  it("全部答完时：总分 = N 项得分的算术平均（1 位小数）", () => {
    const result = calculateResult(mixed, QUESTIONS);
    expect(result).not.toBeNull();
    // (90 + 70 + 100 + 85) / 4 = 86.25 → 86.3
    expect(result!.totalScore).toBe(86.3);
    expect(result!.totalCount).toBe(4);
  });

  it("满分答案 → 100 分 + 究极人类候选", () => {
    const result = calculateResult(allFirst, QUESTIONS);
    expect(result!.totalScore).toBe(100);
    expect(result!.titleInfo.title).toBe("究极人类候选");
  });

  it("答题不完整时返回 null（全部答完才能出结果）", () => {
    expect(calculateResult({ q1: 0, q2: 1 }, QUESTIONS)).toBeNull();
    expect(calculateResult({}, QUESTIONS)).toBeNull();
  });

  it("分类得分 = 该类别下各项平均分", () => {
    const result = calculateResult(mixed, QUESTIONS)!;
    const byCat = Object.fromEntries(result.categories.map((c) => [c.category, c]));
    expect(byCat.sensory.average).toBe(90); // 只有 q1
    expect(byCat.body.average).toBe(85); // (70 + 100) / 2
    expect(byCat.brain.average).toBe(85); // 只有 q4
    expect(byCat.body.count).toBe(2);
  });

  it("分项明细记录所选选项的 label 与 score", () => {
    const result = calculateResult(mixed, QUESTIONS)!;
    const q2 = result.items.find((i) => i.questionId === "q2")!;
    expect(q2.score).toBe(70);
    expect(q2.selectedLabel).toBe("上脸");
  });

  it("空题库返回 null，不抛异常", () => {
    expect(calculateResult({}, [])).toBeNull();
  });
});

describe("称号阈值", () => {
  it("按区间命中正确称号", () => {
    expect(getTitle(90).title).toBe("究极人类候选");
    expect(getTitle(85).title).toBe("高配多面手");
    expect(getTitle(80).title).toBe("标准高配");
    expect(getTitle(75).title).toBe("特色配置型");
    expect(getTitle(74.9).title).toBe("极端偏科型");
    expect(getTitle(0).title).toBe("极端偏科型");
  });
});

describe("generateShareText", () => {
  it("默认隐私模式（scores）不包含任何选项文案", () => {
    const result = calculateResult(mixed, QUESTIONS)!;
    const text = generateShareText(result, "scores");
    expect(text).toContain("86.3");
    expect(text).toContain("高配多面手");
    expect(text).toContain("身体与自主神经");
    expect(text).not.toContain("上脸"); // 不暴露具体选择
    expect(text).toContain("非医学诊断");
  });

  it("details 模式包含题目与选择的完整明细", () => {
    const result = calculateResult(mixed, QUESTIONS)!;
    const text = generateShareText(result, "details");
    expect(text).toContain("喝酒脸红（70 分）：上脸");
  });
});
