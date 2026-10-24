import {
  CATEGORY_META,
  type Answers,
  type Category,
  type CategoryScore,
  type ItemScore,
  type QuizResult,
  type Question,
  type SharePrivacy,
  type TitleInfo,
} from "@/lib/types";

/**
 * 称号阈值。区间为 [min, 上一档 min)，含下界。
 *
 * ⚠️ 校准依据（28 题当前数据，10 万次均匀随机作答蒙特卡洛）：
 * 可达分数区间为 [77.5, 100]，随机作答均值 88.75、中位数 88.8。
 * 因此按随机分布分位数定档：≥95 ≈ 前 3%、≥91 ≈ 前 10%、≥87 ≈ 前 50%、≥83 覆盖大多数。
 * 若替换题目数据改变了分值分布，应重新校准，否则称号失去区分度
 * （旧版 90/85/80/75 阈值会让随机答题者 95% 获得“高配”以上称号）。
 */
export const TITLE_TIERS: { min: number; title: string; blurb: string }[] = [
  { min: 95, title: "究极人类候选", blurb: "在本评分体系下，你的功能覆盖面接近满配。" },
  { min: 91, title: "高配多面手", blurb: "多数通道都运转周全，偶有个性旋钮。" },
  { min: 87, title: "标准高配", blurb: "主流配置之上，稳定可靠。" },
  { min: 83, title: "特色配置型", blurb: "有几处鲜明的个性化设定。" },
  { min: 0, title: "极端偏科型", blurb: "点满了某些特色天赋树——偏科不是缺点，是风格。" },
];

/** 保留 1 位小数（避免浮点尾差，例如 84.95 → 85） */
export function roundTo1(value: number): number {
  return Math.round((value + Number.EPSILON) * 10) / 10;
}

/** 求平均；空数组返回 0，调用方保证有数据 */
function mean(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}

/** 根据总分取称号 */
export function getTitle(totalScore: number): TitleInfo {
  const tier =
    TITLE_TIERS.find((t) => totalScore >= t.min) ?? TITLE_TIERS[TITLE_TIERS.length - 1];
  return { title: tier.title, blurb: tier.blurb };
}

/** 是否所有题目都已作答（全部答完才能出结果） */
export function isComplete(answers: Answers, questions: Question[]): boolean {
  return questions.every((q) => answers[q.id] === 0 || answers[q.id] === 1);
}

/**
 * 核心评分函数（纯函数）：
 * - 总分 = 各题所选选项得分的算术平均，保留 1 位小数；
 * - 分类得分 = 该类别下各题得分的平均，保留 1 位小数；
 * - 若答题不完整，返回 null（结果页据此拦截）。
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
      score: option.score,
      explanation: q.explanation,
      sourceNote: q.sourceNote,
    };
  });

  const categories: CategoryScore[] = (
    Object.keys(CATEGORY_META) as Category[]
  )
    .map((category) => {
      const scores = items.filter((i) => i.category === category).map((i) => i.score);
      return {
        category,
        label: CATEGORY_META[category].label,
        average: roundTo1(mean(scores)),
        count: scores.length,
      };
    })
    .filter((c) => c.count > 0);

  const totalScore = roundTo1(mean(items.map((i) => i.score)));

  return {
    totalScore,
    titleInfo: getTitle(totalScore),
    categories,
    items,
    totalCount: items.length,
  };
}

/**
 * 生成可复制的分享文本。
 * 隐私优先：默认（privacy = "scores"）只公开各项得分，
 * 不暴露每道题选了哪个选项；"details" 才输出完整差异明细。
 */
export function generateShareText(result: QuizResult, privacy: SharePrivacy): string {
  const lines: string[] = [
    `我在「人类配置差异测评」拿到 ${result.totalScore} 分 —— ${result.titleInfo.title}！`,
    ...result.categories.map((c) => `${c.label}：${c.average} 分`),
  ];

  if (privacy === "details") {
    lines.push("—— 差异明细 ——");
    for (const item of result.items) {
      lines.push(`${item.title}（${item.score} 分）：${item.selectedLabel}`);
    }
  }

  lines.push("※ 科普/娱乐测评，非医学诊断。所有特质都是连续谱。");
  return lines.join("\n");
}
