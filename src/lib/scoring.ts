import {
  CATEGORY_META,
  type Answers,
  type Category,
  type CategoryScore,
  type ItemScore,
  type QuizResult,
  type Question,
  type Rationale,
  type SharePrivacy,
  type TitleInfo,
} from "@/lib/types";

/**
 * 评分框架 v2（常模参照）核心。
 *
 * 设计原则：方向与程度分离——
 * - “哪一极是好”是显式价值宣言（每题 goodOption，一次一元表态）；
 * - “好值多少”由两个客观量决定：rationale 层级权重 + 好极人群频率；
 * - 不再存在逐题手填的分数。
 */

/** 依据层级 → 权重（词典序优先级：risk > function > bandwidth > neutral） */
export const RATIONALE_WEIGHTS: Record<Rationale, number> = {
  risk: 3,
  function: 2,
  bandwidth: 1,
  neutral: 1,
};

/** 依据层级 → 中文标签（结果页徽章用） */
export const RATIONALE_LABELS: Record<Rationale, string> = {
  risk: "健康/安全风险",
  function: "现代功能适应",
  bandwidth: "感知带宽",
  neutral: "中性/趣味宣言",
};

/**
 * 称号阈值（挂在配置完成度上，区间 [min, 上一档 min)）。
 *
 * ⚠️ 校准依据（当前 26 题数据，精确泊松二项 DP）：
 * 模拟人群完成度均值 ≈ 60.0，标准差 ≈ 9.2；
 * 75 ≈ 前 6%，61 ≈ 中位数（前 50%），47 ≈ 前 93%（垫底 7.5% 为极端偏科型）。
 * 100 分只有“全部好极”可达（概率 ≈ 103 亿分之一），即字面意义的究极人类。
 * 更换题库后必须重新校准（见 README）。
 */
export const TITLE_TIERS: { min: number; title: string; blurb: string }[] = [
  {
    min: 100,
    title: "究极人类候选",
    blurb: "全部题目都落在好极——统计上近乎不存在的天选配置。",
  },
  { min: 75, title: "高配多面手", blurb: "绝大多数通道都站在好极一侧。" },
  { min: 61, title: "标准高配", blurb: "高于模拟人群均值，主流配置之上。" },
  { min: 47, title: "特色配置型", blurb: "有好几处鲜明的个性化设定。" },
  { min: 0, title: "极端偏科型", blurb: "点满了特色天赋树——偏科不是缺点，是风格。" },
];

/** 每题权重（由 rationale 唯一决定） */
export function weightOf(q: Question): number {
  return RATIONALE_WEIGHTS[q.rationale];
}

/** 保留 1 位小数（避免浮点尾差） */
export function roundTo1(value: number): number {
  return Math.round((value + Number.EPSILON) * 10) / 10;
}

/** 根据完成度取称号 */
export function getTitle(totalScore: number): TitleInfo {
  const tier =
    TITLE_TIERS.find((t) => totalScore >= t.min) ?? TITLE_TIERS[TITLE_TIERS.length - 1];
  return { title: tier.title, blurb: tier.blurb };
}

/** 是否所有题目都已作答（全部答完才能出结果） */
export function isComplete(answers: Answers, questions: Question[]): boolean {
  return questions.every((q) => answers[q.id] === 0 || answers[q.id] === 1);
}

/** 题库总权重 */
export function totalWeight(questions: Question[]): number {
  return questions.reduce((s, q) => s + weightOf(q), 0);
}

/**
 * 精确计算“模拟人群”的加权得分分布（泊松二项 DP，非蒙特卡洛）。
 * 返回长度为 totalWeight+1 的数组，dist[s] = 加权好极数恰好为 s 的概率。
 * 权重均为正整数，故 DP 在整数格点上是精确的。
 */
export function scoreDistribution(questions: Question[]): Float64Array {
  const total = totalWeight(questions);
  let dp = new Float64Array(total + 1);
  dp[0] = 1;
  let max = 0;
  for (const q of questions) {
    const w = weightOf(q);
    const g = Math.min(Math.max(q.goodFrequency, 0), 1);
    const next = new Float64Array(total + 1);
    for (let s = 0; s <= max; s++) {
      const p = dp[s];
      if (p === 0) continue;
      next[s] += p * (1 - g);
      next[s + w] += p * g;
    }
    dp = next;
    max += w;
  }
  return dp;
}

