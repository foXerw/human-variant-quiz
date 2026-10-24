import type { Question } from "@/lib/types";

/**
 * 占位题目数据（5 条，覆盖全部三个类别）。
 *
 * 后续扩充到 27 项时：只需往这个数组里追加对象，
 * 评分函数、答题页、结果页、分享文本全部自动适配，无需改动 UI。
 *
 * 评分口径（0-100）：
 * - 高分 ≈ 在本体系下“现代功能覆盖更好 / 健康风险更低 / 感觉运动处理更完整”；
 * - 对中性神经多样性（ASMR、联觉、心盲症等）两个选项给出接近的分值，
 *   避免把差异写成“缺陷”；
 * - 每题两个选项的分数都不要求相加为 100。
 */
export const QUESTIONS: Question[] = [
  {
    id: "cilantro",
    category: "sensory",
    title: "香菜反应",
    question: "吃香菜的时候，你尝到的是什么？",
    options: [
      {
        label: "香的！香菜是灵魂配料",
        score: 100,
        note: "对醛类气味无明显负面联想",
      },
      {
        label: "一股肥皂 / 金属味",
        score: 90,
        note: "OR6A2 嗅觉受体变体的常见体验，不是病",
      },
    ],
    explanation:
      "约 4%–14% 的人携带 OR6A2 等嗅觉受体基因变体，会把香菜中的醛类分子感知成肥皂味。这是典型的正常感官差异，与营养或健康优劣无关。",
    sourceNote: "占位参考：OR6A2 与香菜气味感知的人群遗传变体研究",
  },
  {
    id: "asmr",
    category: "sensory",
    title: "ASMR 触发",
    question: "听到耳语、翻书、指甲轻敲桌面这类声音时，你会？",
    options: [
      {
        label: "有“酥麻感”从头皮蔓延到后背",
        score: 100,
        note: "感觉通道间存在较强联结反应",
      },
      {
        label: "什么特别的感觉都没有，甚至有点吵",
        score: 92,
        note: "对 ASMR 不敏感在人群中同样常见",
      },
    ],
    explanation:
      "ASMR（自发性知觉经络反应）是一种中性知觉特质，约 50%–80% 的人报告有体验。敏感与否都落在正常谱系上，本体系只把“可稳定触发的知觉体验”记作更完整的感觉处理。",
    sourceNote: "占位参考：ASMR 流行率与知觉特质研究",
  },
  {
    id: "alcohol-flush",
    category: "body",
    title: "喝酒脸红",
    question: "喝酒之后，身体的典型反应是？",
    options: [
      {
        label: "千杯不变色，代谢毫无存在感",
        score: 100,
        note: "乙醛脱氢酶活性完整",
      },
      {
        label: "一小杯就上脸、心跳加快",
        score: 70,
        note: "ALDH2 变体导致乙醛蓄积，这是身体在报警",
      },
    ],
    explanation:
      "喝酒脸红常与 ALDH2 基因变体有关，乙醛清除较慢。乙醛是明确的致癌物，因此“上脸”在本体系中被记作更高的健康风险提示（也是身体给你的止损信号），而不是酒量勋章。",
    sourceNote: "占位参考：ALDH2*2 变体与乙醛代谢、食管癌风险研究",
  },
  {
    id: "sim-sickness",
    category: "body",
    title: "晕 3D / 晕模拟",
    question: "玩第一人称 3D 游戏、坐过山车或看 IMAX 时，你会？",
    options: [
      {
        label: "毫无压力，视觉和前庭配合良好",
        score: 100,
        note: "视觉-前庭重加权能力较强",
      },
      {
        label: "容易头晕、恶心，得退出休息",
        score: 82,
        note: "模拟器病（vection）体验，可通过训练改善",
      },
    ],
    explanation:
      "当眼睛报告“在运动”而前庭报告“没动”时，感觉冲突会引发晕动症状。对冲突更敏感不是缺陷，只是加权策略不同，且多数人可以逐步脱敏。",
    sourceNote: "占位参考：感觉冲突理论（Reason & Brand）与晕动症研究",
  },
  {
    id: "mental-imagery",
    category: "brain",
    title: "脑中的画面",
    question: "闭上眼，想象一只红苹果——你“看”到了吗？",
    options: [
      {
        label: "看到了，清楚得几乎能数清籽",
        score: 100,
        note: "心象生动（phantasia 端）",
      },
      {
        label: "基本是一片黑，只有“概念”没有画面",
        score: 88,
        note: "心盲症（aphantasia）端，正常谱系的一部分",
      },
    ],
    explanation:
      "心象生动性是一个连续谱：从极其鲜明到完全空白都存在，约 1%–3% 的人自称心盲。“没有画面”不影响记忆与推理能力，只是表象通道的差异。本体系仅把可视化通道的可用性记作得分。",
    sourceNote: "占位参考：Keiji Tanaka 团队对 aphantasia/phantasia 谱系的研究",
  },
];

/** 题目总数（评分表满分项数 N） */
export const QUESTION_COUNT = QUESTIONS.length;
