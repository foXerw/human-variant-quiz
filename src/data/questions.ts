import type { Question } from "@/types/quiz";

/**
 * 题目数据 v2（26 条：感官与知觉 11 / 身体与自主神经 11 / 大脑与心理 4）。
 *
 * 评分框架 v2（常模参照）：
 * - 每题声明 goodOption（好极）+ goodFrequency（好极人群频率，全球粗估）+ rationale（依据层级）。
 * - 权重由 rationale 决定：risk=3 / function=2 / bandwidth=1 / neutral=1（见 lib/scoring.ts）。
 * - 好极频率用于精确常模百分位（泊松二项 DP），不参与完成度计分。
 *
 * 相对 v1 数据的修订记录：
 * - 合并 motion_sickness_3d + motion_sickness_spectrum → motion_sickness（同一晕动症家族，去重复计权）
 * - 合并 caffeine_sensitivity + tea_caffeine_sensitivity → caffeine_sensitivity（同为 CYP1A2/ADORA2A 通路）
 * - 归类修正：earworm → brain；hydrogen_cyanide_smell → sensory；aphantasia → brain
 * - chronotype 好极翻转为“中间型”（极端夜猫与社会时差/代谢风险的观察性证据；原方向无依据）
 * - earwax_body_odor 删除“社交成本”表述，降为 neutral（文化审美判断，非健康差异）
 * - hydrogen_cyanide_smell 频率按文献改为 20%–40% 闻不到（原“每 10 人 1 人”偏低）
 * - synesthesia 软化“女性五倍”表述（早期小样本结论，较大样本接近 2–3:1）
 */
