import type { Question } from "@/types/quiz";

/**
 * 题目数据 v2（39 条：感官与知觉 13 / 身体与自主神经 18 / 大脑与心理 8）。
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
 * - v2.1 氢氰酸题改用“杏仁香”生活参照；v2.2 苦味/恐音症/甜腻三题改为带具体食物或
 *   声音锚点的可自评版本（恐音症题干内明确排除指甲划黑板类普遍刺耳声）；
 *   v2.3 睡眠时型按 MEQ 口径改为“自由日无闹钟时身体的自然状态”，与熬夜行为区分；
 *   v2.4 耳垢/体味题退化为纯事实的“耳垢类型”自察题（社会赞许性偏差 + 复合题干修正）；
 *   v2.5 耳虫题解释扩充（INMI 机制/神曲配方/口香糖干预）；
 *   v2.6 心盲题解释扩充（命名史/草莓自查/ dream 悖论/功能代价定位）；
 *   v2.7 脸盲/方向感题解释扩充（FFA 机制/倒置效应/位置细胞与网格细胞/诺奖背景）；
 *   v2.8 扩容 +13：失歌/麝香（感官）、卷舌/动耳/搭车拇指/冰淇淋头痛/雷诺/不安腿/蚊叮
 *   （身体）、音乐寒颤/哈欠传染/幽灵震动/电影落泪（大脑）——称号阈值随之重新校准
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
    title: "苦味敏感",
    question:
      "吃苦瓜、西兰花、柚子/橙子的白皮白络、浓绿茶或黑巧克力时，苦味是否强烈到发“冲”，甚至像吃药、难以下咽？",
    options: [
      {
        label: "是，苦味对我冲击很大",
        note: "别人觉得“微苦”的食物，我已觉得苦得受不了",
      },
      {
        label: "没什么感觉，苦味不突出",
        note: "苦瓜、黑巧这些都吃得毫无压力",
      },
    ],
    goodOption: 0,
    goodFrequency: 0.25,
    rationale: "bandwidth",
    explanation:
      "TAS2R38 基因影响对硫代葡萄糖苷类苦味（ broccoli、苦瓜这类）的敏感度，约 25% 的人是“超级品尝者”。按“味觉带宽”计分；敏感也可能让人少吃某些蔬菜，方向并非全无代价。",
    sourceNote: "带宽类判断，权重低于风险/功能类。实验室用 PROP 试纸测定，日常以苦瓜/西蓝花等食物自评为近似。",
  },
  {
    id: "misophonia",
    category: "sensory",
    title: "恐音症",
    question:
      "别人“吃东西的声音”（咀嚼、吧唧嘴、吸溜汤、咂嘴）是否会让你升起强烈的烦躁、愤怒，甚至想立刻逃离现场？（注意：指甲划黑板、电钻声这种“人人都嫌刺耳”的声音不算——恐音症特指他人发出的这类重复性口腔/身体声）",
    options: [
      {
        label: "基本无感",
        note: "旁边人吃饭出声，我注意不到或不在意",
      },
      {
        label: "明显炸毛",
        note: "一旦触发情绪上头，很难说服自己“忍一忍就过去了”",
      },
    ],
    goodOption: 0,
    goodFrequency: 0.85,
    rationale: "function",
    explanation:
      "恐音症的特征是**刺激高度特异**（多为咀嚼、呼吸、敲笔等他人重复声）+ 反应强烈（愤怒/厌恶/逃离），与情绪和听觉处理网络的过度连接有关，会带来真实的情绪困扰和社交回避——这是功能口径下的代价，不是矫情。",
    sourceNote: "文献估计普通人群受影响比例约 5%–20%（依判定标准而异）；指甲划黑板的普遍厌恶属于“粗糙声”反应，机制不同，本题已排除。",
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
    question:
      "喝奶茶时你能否尝出微妙的甜度差别、觉得“全糖太甜”；吃奶油蛋糕、肥肉、油炸食物时是否很快感到“糊嘴、腻住了”，而别人觉得正常？",
    options: [
      {
        label: "是，甜和腻我一尝就挑剔",
        note: "会主动选微糖，吃两口蛋糕就嫌齁，油炸吃多会反胃",
      },
      {
        label: "吃啥都差不多",
        note: "再甜再油也不太被劝退，从没为“腻”停过筷子",
      },
    ],
    goodOption: 0,
    goodFrequency: 0.45,
    rationale: "bandwidth",
    explanation:
      "TAS1R3（甜味受体）、CD36 等基因差异影响对甜味强度和脂肪口感的敏感度。按“味觉带宽”计分；敏感者也可能更偏好高糖高脂食物（好吃上头），方向并非全无代价。",
    sourceNote: "带宽类判断，权重低于风险/功能类；自评以“是否常被甜/腻劝退”为近似锚点。",
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
    id: "amusia",
    category: "sensory",
    title: "走音感知",
    question: "合唱或 KTV 里，你能不能明确听出别人跑调、节奏跟不上？（轮到你自己唱时也一样跑不了调）",
    options: [
      {
        label: "听得一清二楚",
        note: "隔壁包房跑调都瞒不过你的耳朵",
      },
      {
        label: "听不出来，觉得都挺好",
        note: "也可能自己就是那个跑调而不自知的人",
      },
    ],
    goodOption: 0,
    goodFrequency: 0.93,
    rationale: "function",
    explanation:
      "先天性失歌症（congenital amusia）约占 3%–4%：听力完全正常，但音高微差与节奏结构的感知通路受损（右侧颞上回白质与音高变化检测相关），自己跑调也听不见——不是五音不全的自嘲，是真实存在的感知差异。音乐感知还牵连语音情感细微信号（哀伤的嗓音往往伴随音高轮廓变化）。代价主要在 KTV、合唱这类社交场景，按功能口径计 ×2，不涉健康。",
    sourceNote: "发生率与音高编码机制见 congenital amusia 系列研究（Hyde & Zatorre；Liu et al. 2019）。",
  },
  {
    id: "musk_smell",
    category: "sensory",
    title: "麝香闻感",
    question: "香水、洗衣液或空气清新剂里标榜“麝香/amber musk”的那股味道，你能明确闻出来吗？",
    options: [
      {
        label: "能——有人觉得甜，有人觉得像汗味",
        note: "OR7D4 受体的三种表型：甜香型、汗臭型都算“能闻到”",
      },
      {
        label: "闻不到，总觉得它“什么味都没有”",
        note: "典型的气味特异性盲，不是鼻子堵了",
      },
    ],
    goodOption: 0,
    goodFrequency: 0.7,
    rationale: "bandwidth",
    explanation:
      "雄烯酮（androstenone，麝香类香料的核心成分之一）是已知最强的人类气味遗传分型案例：OR7D4 嗅觉受体基因变体把人大致分成三派——约 25% 闻到甜香/香草味，约 40% 闻到汗臭/尿骚味并强烈讨厌，约 30% 完全嗅觉盲。香水柜台其实是个基因型检测仪。闻盲没有健康代价，只是香水中少一个可感维度，按感知带宽计分。",
    sourceNote: "OR7D4 三表型及约 30% 闻盲率见 Keller 等 2007 年 PNAS 研究。",
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
    question:
      "回忆最近那些不设闹钟、也没有工作/社交约束的日子（假期、周末）：你的身体自发地怎么选？（为了娱乐或工作主动熬夜不算——那测的是日程，不是体钟）",
    options: [
      {
        label: "午夜前后自然入睡，常规时间醒来，早晨状态尚可",
        note: "即使工作日被迫晚睡，自由日身体会自动漂回正常档——这属于中间型",
      },
      {
        label: "不熬到凌晨 1–2 点根本睡不着、不到中午醒不透，精力峰值在深夜；或相反：晚上九十点就困倒，凌晨五六点自然醒且精神",
        note: "强行按主流作息安排会很痛苦，且“假期也改不过来”",
      },
    ],
    goodOption: 0,
    goodFrequency: 0.55,
    rationale: "function",
    explanation:
      "睡眠时型衡量的是体内昼夜钟相对太阳日的相位，不是熬夜时长。判断锚点是“自由日、无闹钟时身体的自然选择”：娱乐性熬夜者若假期能正常早起，多半仍是中间型。极端夜猫型与“社会时差”及代谢、心血管风险的观察性证据相关，中间型对现代作息的适应成本最低。",
    sourceNote: "原数据给极端节律更高分，无客观依据，已翻转为中间型是好极；原题干无法区分时型与熬夜行为，v2.3 按 MEQ 量表口径改为“自由日身体自然状态”问法。极端时型各约占 15%–27%。",
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
    title: "耳垢类型",
    question: "清理耳垢时，更接近下面哪种情形？",
    options: [
      {
        label: "干型：碎屑/粉末状，纸巾擦拭即可",
        note: "东亚人群的大多数",
      },
      {
        label: "湿型：琥珀色黏稠状，通常需要用棉签",
        note: "欧洲、非洲人群的常见类型",
      },
    ],
    goodOption: 0,
    goodFrequency: 0.3,
    rationale: "neutral",
    explanation:
      "ABCC11 基因同时决定耳垢类型和腋下大汗腺分泌强度（湿耳垢者体味普遍更明显，干耳垢者大多不需要止汗产品）。本题只问耳垢这一项可客观自察的事实——同基因关联的体味差异会在结果里注明，但不需要你自我评价，避免“哪个更好听就选哪个”。两种类型都是正常变异，无健康差异；好极宣言（干型）纯属文化审美口径，故按中性层级计最低档权重。",
    sourceNote: "干耳垢等位基因在东亚高频、在非洲/欧洲低频——好极宣言带有明显的文化属性，特此明示。v2.4：题面改为纯事实自察，删除“体味重”标签与双项捆绑选项。",
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
  {
    id: "tongue_rolling",
    category: "body",
    title: "卷舌",
    question: "伸出舌头，不用嘴唇帮忙，能把舌头两侧卷成 U 形槽吗？",
    options: [
      {
        label: "能卷舌",
        note: "中学生物课经典保留节目",
      },
      {
        label: "卷不了，怎么努力都只会抖",
        note: "正常变异，不是练得不够",
      },
    ],
    goodOption: 0,
    goodFrequency: 0.7,
    rationale: "neutral",
    explanation:
      "卷舌率全球约 65%–81%（随族群差异大，非洲人群报告偏低）。一百年教科书把它讲成“单基因显性”，但双生子与领养研究一直对不上账——真实遗传架构更复杂，卷舌其实是舌纵横肌形态与灵活性的复合表型。无功能含义，是本题库最纯粹的“解剖彩票”之一。",
    sourceNote: "经典遗传学案例：卷舌单基因显性说源于 1940 年代，后被双生子证据反复修正。",
  },
  {
    id: "ear_wiggling",
    category: "body",
    title: "耳朵动",
    question: "不碰耳朵，你能单靠肌肉让它“往后转”或明显抖动吗？",
    options: [
      {
        label: "能，耳朵有“肌肉控制权”",
        note: "耳前/耳上/耳后三块小肌肉还能被意志调用",
      },
      {
        label: "完全动不了",
        note: "大多数人如此——这些肌肉只是“遗留件”",
      },
    ],
    goodOption: 0,
    goodFrequency: 0.15,
    rationale: "neutral",
    explanation:
      "人保留着耳前肌、耳上肌、耳后肌——猫马犬靠它们转耳定向收集声源，人类的用途在进化中退场，但约 10%–20% 的人仍能自主收缩（解剖学期刊专门发表过自愿动耳的发生率调查，作者自带自嘲精神）。它和“动眉毛不动额头”同属运动控制的冷知识彩蛋，无任何健康含义。",
    sourceNote: "自愿动耳率约一至两成（解剖学期刊调查，Ota 2009 等）；属退化肌残留功能差异。",
  },
  {
    id: "hitchhiker_thumb",
    category: "body",
    title: "搭车拇指",
    question: "手掌平放桌面，拇指放松、轻轻向后掰——能几乎伸直到接近手背那一侧吗？",
    options: [
      {
        label: "能，拇指可以“对折”",
        note: "拇指指间关节可过伸近 90°",
      },
      {
        label: "最多四十五度左右",
        note: "普通角度",
      },
    ],
    goodOption: 0,
    goodFrequency: 0.25,
    rationale: "neutral",
    explanation:
      "Hitchhiker's thumb（搭车拇指，源自招手的姿势）指拇指末节关节过度伸展，约 1/4 人群具备；旧教科书称“隐性单基因”，现在认为是关节囊与伸肌腱构造的连续性状。注意：拇指能碰到前臂是 Beighton 评分（全身关节松弛度）的经典动作之一——但孤立的一项不代表任何疾病，单纯搭车拇指只是配置差异。",
    sourceNote: "群体频率约 24%（经典解剖统计）；Beighton 评分条目之一，孤立阳性无临床意义。",
  },
  {
    id: "brain_freeze",
    category: "body",
    title: "冰淇淋头痛",
    question: "快速吃冰激凌、冰饮或咬冰块时，额头/太阳穴会来一阵尖锐的“脑壳被冻住”式头痛吗？",
    options: [
      {
        label: "会，疼个几十秒只能憋着",
        note: "学名“蝶腭神经节神经痛”（sphenopalatine ganglioneuralgia）",
      },
      {
        label: "不会，冰的不疼",
        note: "你可以放心炫雪糕",
      },
    ],
    goodOption: 1,
    goodFrequency: 0.45,
    rationale: "neutral",
    explanation:
      "机制是口腔上颚受冷刺激引起血管快速收缩—扩张，三叉神经把这份“账单”误报到额头（牵涉痛）。冰淇淋激发实验报告过半人群会中招，且偏头痛史人群发生率更高、更疼。完全无害，持续几十秒；把舌头压紧上颚回暖能显著加速缓解。",
    sourceNote: "冰激凌激发实验报告发生率约五至六成；与偏头痛易感正相关。",
  },
  {
    id: "raynaud",
    category: "body",
    title: "冷时白手指",
    question: "冬天接触冷水、从冷冻室拿东西或紧张时，手指会明显变“死白”→发紫→回暖后发红发胀吗？",
    options: [
      {
        label: "没有，最多冻得发红",
        note: "普通血管收缩反应",
      },
      {
        label: "有，指头会惨白失去知觉",
        note: "雷诺现象的典型三段式变色",
      },
    ],
    goodOption: 0,
    goodFrequency: 0.9,
    rationale: "function",
    explanation:
      "这是雷诺现象（Raynaud's）的三段式变色：指动脉痉挛→缺血苍白→缺氧发紫→再灌注发红胀痛。约 4%–10% 的人有典型表现（女性更多），绝大多数为“原发性”、良性，代价在寒冷环境手部灵巧度与游泳、冷冻作业等场景；少数为“继发性”（可伴自身免疫病），单侧、溃烂或成年后新发的应风湿免疫科随访。本题按功能口径计分，不构成任何诊断。",
    sourceNote: "人群率约 4%（年轻女性更高）；原发/继发区分见风湿病学诊疗共识。",
  },
  {
    id: "restless_legs",
    category: "body",
    title: "不安腿",
    question: "入睡前或久坐不动时（长电影、长途车），腿部会出现“说不清的不适、必须动一动才舒服”的冲动吗？",
    options: [
      {
        label: "从来没有",
        note: "睡眠与久坐对你不构成酷刑",
      },
      {
        label: "有过，不动就难受",
        note: "活动后缓解、夜间加重是其特征",
      },
    ],
    goodOption: 0,
    goodFrequency: 0.93,
    rationale: "function",
    explanation:
      "不安腿综合征（RLS，Willis–Ekbom 病）诊断标准的四条核心：活动腿部的冲动 + 静息诱发/加重 + 活动缓解 + 夜间加重，符合者约 2%–8%（女性更高），与多巴胺通路和铁代谢相关，是睡眠破坏的隐形大户；更轻度、不满足诊断的“腿痒想动”位于同一谱系。按功能口径计分。",
    sourceNote: "诊断四要素与发生率见 NIH 共识（Allen et al. 2003）。",
  },
  {
    id: "mosquito_attraction",
    category: "body",
    title: "蚊子偏爱",
    question: "户外集体活动中，你是不是通常那个“被咬得最多”的人——朋友没事，你满身包？",
    options: [
      {
        label: "是我，蚊子定点狙击",
        note: "CO₂ 排量、体温、皮肤菌群挥发物都在起作用",
      },
      {
        label: "我很少被咬",
        note: "",
      },
    ],
    goodOption: 1,
    goodFrequency: 0.55,
    rationale: "neutral",
    explanation:
      "蚊子择人有真实科学：已证实的因素包括 CO₂ 排放量、体温、皮肤表面微生物组产生的挥发性化合物（乳酸、氨类等），O 型血偏好说在双盲实验中未获稳定支持——问题不在血，在皮肤化学。但请注意这题的自评天然带偏差（疼都长在自己腿上），所以按中性口径计分，别为它买“驱蚊神药”。",
    sourceNote: "皮肤菌群与吸引力关系见 Verhulst 等 2011 年实验室研究；血型说的证据等级低。",
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
      "耳虫的学名是“不自主音乐意象”（INMI），是听觉系统最常见的自发活动之一——出现频率与“走神”同级，90% 以上的人每周至少中招一次。最容易“咬人”的旋律有共同配方：节奏快、段落重复、又带点小变化（神曲和广告神曲是重灾区）。主流机制解释是“未完成闭环”（蔡格尼克效应）：只被记住片段的旋律会让听觉皮层不断自发重放，试图把它“补完”，所以越想压住越循环。音乐人和常接触音乐的人更频繁——但频率高低无优劣，本题是好极最随意的趣味宣言之一。被困扰时有实证小招：嚼口香糖（抢占“内部哼唱”的运动通道）、把整首歌完整听一遍给大脑“闭环”、或转做语言/解谜任务。",
    sourceNote: "归类修正：耳虫是认知现象（不自主音乐意象），属大脑与心理而非身体。频率与机制见 Beaman & Williams（2010）关于 INMI 的大样本调查；口香糖干预见 Fink et al.（2015）。",
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
      "“心盲”（aphantasia）是 2015 年埃克塞特大学 Adam Zeman 团队在《Cortex》上系统命名的现象：闭眼按要求“看”一张画面时，视野一片空白，只剩概念和词语。约 1%–4% 的人终身如此，但心象生动性其实是一个连续谱——谱子另一端是“超心象”（hyperphantasia，画面逼真如照片）。著名的自查法就是“想象一颗草莓”：颜色、籽、形状会“浮现”的在谱上，只有“草莓这个词”的靠近心盲端。fMRI 显示心盲者尝试想象时视觉皮层激活显著偏弱——额叶的“调取指令”动员不了视觉区，相当于“脑内投影仪”缺镜头；但视力、智力、创造力完全不受影响，且多数心盲者的**梦境仍是画面的**（梦境意象与主动想象走的是不同回路）。真实代价在心象搭把手的地方：自传体记忆偏向“知道”而非“回放”，未来情景模拟、部分空间任务需要换成语言/抽象策略。很多心盲者是看到“想象草莓”投票热搜那天，才第一次意识到“原来别人闭眼能看见”——本体系因此按功能口径计 ×2，而非缺陷。",
    sourceNote: "归类修正：心理意象属认知功能（原数据归感官）。命名与人群估计见 Zeman et al.（2015, 2020）埃克塞特系列研究；心象生动性连续谱测量用 VVIQ 量表（Marks）；Ed Sheeran 等创作者自述心盲，说明该特质不阻碍专业创造力。",
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
      "发展性脸盲（developmental prosopagnosia）约 2.5%，指**非脑损伤**导致的面孔识别困难——很多人从童年起就“认不出人”，直到成年才意识到别人闭眼能“看见”脸。核心脑区是梭状回面孔区（FFA），fMRI 显示其激活偏弱；机制是“面孔整体加工”缺陷（把五官拼成一张脸的格式塔能力弱），所以脸盲者常依赖局部线索（发型、眼镜、声音）而非面孔本身。经典验证是“面孔倒置效应”：正常人看倒过来的脸会明显变差（因为整体加工失效），脸盲者正脸和倒脸都差——说明他们本来就没在用整体策略。金标准测试是 Cambridge Face Memory Test（CFMT）。与自闭症谱系共病率高（面孔识别是社交识别的入口），但智力、视力、物体识别完全正常。真实代价在社交场景（聚会认不出人、影视剧追不上角色）和部分职业场景，按功能口径计 ×2。",
    sourceNote: "归类修正：面孔识别属认知功能。发生率与机制见 Duchaine & Nakayama（2006）CFMT 验证；FFA 与面孔整体加工见 Kanwisher 系列；与自闭症共病见 Tanaka et al.（2012）。",
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
      "方向感的神经基础是 2014 年诺贝尔奖（O'Keefe & Moser）揭示的海马体“位置细胞”+ 内嗅皮层“网格细胞”——它们共同构建“认知地图”，让你能在脑内建模空间关系。但方向感不是纯天赋，而是**策略 × 训练**的产物：有人依赖“认知地图”（整体布局），有人依赖“路线策略”（记住一串转弯指令），后者在陌生环境容易崩。伦敦出租车司机的经典研究显示，通过“知识考试”（The Knowledge）后海马体后部明显增大——说明空间导航能力可塑性很强。功能代价在陌生城市导航、停车找车、紧急疏散等场景，按功能口径计 ×2。",
    sourceNote: "归类修正：空间导航属认知功能。位置细胞/网格细胞见 O'Keefe & Dostrovsky（1971）、Hafting et al.（2005）；伦敦出租车司机海马体可塑性见 Maguire et al.（2000）。",
  },
  {
    id: "frisson",
    category: "brain",
    title: "音乐起鸡皮疙瘩",
    question: "听到某些音乐段落时，会不会头皮发麻、后颈起鸡皮疙瘩、胸口发胀，甚至想哭？",
    options: [
      {
        label: "会，我甚至会专门收藏“起皮疙瘩段落”反复听",
        note: "frisson（音乐寒颤），与奖赏回路的多巴胺释放有关",
      },
      {
        label: "从来没这种感觉，音乐就是背景音乐",
        note: "同样正常——大脑奖赏系统对音乐没那么“买账”",
      },
    ],
    goodOption: 0,
    goodFrequency: 0.6,
    rationale: "bandwidth",
    explanation:
      "Frisson（音乐引发的寒颤感）是报告率最高的审美战栗现象：脑成像研究显示高潮段落时听觉皮层与奖赏系统（伏隔核）耦合加强并伴随多巴胺释放，“紧张—违背期待—解决”的音乐结构是最常见触发器。终身报告率在 55%–86% 之间，与“经验开放性”人格维度相关。纯享乐带宽增益，无代价。",
    sourceNote: "多巴胺机制见 Salimpoor et al. 2011（Nat Neurosci）；寒颤的脑成像见 Blood & Zatorre 2001。",
  },
  {
    id: "contagious_yawn",
    category: "brain",
    title: "打哈欠传染",
    question: "看别人打哈欠、听到打哈欠的声音，甚至光是想“打哈欠”这三个字——你会被带得想打吗？（本题自带传染性，答了再说）",
    options: [
      {
        label: "会被传染",
        note: "约七成成年人易感",
      },
      {
        label: "毫无感觉",
        note: "也不奇怪，五岁以下幼儿大多不接招",
      },
    ],
    goodOption: 0,
    goodFrequency: 0.75,
    rationale: "neutral",
    explanation:
      "哈欠传染在人类、黑猩猩、狗、狮等社会性动物中都有记录，机制的主流解释是“运动共振”（观察动作自动激活同一运动程序）。它与年龄（4 岁以下罕见）、熟悉度（亲友的哈欠更易传染）相关，也报告过与自闭特质的负相关——但请注意：“不传染”绝不等于冷血，很多完全健康的人就是不接招。中性题，重点是现在有没有想打。",
    sourceNote: "跨物种与年龄差异见 Anderson et al. 2004 等；“不传染≠共情缺陷”，个体差异研究结论并不强硬。",
  },
  {
    id: "phantom_vibration",
    category: "brain",
    title: "幽灵震动",
    question: "你是否有过口袋里“明显感到手机震了/响了”，掏出来发现什么都没有的经历？",
    options: [
      {
        label: "经常，虚惊是日常",
        note: "六至八成智能手机用户报告过",
      },
      {
        label: "几乎没有",
        note: "注意力习惯不同，无优劣",
      },
    ],
    goodOption: 1,
    goodFrequency: 0.3,
    rationale: "neutral",
    explanation:
      "幽灵震动/铃声综合征（RVTS）：大脑对“手机信号”保持预备状态，把衣服摩擦、肌肉抽动等微弱刺激误报成震动——预测性感知的假阳性。问卷报告率高达六至八成，与等待消息的状态和相关特质有关，不是感官损伤，而是注意力替你把感知调偏了。好极方向取“不被手机劫持注意力”，属趣味宣言。",
    sourceNote: "发生率 60%–80% 见 Michaelidou & Cheung 2011 大学生问卷研究；与焦虑特质相关。",
  },
  {
    id: "movie_tears",
    category: "brain",
    title: "电影落泪",
    question: "看电影/动漫里的悲伤情节（不是恐怖片，不是恶心画面），你会控制不住眼眶发酸吗？",
    options: [
      {
        label: "会，影院就是我的合法眼泪回收站",
        note: "明知是假的仍被触动，叫“准情绪”（para-emotion）",
      },
      {
        label: "不会，进不去那个“假故事”",
        note: "认知距离型观影，同样正常",
      },
    ],
    goodOption: 0,
    goodFrequency: 0.55,
    rationale: "neutral",
    explanation:
      "为虚构作品流泪是共情研究的经典范式：它要求观众主动投入情感模拟去“补给”一个并不存在的处境（学界称 para-emotion，Tan 1996）。会哭与不会哭代表情绪模拟的两种稳定风格，而非“有没有共情”——很多“不哭”的人只是维持着清醒的叙事距离。性别的自我报告差异远大于实测差异。中性题。",
    sourceNote: "电影情绪理论见 Tan (1996)；哭泣的个体差异见 Vingerhoets 哭泣研究系列。",
  },
];

/** 兼容组件层的大写导出（同一数据源） */
export const QUESTIONS = questions;

/** 题目总数（评分表满分项数 N） */
export const QUESTION_COUNT = questions.length;
