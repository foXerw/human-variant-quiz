# Human Variant Quiz / 人类配置差异测评

> 你是“究极人类”吗？——同一种刺激，不同版本的大脑与身体。

一个科普 + 娱乐向的**二分式个体差异测评**静态网站：回答 N 道二选一题目，按“每项满分 100 分”的评分表计算平均分，生成总分、称号、分类得分、分项明细与可复制的分享文本。

## 免责声明（重要）

- 本测评是**科普 / 娱乐内容，不是医学诊断**，不评价生理优劣，不提供治疗建议。
- 所有特质都是**连续谱**，二选一只是简化。
- “100 分”仅代表在本评分体系下“现代功能覆盖更好 / 风险更低 / 感觉运动处理更完整”，**不代表医学上更高级**。
- 中性神经多样性（ASMR、联觉、绝对音感、心盲症等）**不是疾病或缺陷**。
- 免责声明在首页、测评结果页、关于页均显著展示。

## 技术栈

| 层 | 选型 |
|---|---|
| 框架 | Next.js（App Router）+ TypeScript，纯静态输出，无后端 / 无登录 / 不收集用户数据 |
| 样式 | Tailwind CSS v4 + shadcn/ui |
| 图表 | Recharts（分类平均分横向条形图） |
| 持久化 | localStorage（答题进度 + 分享隐私偏好，仅存于用户浏览器） |
| 测试 | Vitest（评分纯函数单元测试） |
| 部署 | Vercel（标准 Next.js 部署） |

## 本地运行

```bash
npm install
npm run dev      # http://localhost:3000
```

其他命令：

```bash
npm test         # 运行评分函数单元测试（vitest run）
npm run test:watch
npm run build    # 生产构建
npm run lint
```

## 部署到 Vercel（标准方式）

1. 将仓库推送到 GitHub（本仓库：`foXerw/human-variant-quiz`）。
2. 在 [vercel.com](https://vercel.com) → Add New Project → Import 该仓库。
3. Framework Preset 自动识别为 Next.js，无需任何额外配置，直接 Deploy。

## 项目结构

```
src/
├── app/
│   ├── layout.tsx          # 全局布局：导航、页脚免责声明
│   ├── page.tsx            # 首页：介绍 + 免责声明 + 开始测评
│   ├── quiz/page.tsx       # 测评页（逐题 + 进度条 + localStorage 恢复）
│   ├── result/page.tsx     # 结果页（总分/称号/图表/明细/分享/重测）
│   ├── about/page.tsx      # 关于页：评分方法、阈值、隐私、参考占位
│   └── globals.css
├── components/
│   ├── quiz-runner.tsx     # 答题器（客户端组件）
│   ├── result-view.tsx     # 结果视图（客户端组件）
│   ├── category-chart.tsx  # Recharts 分类条形图
│   ├── share-panel.tsx     # 分享文本 + 隐私开关 + 复制
│   ├── disclaimer.tsx      # 全站统一免责声明
│   ├── site-nav.tsx        # 顶部导航
│   └── ui/                 # shadcn/ui 基础组件
├── data/
│   └── questions.ts        # 题目数据（与 UI 完全解耦，当前 28 条）
└── lib/
    ├── types.ts            # Category / Question / Option / Answers / QuizResult 等类型
    ├── scoring.ts          # calculateResult 等纯函数 + 称号阈值 + 分享文本生成
    ├── scoring.test.ts     # 单元测试（11 个用例）
    └── storage.ts          # localStorage 读写封装
```

## 评分方法

- 共 N 项，每项满分 100；每题两个选项各有分数（如 100 / 70）。
- **总分** = N 项得分的算术平均，保留 1 位小数。
- **分类得分** = 该类别下各项平均分（三个类别：`sensory` 感官与知觉 / `body` 身体与自主神经 / `brain` 大脑与心理）。
- 核心评分函数是纯函数：`calculateResult(answers, questions)`，答题不完整时返回 `null`（结果页据此拦截，“全部答完才能出结果”）。

### 称号阈值

按当前题库的**实际可达分布**校准（可达区间 [77.5, 100]，均匀随机作答均值 ≈88.8）：

| 分数区间 | 称号 |
|---|---|
| 95 – 100 | 究极人类候选 |
| 91 – 94.9 | 高配多面手 |
| 87 – 90.9 | 标准高配 |
| 83 – 86.9 | 特色配置型 |
| < 83 | 极端偏科型 |

> ⚠️ 替换题目分值后必须重新校准阈值，否则称号失去区分度。
> 校准方法见 `src/lib/scoring.ts` 中 `TITLE_TIERS` 的注释。

## 扩充题目

题目数据与 UI 解耦：只需向 `src/data/questions.ts` 的数组追加符合 `Question` 类型的对象，评分、答题页、结果页、分享文本全部自动适配，**无需改动任何 UI 代码**（改分值分布后记得重新校准称号阈值）。

## 隐私保护

- 站点不收集、不上传任何数据；进度只存 localStorage。
- 分享文本提供两档隐私级别：
  - **只公开得分（默认）**：总分、称号、分类平均分；
  - **包含差异明细**：额外列出每题的选项与得分。
- 选择会保存在本地，下次访问保持。

## 可访问性

- 移动端优先，桌面端自适应。
- 选项为 `role="radiogroup"` / `role="radio"`，可 Tab 聚焦、Enter/Space 选择，带 `aria-checked`。
- 进度条、meter、图表均有 ARIA 标签；图表配有文字表格视图，不依赖颜色/动画传达信息。
- 复制成功反馈使用 `aria-live="polite"`。