export const questions: Question[] = [
  // ===== 一、感官与知觉 =====
  {
    id: "cilantro",
    category: "sensory",
    title: "香菜",
    question: "你吃香菜时是否尝到明显的肥皂味或臭虫味？",
    options: [
      { label: "尝不出肥皂/臭虫味" },
      { label: "尝得出肥皂/臭虫味" },
    ],
    goodOption: 0,
    goodFrequency: 0.85,
    rationale: "neutral",
    explanation:
      "这与 OR6A2 等嗅觉受体基因相关，属于中性差异，无健康优劣。好极方向（尝不出）是口味偏好层面的宣言。",
    sourceNote: "全球约 15% 的人报告香菜有肥皂味，部分欧亚人群可达 21%。",
  },
  {
    id: "asmr",
    category: "sensory",
    title: "ASMR",
    question: "听到轻声细语、敲击声时，你能否体验到从头皮到后颈的愉悦刺麻感？",
    options: [
      { label: "能体验到刺麻感" },
      { label: "完全无感" },
    ],
    goodOption: 0,
    goodFrequency: 0.3,
    rationale: "bandwidth",
    explanation:
      "ASMR 属于中性神经差异；本题按“感知带宽增益”计分——多一种可用的愉悦感知通道，无对应损失。",
    sourceNote: "文献估计 ASMR 体验者比例约 20%–39%，与经验开放性人格特质相关。",
  },
  {
    id: "synesthesia",
    category: "sensory",
    title: "联觉",
    question:
      "你是否会在一种感官刺激下自动触发另一种感官体验，比如看见声音的颜色、尝到文字的味道？",
    options: [
      { label: "有某种联觉" },
      { label: "没有" },
    ],
    goodOption: 0,
    goodFrequency: 0.04,
    rationale: "bandwidth",
    explanation:
      "约 4.4% 的人具有某种形式的联觉。这是中性神经多样性，本题按“感知带宽增益”计分。",
    sourceNote: "早期研究报告女性联觉者显著更多，较大样本估计男女比接近 2–3:1，结论仍在修订中。",
  },
  {
    id: "photic_sneeze",
    category: "sensory",
    title: "光喷嚏反射",
    question: "从暗处进入强光时，你是否会忍不住打喷嚏？",
    options: [
      { label: "会打喷嚏" },
      { label: "不会" },
    ],
    goodOption: 0,
    goodFrequency: 0.25,
    rationale: "neutral",
    explanation:
      "常染色体显性遗传的光喷嚏反射（ACHOO 综合征），属于中性反射差异，无健康影响。好极方向为趣味宣言。",
    sourceNote: "文献估计人群比例约 10%–35%；父母一方携带时子女约有一半概率出现。",
  },
  {
    id: "bitter_taste",
    category: "sensory",
    title: "苦味",
    question: "你是否对苦味特别敏感，常觉得某些蔬菜很苦？",
    options: [
      { label: "超级品尝者" },
      { label: "中等品尝者/味盲" },
    ],
    goodOption: 0,
    goodFrequency: 0.25,
    rationale: "bandwidth",
    explanation:
      "TAS2R38 基因影响苦味敏感度，约 25% 的人是超级品尝者。按“味觉带宽”计分；敏感也可能让人少吃某些蔬菜，方向并非全无代价。",
    sourceNote: "带宽类判断，权重低于风险/功能类。",
  },
  {
    id: "misophonia",
    category: "sensory",
    title: "恐音症",
    question: "别人咀嚼、吧唧嘴或敲笔的声音，是否会让你产生明显的愤怒或厌恶？",
    options: [
      { label: "基本无感" },
      { label: "明显炸毛" },
    ],
    goodOption: 0,
    goodFrequency: 0.85,
    rationale: "function",
    explanation:
      "恐音症与情绪和感官处理网络的过度反应有关，会带来真实的情绪困扰和社交回避——这是功能口径下的代价，不是矫情。",
    sourceNote: "文献估计普通人群受影响比例约 5%–20%（依判定标准而异）。",
  },
  {
    id: "absolute_pitch",
    category: "sensory",
    title: "绝对音感",
    question: "没有参照音时，你能否准确识别或唱出某个音高？",
    options: [
      { label: "有绝对音感" },
      { label: "没有" },
    ],
    goodOption: 0,
    goodFrequency: 0.005,
    rationale: "bandwidth",
    explanation:
      "普通人群中约万分之一，在音乐训练者、声调语言人群、自闭症谱系与早期失明者中比例更高。按“稀有听觉能力增益”计分——没有它不构成任何缺陷。",
    sourceNote: "带宽类判断；好极极稀有，因此它主要影响百分位解读而非完成度权重。",
  },
  {
    id: "pareidolia",
    category: "sensory",
    title: "面孔幻想性错觉",
    question: "你是否容易在云朵、插座、吐司等物体上“看到”人脸？",
    options: [
      { label: "容易看到脸" },
      { label: "不容易" },
    ],
    goodOption: 0,
    goodFrequency: 0.65,
    rationale: "neutral",
    explanation:
      "反映面孔检测系统的基线激活阈值差异，属于常见中性现象，无功能或健康后果。好极方向为趣味宣言。",
  },
  {
    id: "sweet_fat_sensitivity",
    category: "sensory",
    title: "甜味/脂肪敏感",
    question: "你是否对甜味或油腻口感特别敏感？",
    options: [
      { label: "特别敏感" },
      { label: "吃啥都差不多" },
    ],
    goodOption: 0,
    goodFrequency: 0.45,
    rationale: "bandwidth",
    explanation:
      "TAS1R3、CD36 等基因差异影响甜味与脂肪口感敏感度。按“味觉带宽”计分；敏感者也可能更偏好高糖脂食物，方向并非全无代价。",
    sourceNote: "带宽类判断，权重低于风险/功能类。",
  },
  {
    id: "menthol_cooling",
    category: "sensory",
    title: "薄荷凉感",
    question: "你吃薄荷或使用薄荷产品时，凉感是否很强？",
    options: [
      { label: "凉感很强" },
      { label: "几乎没凉感" },
    ],
    goodOption: 0,
    goodFrequency: 0.5,
    rationale: "bandwidth",
    explanation: "TRPM8 受体功能覆盖存在个体差异，属于中性感觉差异，按“感知带宽”计分。",
    sourceNote: "人群频率为粗估，缺乏大样本精确数据。",
  },
  {
    id: "hydrogen_cyanide_smell",
    category: "sensory",
    title: "苦杏仁/氢氰酸气味",
    question:
      "面对杏仁露、杏仁豆腐、苦杏仁饼干这类食物，你能不能明显闻出那种独特的“杏仁香”？",
    options: [
      {
        label: "能，那个味道我一闻就知道",
        note: "对苦杏仁系气味（苯甲醛类）敏感",
      },
      {
        label: "闻不出来，只觉得是普通甜味",
        note: "以前从没意识到“杏仁味”到底是什么味",
      },
    ],
    goodOption: 0,
    goodFrequency: 0.7,
    rationale: "risk",
    explanation:
      "所谓“苦杏仁味”主要来自苯甲醛，它与氢氰酸不是同一种物质，但因同出现在苦杏仁/桃仁而被传统安全手册绑在一起——氢氰酸泄漏的识别口诀正是“有无苦杏仁味”。约 20%–40% 的人对这类气味天生不敏感。本题按风险口径计分；请把它理解为“杏仁香敏感度”的近似自评，而不是你真的当过泄漏探测器。",
    sourceNote: "v2.1 改写：原题“能否闻到氢氰酸”无法自评，现改用杏仁露/苦杏仁食品作生活参照；原数据“每 10 人 1 人闻不到”偏低已修正。",
  },

  // ===== 二、身体与自主神经 =====
  {
    id: "motion_sickness",
    category: "body",
    title: "晕动症",
    question: "晕车、晕船、晕机、晕 3D/VR——你的总体情况是？",
    options: [
      { label: "全不晕" },
      { label: "至少一种会晕" },
    ],
    goodOption: 0,
    goodFrequency: 0.35,
    rationale: "function",
    explanation:
      "视觉-前庭冲突引发晕动，是同一家族的连续谱。“全不晕”在交通与虚拟环境中的适应成本最低；晕动敏感不是疾病，多数可通过脱敏训练改善。",
    sourceNote: "合并自原“晕3D”与“晕动症谱系”两题（同源特质，避免重复计权）。二选一仍是连续谱的简化。",
  },
  {
    id: "chronotype",
    category: "body",
    title: "睡眠时型",
    question: "你的睡眠时型更接近哪一类？",
    options: [
      { label: "中间型" },
      { label: "明确早鸟或夜猫子" },
    ],
    goodOption: 0,
    goodFrequency: 0.55,
    rationale: "function",
    explanation:
      "极端夜猫型与“社会时差”及代谢、心血管风险的观察性证据相关；中间型对现代作息的适应成本最低。极端早鸟的风险证据较弱，但同按功能口径归类。",
    sourceNote: "原数据给极端节律更高分，无客观依据，已翻转为中间型是好极。极端时型各约占 15%–27%。",
  },
  {
    id: "pain_tolerance",
    category: "body",
    title: "疼痛耐受",
    question: "你对疼痛的耐受度更接近？",
    options: [
      { label: "高耐受" },
      { label: "低耐受" },
    ],
    goodOption: 0,
    goodFrequency: 0.5,
    rationale: "function",
    explanation:
      "双生子研究提示遗传可解释约一半的疼痛耐受差异。低耐受不是病，但就医、牙科与日常功能受限更明显，按功能口径计分。",
  },
  {
    id: "alcohol_flush",
    category: "body",
    title: "酒精脸红",
    question: "喝酒后你是否容易脸红？",
    options: [
      { label: "不脸红" },
      { label: "一杯就上脸" },
    ],
    goodOption: 0,
    goodFrequency: 0.7,
    rationale: "risk",
    explanation:
      "ALDH2 基因变体导致乙醛蓄积，与食管癌风险显著相关（尤其在饮酒时）。这是本题库中风险证据最硬的条目之一，按风险口径计最高权重。",
    sourceNote: "ALDH2*2 在东亚人群中约 30%–50%；风险随饮酒暴露而变，不饮酒则代价大幅降低。全球粗估好极频率 0.7。",
  },
  {
    id: "lactose_tolerance",
    category: "body",
    title: "乳糖耐受",
    question: "成年后喝奶是否会腹胀、腹泻？",
    options: [
      { label: "成年后能正常喝奶" },
      { label: "乳糖不耐" },
    ],
    goodOption: 0,
    goodFrequency: 0.35,
    rationale: "function",
    explanation:
      "全球约 68% 的人存在乳糖吸收不良，东亚人群可达 70%–100%。不是病，但饮食选择受限明显，按功能口径计分。",
    sourceNote: "好极频率高度依赖参照人群（北欧 >90% 耐受，东亚 <30%）；本站采用全球粗估。",
  },
  {
    id: "earwax_body_odor",
    category: "body",
    title: "耳垢/体味",
    question: "你的耳垢类型和体味更接近？",
    options: [
      { label: "干耳垢、体味轻" },
      { label: "湿耳垢、体味重" },
    ],
    goodOption: 0,
    goodFrequency: 0.3,
    rationale: "neutral",
    explanation:
      "ABCC11 基因同时决定耳垢干湿与大汗腺分泌类型。两种类型都是正常变异，无健康差异；“体味轻更好”是社会审美判断，故本题按中性口径计最低档权重。",
    sourceNote: "干耳垢等位基因在东亚高频、在非洲/欧洲低频——好极宣言带有明显的文化属性，特此明示。",
  },
  {
    id: "vasovagal_syncope",
    category: "body",
    title: "血管迷走性晕厥",
    question: "你是否在见血、疼痛或久站时容易晕倒？",
    options: [
      { label: "从未晕倒" },
      { label: "见血/久站会晕" },
    ],
    goodOption: 0,
    goodFrequency: 0.78,
    rationale: "risk",
    explanation:
      "普通人群终生发生率约 22%。晕厥发作伴随跌倒与外伤风险，按风险口径计分。",
    sourceNote: "“从未晕倒”受回忆偏差影响，实际频率可能被低估。",
  },
  {
    id: "sleep_paralysis",
    category: "body",
    title: "睡眠瘫痪",
    question: "你是否经历过“鬼压床”，即意识清醒但身体不能动？",
    options: [
      { label: "从未有过" },
      { label: "有过" },
    ],
    goodOption: 0,
    goodFrequency: 0.92,
    rationale: "function",
    explanation:
      "普通人群终生患病率约 7.6%，学生群体可达 28%。发作本身无身体危险，但伴随强烈恐惧并可能扰乱睡眠，按功能口径计分。",
    sourceNote: "部分“从未有过”实为不记得或未被识别，存在回忆偏差。",
  },
  {
    id: "caffeine_sensitivity",
    category: "body",
    title: "咖啡因代谢",
    question: "下午喝咖啡或茶，是否明显影响你当晚睡眠，或引起心悸、烦躁？",
    options: [
      { label: "代谢快，照睡不误" },
      { label: "敏感，失眠/心慌/烦躁" },
    ],
    goodOption: 0,
    goodFrequency: 0.5,
    rationale: "function",
    explanation:
      "CYP1A2 决定代谢速度，ADORA2A 影响受体敏感性。慢代谢者下午摄入咖啡因即显著影响睡眠质量，按功能口径计分。",
    sourceNote: "合并自原“咖啡因”与“茶咖啡因”两题（同一代谢通路，避免重复计权）。",
  },
  {
    id: "chili_tolerance",
    category: "body",
    title: "辣椒耐受",
    question: "你对辣椒的耐受度更接近？",
    options: [
      { label: "高耐受" },
      { label: "微辣就冒汗" },
    ],
    goodOption: 0,
    goodFrequency: 0.5,
    rationale: "neutral",
    explanation:
      "TRPV1 受体敏感度与习惯化共同作用。低耐受不是缺陷（辣椒素本就是对痛觉受体的化学刺激），高耐受也可能伴随胃刺激——按中性口径计分。",
  },
  {
    id: "sunburn_tendency",
    category: "body",
    title: "晒伤倾向",
    question: "你晒太阳后更容易出现哪种情况？",
    options: [
      { label: "晒黑快、不易红" },
      { label: "晒十分钟就红" },
    ],
    goodOption: 0,
    goodFrequency: 0.65,
    rationale: "risk",
    explanation:
      "MC1R 等基因决定皮肤光型。易晒伤、不易晒黑的光型与皮肤癌（含黑色素瘤）风险显著相关，按风险口径计分。",
    sourceNote: "好极频率依参照人群的肤色分布而变，此处为全球粗估。风险随紫外线暴露而变。",
  },

  // ===== 三、大脑与心理 =====
  {
    id: "earworm",
    category: "brain",
    title: "耳虫",
    question: "你每周是否都会出现脑子里单曲循环（耳虫）？",
    options: [
      { label: "每周都有耳虫" },
      { label: "几乎没耳虫" },
    ],
    goodOption: 0,
    goodFrequency: 0.9,
    rationale: "neutral",
    explanation:
      "超过 90% 的人每周至少经历一次耳虫，属于听觉意象的常见自发活动。频率高低无优劣，本题为趣味宣言；频繁且困扰者另当别论。",
    sourceNote: "归类修正：耳虫是认知现象（不自主音乐意象），属大脑与心理而非身体。",
  },
  {
    id: "aphantasia",
    category: "brain",
    title: "心盲症",
    question: "闭眼时，你能否在脑海中“看见”一个苹果的颜色和形状？",
    options: [
      { label: "能脑内看见画面" },
      { label: "一片漆黑" },
    ],
    goodOption: 0,
    goodFrequency: 0.97,
    rationale: "function",
    explanation:
      "心盲症估计占人群 1%–4%。心象参与情景记忆、空间导航与未来模拟，缺失不降低智力，但这些功能有替代成本——按功能口径计分。",
    sourceNote: "归类修正：心理意象属认知功能（原数据归感官）。心盲者常在抽象推理上表现出色。",
  },
  {
    id: "prosopagnosia",
    category: "brain",
    title: "脸盲",
    question: "你是否天生很难记住或识别面孔？",
    options: [
      { label: "不是脸盲" },
      { label: "天生面孔识别困难" },
    ],
    goodOption: 0,
    goodFrequency: 0.975,
    rationale: "function",
    explanation:
      "发展性脸盲约 2.5%，会实际影响社交识别与职业场景，不是“不认真记人”。按功能口径计分。",
  },
  {
    id: "sense_of_direction",
    category: "brain",
    title: "方向感",
    question: "你的方向感更接近？",
    options: [
      { label: "方向感强" },
      { label: "重度路痴" },
    ],
    goodOption: 0,
    goodFrequency: 0.5,
    rationale: "function",
    explanation:
      "空间导航策略存在个体差异；重度路痴在陌生环境中的功能受限更明显，按功能口径计分。",
  },
];

/** 兼容组件层的大写导出（同一数据源） */
export const QUESTIONS = questions;

/** 题目总数（评分表满分项数 N） */
export const QUESTION_COUNT = questions.length;
