/**
 * 核心类型定义 —— 题目数据与 UI 解耦的唯一契约。
 *
 * 评分框架 v2（常模参照）：
 * - 每题声明唯一"好极"（goodOption）与好极人群频率（goodFrequency）；
 * - 分值大小不再手填：由 rationale 层级决定权重（风险 3 / 功能 2 / 带宽 1 / 中性 1）；
 * - 总分 = 加权完成度（全部好极 = 恰好 100）；
 * - 另输出精确常模百分位（加权泊松二项 DP）。
 */

export type Category = "sensory" | "body" | "brain";

/**
 * 每题"好极"声明的依据层级（词典序优先级：risk > function > bandwidth > neutral）。
 * - risk：有流行病学/安全证据的风险差异
 * - function：现代环境中的功能适应差异
 * - bandwidth：感知/认知带宽差异（增益性，非损失性）
 * - neutral：无客观差异，好极宣言属趣味/文化性质
 */
export type Rationale = "risk" | "function" | "bandwidth" | "neutral";

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
  /** 价值宣言：哪一极是“好极”（0 或 1） */
  goodOption: 0 | 1;
  /**
   * 好极在参照人群中的比例（0–1，全球粗估，用于常模百分位计算）。
   * 逐题依据见 sourceNote。
   */
  goodFrequency: number;
  /** 好极宣言的依据层级，决定该题权重 */
  rationale: Rationale;
  /** 结果页/答题页展示的科学解释 */
  explanation: string;
  /** 数据来源备注（占位可用） */
  sourceNote?: string;
}

/** 答案表：questionId -> 所选选项下标（0 或 1） */
export type Answers = Record<string, 0 | 1>;

/** 单个题目的结果明细 */
export interface ItemScore {
  questionId: string;
  title: string;
  category: Category;
  question: string;
  selectedLabel: string;
  selectedNote?: string;
  /** 是否落在好极 */
  isGood: boolean;
  /** 该题权重（由 rationale 决定） */
  weight: number;
  rationale: Rationale;
  /** rationale 的中文标签 */
  rationaleLabel: string;
  /** 好极人群频率 */
  goodFrequency: number;
  explanation: string;
  sourceNote?: string;
}

/** 分类得分（加权完成度） */
export interface CategoryScore {
  category: Category;
  label: string;
  /** 该类别加权完成度（0–100） */
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
  /** 配置完成度（加权好极占比 × 100，保留 1 位小数；全部好极 = 100） */
  totalScore: number;
  /** 常模百分位：超过百分之多少的“模拟人类”（精确 DP，非蒙特卡洛） */
  percentile: number;
  /** 随机出现全部好极配置的概率（Π goodFrequency） */
  perfectProbability: number;
  titleInfo: TitleInfo;
  categories: CategoryScore[];
  items: ItemScore[];
  totalCount: number;
}

/**
 * 分享文本的隐私级别。
 * - "scores"（默认）：只公开得分与百分位，不暴露具体选了哪个选项。
 * - "details"：公开题目 + 选择 + 好极/对照极的完整差异明细。
 */
export type SharePrivacy = "scores" | "details";
