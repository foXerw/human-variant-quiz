import type { Question } from "@/types/quiz";

/**
 * 题目数据（28 条：感官与知觉 12 / 身体与自主神经 12 / 大脑与心理 4）。
 * 数据与 UI 解耦：增删题目只需改这个数组。
 */
export const questions: Question[] = [
  // ===== 一、感官与知觉 =====
  {
    id: "motion_sickness_3d",
    category: "sensory",
    title: "晕3D",
    question: "你玩3D游戏或VR时是否容易晕？",
    options: [
      { label: "不晕3D", score: 100 },
      { label: "会晕3D", score: 60 },
    ],
    explanation:
      "本评分将不晕视为虚拟环境适应更好；晕3D者在真实运动警觉上可能另有优势，不代表生理更差。",
    sourceNote: "晕动症谱系差异，二选一只是连续谱的简化。",
  },
  {
    id: "cilantro",
    category: "sensory",
    title: "香菜",
    question: "你吃香菜时是否尝到明显的肥皂味或臭虫味？",
    options: [
      { label: "尝不出肥皂/臭虫味", score: 100 },
      { label: "尝得出肥皂/臭虫味", score: 75 },
    ],
    explanation: "这与 OR6A2 等嗅觉受体基因相关，属于中性差异，无健康优劣。",
    sourceNote: "全球约15%的人讨厌香菜，部分欧亚人群可达21%。",
  },
  {
    id: "asmr",
    category: "sensory",
    title: "ASMR",
    question: "听到轻声细语、敲击声时，你能否体验到从头皮到后颈的愉悦刺麻感？",
    options: [
      { label: "能体验到刺麻感", score: 100 },
      { label: "完全无感", score: 85 },
    ],
    explanation: "ASMR 敏感者比例约20%–39.4%，属于中性神经差异，按感觉覆盖给分。",
    sourceNote: "能体验者在经验开放性人格特质上得分通常更高。",
  },
  {
    id: "synesthesia",
    category: "sensory",
    title: "联觉",
    question: "你是否会在一种感官刺激下自动触发另一种感官体验，比如看见声音的颜色、尝到文字的味道？",
    options: [
      { label: "有某种联觉", score: 100 },
      { label: "没有", score: 85 },
    ],
    explanation: "约4.4%的人具有某种形式的联觉，女性联觉者约为男性的五倍，这不是疾病。",
    sourceNote: "中性神经多样性。",
  },
  {
    id: "photic_sneeze",
    category: "sensory",
    title: "光喷嚏反射",
    question: "从暗处进入强光时，你是否会忍不住打喷嚏？",
    options: [
      { label: "会打喷嚏", score: 100 },
      { label: "不会", score: 95 },
    ],
    explanation:
      "这是常染色体显性遗传光喷嚏反射（ACHOO），约10%–35%的人有，属于中性反射差异。",
    sourceNote: "父母一方有该反射，孩子约有一半概率也会如此。",
  },
  {
    id: "bitter_taste",
    category: "sensory",
    title: "苦味",
    question: "你是否对苦味特别敏感，常觉得某些蔬菜很苦？",
    options: [
      { label: "超级品尝者", score: 100 },
      { label: "中等品尝者/味盲", score: 85 },
    ],
    explanation: "TAS2R38 基因影响苦味敏感度，约25%的人是超级品尝者；敏感可能影响蔬菜摄入。",
    sourceNote: "中性偏功能覆盖差异。",
  },
  {
    id: "misophonia",
    category: "sensory",
    title: "恐音症",
    question: "别人咀嚼、吧唧嘴或敲笔的声音，是否会让你产生明显的愤怒或厌恶？",
    options: [
      { label: "基本无感", score: 100 },
      { label: "明显炸毛", score: 60 },
    ],
    explanation:
      "恐音症影响约5%–20%的普通人群，与情绪和感官处理网络过度活跃有关，会带来实际情绪困扰。",
    sourceNote: "本评分中“基本无感”得分更高。",
  },
  {
    id: "absolute_pitch",
    category: "sensory",
    title: "绝对音感",
    question: "没有参照音时，你能否准确识别或唱出某个音高？",
    options: [
      { label: "有绝对音感", score: 100 },
      { label: "没有", score: 80 },
    ],
    explanation:
      "普通人群中约万分之一；在自闭症谱系人群和早期失明者中比例更高，属于稀有听觉能力。",
    sourceNote: "中性偏能力覆盖。",
  },
  {
    id: "aphantasia",
    category: "sensory",
    title: "心盲症",
    question: "闭眼时，你能否在脑海中“看见”一个苹果的颜色和形状？",
    options: [
      { label: "能脑内看见画面", score: 100 },
      { label: "一片漆黑", score: 75 },
    ],
    explanation: "心盲症估计约1%–4%，是心理意象差异，不是疾病，但心理意象功能受限。",
    sourceNote: "中性神经差异。",
  },
  {
    id: "pareidolia",
    category: "sensory",
    title: "面孔幻想性错觉",
    question: "你是否容易在云朵、插座、吐司等物体上“看到”人脸？",
    options: [
      { label: "容易看到脸", score: 100 },
      { label: "不容易", score: 85 },
    ],
    explanation: "这反映面孔检测系统的基线激活阈值差异，属于常见中性现象。",
  },
  {
    id: "sweet_fat_sensitivity",
    category: "sensory",
    title: "甜味/脂肪敏感",
    question: "你是否对甜味或油腻口感特别敏感？",
    options: [
      { label: "特别敏感", score: 100 },
      { label: "吃啥都差不多", score: 85 },
    ],
    explanation: "TAS1R3、CD36 等差异影响甜味和脂肪口感敏感度；敏感也可能让人更偏好高糖脂食物。",
    sourceNote: "中性味觉带宽差异。",
  },
  {
    id: "menthol_cooling",
    category: "sensory",
    title: "薄荷凉感",
    question: "你吃薄荷或使用薄荷产品时，凉感是否很强？",
    options: [
      { label: "凉感很强", score: 100 },
      { label: "几乎没凉感", score: 80 },
    ],
    explanation: "TRPM8 受体功能覆盖存在个体差异，属于中性感觉差异。",
  },

  // ===== 二、身体与自主神经 =====
  {
    id: "earworm",
    category: "body",
    title: "耳虫",
    question: "你每周是否都会出现脑子里单曲循环（耳虫）？",
    options: [
      { label: "每周都有耳虫", score: 100 },
      { label: "几乎没耳虫", score: 85 },
    ],
    explanation: "超过90%的人每周至少经历一次耳虫，频率和困扰程度存在个体差异。",
    sourceNote: "常见中性现象，频繁也可能带来困扰。",
  },
  {
    id: "chronotype",
    category: "body",
    title: "睡眠时型",
    question: "你的睡眠时型更接近哪一类？",
    options: [
      { label: "明确早鸟或夜猫子", score: 100 },
      { label: "中间型", score: 95 },
    ],
    explanation: "极端早鸟和夜猫子各约15%–27%，中间型占多数；节律清晰和适应弹性各有价值。",
    sourceNote: "本评分对明确节律略高。",
  },
  {
    id: "pain_tolerance",
    category: "body",
    title: "疼痛耐受",
    question: "你对疼痛的耐受度更接近？",
    options: [
      { label: "高耐受", score: 100 },
      { label: "低耐受", score: 70 },
    ],
    explanation: "基因因素可解释约49%的疼痛耐受差异；低耐受不是病，但功能受限更明显。",
  },
  {
    id: "alcohol_flush",
    category: "body",
    title: "酒精脸红",
    question: "喝酒后你是否容易脸红？",
    options: [
      { label: "不脸红", score: 100 },
      { label: "一杯就上脸", score: 70 },
    ],
    explanation: "ALDH2 基因突变在东亚人群中约30%–50%，乙醛堆积与食管癌风险相关。",
    sourceNote: "本评分中不脸红得分更高，主要基于风险维度。",
  },
  {
    id: "lactose_tolerance",
    category: "body",
    title: "乳糖耐受",
    question: "成年后喝奶是否会腹胀、腹泻？",
    options: [
      { label: "成年后能正常喝奶", score: 100 },
      { label: "乳糖不耐", score: 80 },
    ],
    explanation: "全球约68%的人存在乳糖吸收不良，东亚人群可达70%–100%；不是病，但饮食限制明显。",
  },
  {
    id: "earwax_body_odor",
    category: "body",
    title: "耳垢/体味",
    question: "你的耳垢类型和体味更接近？",
    options: [
      { label: "干耳垢、体味轻", score: 100 },
      { label: "湿耳垢、体味重", score: 85 },
    ],
    explanation: "ABCC11 基因同时影响耳垢类型和大汗腺分泌；体味重有社交成本。",
  },
  {
    id: "hydrogen_cyanide_smell",
    category: "body",
    title: "氢氰酸气味",
    question: "你能否闻到氢氰酸（苦杏仁味）的气味？",
    options: [
      { label: "能闻到", score: 100 },
      { label: "闻不到", score: 70 },
    ],
    explanation: "约每10人中有1人闻不到氢氰酸气味；闻不到有毒气体气味是安全风险。",
  },
  {
    id: "vasovagal_syncope",
    category: "body",
    title: "血管迷走性晕厥",
    question: "你是否在见血、疼痛或久站时容易晕倒？",
    options: [
      { label: "从未晕倒", score: 100 },
      { label: "见血/久站会晕", score: 65 },
    ],
    explanation: "普通人群终生发生率约22%；晕厥有跌倒和受伤风险。",
  },
  {
    id: "sleep_paralysis",
    category: "body",
    title: "睡眠瘫痪",
    question: "你是否经历过“鬼压床”，即意识清醒但身体不能动？",
    options: [
      { label: "从未有过", score: 100 },
      { label: "有过", score: 75 },
    ],
    explanation: "普通人群终生患病率约7.6%，学生群体约28%；发作会带来恐惧和睡眠困扰。",
  },
  {
    id: "caffeine_sensitivity",
    category: "body",
    title: "咖啡因",
    question: "下午喝咖啡是否明显影响你当晚睡眠？",
    options: [
      { label: "下午咖啡不影响睡眠", score: 100 },
      { label: "一杯睁眼到天亮", score: 70 },
    ],
    explanation: "CYP1A2 快/慢代谢差异明显；慢代谢者咖啡因更易影响睡眠和心率。",
  },
  {
    id: "chili_tolerance",
    category: "body",
    title: "辣椒耐受",
    question: "你对辣椒的耐受度更接近？",
    options: [
      { label: "高耐受", score: 100 },
      { label: "微辣就冒汗", score: 85 },
    ],
    explanation: "TRPV1 受体敏感度和习惯化存在差异；高耐受也可能伴随胃刺激。",
    sourceNote: "中性偏习惯化差异。",
  },
  {
    id: "sunburn_tendency",
    category: "body",
    title: "晒伤倾向",
    question: "你晒太阳后更容易出现哪种情况？",
    options: [
      { label: "晒黑快、不易红", score: 100 },
      { label: "晒十分钟就红", score: 65 },
    ],
    explanation: "MC1R 等基因影响晒伤倾向；易晒伤与皮肤癌风险相关。",
  },

  // ===== 三、大脑与心理 =====
  {
    id: "prosopagnosia",
    category: "brain",
    title: "脸盲",
    question: "你是否天生很难记住或识别面孔？",
    options: [
      { label: "不是脸盲", score: 100 },
      { label: "天生面孔识别困难", score: 70 },
    ],
    explanation: "发展性脸盲约2.5%，会影响社交识别，不是“不认真记人”。",
  },
  {
    id: "sense_of_direction",
    category: "brain",
    title: "方向感",
    question: "你的方向感更接近？",
    options: [
      { label: "方向感强", score: 100 },
      { label: "重度路痴", score: 70 },
    ],
    explanation: "空间导航策略存在个体差异；重度路痴的功能受限更明显。",
  },
  {
    id: "motion_sickness_spectrum",
    category: "brain",
    title: "运动晕动症谱系",
    question: "你对晕车、晕船、晕机、晕VR/3D的总体情况是？",
    options: [
      { label: "全不晕", score: 100 },
      { label: "至少一种会晕", score: 80 },
    ],
    explanation: "晕动症是一家族；至少一种晕在现代虚拟/运动环境适应成本更高。",
    sourceNote: "若多种都晕，可在结果解释中提示可再降至60分。",
  },
  {
    id: "tea_caffeine_sensitivity",
    category: "brain",
    title: "咖啡因与茶敏感",
    question: "喝了含咖啡因的茶或饮料，你是否容易心跳加速、明显烦躁甚至短暂耳鸣？",
    options: [
      {
        label: "代谢快，几乎无不适",
        score: 100,
      },
      {
        label: "敏感，心悸/烦躁/耳鸣",
        score: 85,
      },
    ],
    explanation:
      "CYP1A2与ADORA2A基因影响咖啡因代谢与受体敏感性，部分人饮用茶或咖啡后易出现焦虑样反应。",
    sourceNote: "基因差异导致敏感程度不同，无优劣之分。",
  },
];

/** 兼容组件层的大写导出（同一数据源） */
export const QUESTIONS = questions;

/** 题目总数（评分表满分项数 N） */
export const QUESTION_COUNT = questions.length;
