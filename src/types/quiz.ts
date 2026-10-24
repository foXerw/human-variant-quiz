/**
 * 核心类型定义 —— 题目数据与 UI 解耦的唯一契约。
 * 替换/扩充题目时只需要修改 src/data/questions.ts，UI 不需要改动。
 */

export type Category = "sensory" | "body" | "brain";

/** 类别的展示顺序与中文标签（与 UI、图表共用） */
export const CATEGORY_META: Record<Category, { label: string; description: string }> = {
  sensory: {
    label: "感官与知觉",
    description: "味觉、嗅觉、听觉等感觉通道的个体差异",
  },
  body: {
    label: "身体与自主神经",
    description: "代谢、前庭、自主神经反应等身体层面的差异",
  },
  brain: {
    label: "大脑与心理",
    description: "心象、联想、知觉组织等认知层面的差异",
  },
};

export interface Option {
  /** 选项文案，例如 “吃香菜像吃肥皂” */
  label: string;
  /** 0-100。在本评分体系中该选项对应的“现代功能覆盖/风险/处理完整度”得分 */
  score: number;
  /** 对该选项的一句话中性说明（可选） */
  note?: string;
}

export interface Question {
  /** 唯一 id，用作 localStorage 的 key，请勿复用 */
  id: string;
  category: Category;
  /** 题目标题，例如 “香菜反应” */
  title: string;
  /** 题干 */
  question: string;
  options: [Option, Option];
  /** 结果页/答题页展示的科学解释 */
  explanation: string;
  /** 数据来源备注（占位可用） */
  sourceNote?: string;
}

/** 答案表：questionId -> 所选选项下标（0 或 1） */
export type Answers = Record<string, 0 | 1>;

/** 单个题目的得分明细 */
export interface ItemScore {
  questionId: string;
  title: string;
  category: Category;
  question: string;
  selectedLabel: string;
  selectedNote?: string;
  score: number;
  explanation: string;
  sourceNote?: string;
}

/** 分类平均分 */
export interface CategoryScore {
  category: Category;
  label: string;
  average: number;
  count: number;
}

/** 称号 */
export interface TitleInfo {
  title: string;
  blurb: string;
}

/** calculateResult 的输出 */
export interface QuizResult {
  /** 总分（N 项得分算术平均，保留 1 位小数） */
  totalScore: number;
  titleInfo: TitleInfo;
  categories: CategoryScore[];
  items: ItemScore[];
  totalCount: number;
}

/**
 * 分享文本的隐私级别。
 * - "scores"（默认）：只公开各项得分，不暴露具体选了哪个选项。
 * - "details"：公开题目 + 选择 + 得分的完整差异明细。
 */
export type SharePrivacy = "scores" | "details";