/**
 * 常模百分位：超过百分之多少的模拟人类。
 * 采用中位秩约定：P(X < raw) + 0.5·P(X = raw)。
 */
export function percentileOf(raw: number, dist: Float64Array): number {
  let below = 0;
  for (let s = 0; s < raw && s < dist.length; s++) below += dist[s];
  const equal = raw < dist.length ? dist[raw] : 0;
  return (below + 0.5 * equal) * 100;
}

/**
 * 核心评分函数（纯函数）：
 * - 配置完成度 = Σ(权重 × 是否好极) / Σ权重 × 100，保留 1 位小数；全好 = 恰好 100；
 * - 常模百分位 = 精确 DP 分布下的中位秩百分位；
 * - 分类得分 = 该类别加权完成度；
 * - 答题不完整时返回 null（结果页据此拦截）。
 */
export function calculateResult(
  answers: Answers,
  questions: Question[],
): QuizResult | null {
  if (questions.length === 0) return null;
  if (!isComplete(answers, questions)) return null;

  const items: ItemScore[] = questions.map((q) => {
    const choice = answers[q.id];
    const option = q.options[choice];
    return {
      questionId: q.id,
      title: q.title,
      category: q.category,
      question: q.question,
      selectedLabel: option.label,
      selectedNote: option.note,
      isGood: choice === q.goodOption,
      weight: weightOf(q),
      rationale: q.rationale,
      rationaleLabel: RATIONALE_LABELS[q.rationale],
      goodFrequency: q.goodFrequency,
      explanation: q.explanation,
      sourceNote: q.sourceNote,
    };
  });

  const totalW = totalWeight(questions);
  const raw = items.reduce((s, i) => s + (i.isGood ? i.weight : 0), 0);
  const totalScore = roundTo1((raw / totalW) * 100);

  const categories: CategoryScore[] = (Object.keys(CATEGORY_META) as Category[])
    .map((category) => {
      const catItems = items.filter((i) => i.category === category);
      const catW = catItems.reduce((s, i) => s + i.weight, 0);
      const catRaw = catItems.reduce((s, i) => s + (i.isGood ? i.weight : 0), 0);
      return {
        category,
        label: CATEGORY_META[category].label,
        average: catW > 0 ? roundTo1((catRaw / catW) * 100) : 0,
        count: catItems.length,
      };
    })
    .filter((c) => c.count > 0);

  const dist = scoreDistribution(questions);
  const percentile = roundTo1(percentileOf(raw, dist));
  const perfectProbability = questions.reduce((p, q) => p * q.goodFrequency, 1);

  return {
    totalScore,
    percentile,
    perfectProbability,
    titleInfo: getTitle(totalScore),
    categories,
    items,
    totalCount: items.length,
  };
}

/** 把极小概率格式化为“X 分之一”的可读文本 */
export function formatOdds(probability: number): string {
  if (probability <= 0) return "不可能";
  const inv = 1 / probability;
  if (inv >= 1e8) return `${Math.round(inv / 1e8)} 亿分之一`;
  if (inv >= 1e4) return `${Math.round(inv / 1e4)} 万分之一`;
  return `${Math.round(inv)} 分之一`;
}

/**
 * 生成可复制的分享文本。
 * 隐私优先：默认（privacy = "scores"）只公开完成度、百分位与分类得分，
 * 不暴露每题选择；"details" 才输出完整差异明细。
 */
export function generateShareText(result: QuizResult, privacy: SharePrivacy): string {
  const lines: string[] = [
    `我在「人类配置差异测评」的配置完成度 ${result.totalScore} 分 —— ${result.titleInfo.title}！`,
    `常模百分位：超过 ${result.percentile}% 的模拟人类`,
    ...result.categories.map((c) => `${c.label}：${c.average}`),
  ];

  if (privacy === "details") {
    lines.push("—— 差异明细 ——");
    for (const item of result.items) {
      lines.push(
        `${item.title}：${item.isGood ? "好极 ✓" : "对照极"}（${item.selectedLabel}）`,
      );
    }
  }

  lines.push("※ 科普/娱乐测评，非医学诊断。“好极”为显式价值宣言，所有特质都是连续谱。");
  return lines.join("\n");
}
