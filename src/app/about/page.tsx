import type { Metadata } from "next";
import { Disclaimer } from "@/components/disclaimer";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { QUESTION_COUNT } from "@/data/questions";
import { RATIONALE_LABELS, RATIONALE_WEIGHTS, TITLE_TIERS } from "@/lib/scoring";
import type { Rationale } from "@/lib/types";

export const metadata: Metadata = {
  title: "评分方法",
  description: "评分框架（好极宣言 + 加权完成度 + 常模百分位）、称号阈值与隐私说明。",
};

const RATIONALE_ORDER: Rationale[] = ["risk", "function", "bandwidth", "neutral"];

const RATIONALE_NOTES: Record<Rationale, string> = {
  risk: "有流行病学/安全证据的风险差异（如酒精脸红与食管癌风险）",
  function: "现代环境中的功能适应差异（如脸盲影响社交识别）",
  bandwidth: "感知/认知带宽增益，无对应损失（如联觉、绝对音感）",
  neutral: "无客观差异，好极宣言属趣味/文化性质（如光喷嚏反射）",
};

export default function AboutPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">评分方法</h1>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">框架：方向与程度分离</CardTitle>
          <CardDescription>
            这套评分不做“每题手填分数”——那是拍脑袋。它把价值判断压缩到最小、可审计的形式：
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm leading-relaxed text-muted-foreground">
          <ul className="list-disc space-y-1.5 pl-5">
            <li>
              <strong className="text-foreground">方向（哪一极是“好”）</strong>
              ：每题一个显式宣言（goodOption）。这是无法回避的价值判断，我们选择把它摆在明面上，逐题标注依据层级，欢迎质疑。
            </li>
            <li>
              <strong className="text-foreground">程度（好值多少）</strong>
              ：不手填，由两个客观量决定——依据层级的权重（下表）与好极的人群频率（用于百分位）。
            </li>
            <li>
              当“风险”与“功能”指向不同方向时，按词典序裁决：
              <strong className="text-foreground">风险 &gt; 功能 &gt; 带宽 &gt; 中性</strong>
              （借用公共卫生测量的既有优先级：疾病/伤残负担重于功能不便，功能不便重于增益，增益重于偏好）。
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">依据层级与权重</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full text-sm">
            <caption className="sr-only">依据层级、权重与说明对照表</caption>
            <thead>
              <tr className="border-b text-left text-xs text-muted-foreground">
                <th scope="col" className="py-2 pr-4 font-medium">层级</th>
                <th scope="col" className="py-2 pr-4 font-medium">权重</th>
                <th scope="col" className="py-2 font-medium">含义</th>
              </tr>
            </thead>
            <tbody>
              {RATIONALE_ORDER.map((r) => (
                <tr key={r} className="border-b last:border-0">
                  <td className="py-2 pr-4 font-medium">{RATIONALE_LABELS[r]}</td>
                  <td className="py-2 pr-4 tabular-nums">×{RATIONALE_WEIGHTS[r]}</td>
                  <td className="py-2 text-muted-foreground">{RATIONALE_NOTES[r]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">两个输出数字</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm leading-relaxed text-muted-foreground">
          <p>
            <strong className="text-foreground">① 配置完成度（总分）</strong> =
            Σ(权重 × 是否落在好极) ÷ 总权重 × 100，保留 1 位小数。共 {QUESTION_COUNT}{" "}
            项，全部落在好极 = 恰好 100，即字面意义的“究极人类”。分类得分同理，按类别内加权计算。
          </p>
          <p>
            <strong className="text-foreground">② 常模百分位</strong> =
            超过百分之多少的“模拟人类”。以每题好极的人群频率（goodFrequency，全球粗估）构造加权泊松二项分布，用动态规划精确求解（非抽样模拟），再按中位秩约定计算你的百分位。稀有的好极（如绝对音感 ≈0.5%）在完成度里只算一票，但会让“拥有它”在百分位上真正值钱。
          </p>
          <p className="text-xs">
            注意：好极频率高度依赖参照人群（如乳糖耐受在北欧 &gt;90%、东亚 &lt;30%；ALDH2
            脸红在东亚 30%–50%、欧洲罕见）。本站统一采用全球粗估并在每题“来源备注”里说明，百分位应理解为量级而非精确值。
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">称号阈值</CardTitle>
          <CardDescription>
            挂在配置完成度上，按模拟人群分布校准（当前 39 题：均值 ≈61.6，σ ≈7.3；73 ≈ 前 6%，62 ≈
            前 50%，51 ≈ 前 93%）
          </CardDescription>
        </CardHeader>
        <CardContent>
          <table className="w-full text-sm">
            <caption className="sr-only">称号与完成度区间对照表</caption>
            <thead>
              <tr className="border-b text-left text-xs text-muted-foreground">
                <th scope="col" className="py-2 pr-4 font-medium">完成度区间</th>
                <th scope="col" className="py-2 pr-4 font-medium">称号</th>
                <th scope="col" className="py-2 font-medium">说明</th>
              </tr>
            </thead>
            <tbody>
              {TITLE_TIERS.map((tier, i) => {
                const range =
                  tier.min === 100
                    ? "100（全部好极）"
                    : i === 0
                      ? `${tier.min} – 100`
                      : tier.min === 0
                        ? `< ${TITLE_TIERS[i - 1].min}`
                        : `${tier.min} – ${TITLE_TIERS[i - 1].min - 0.1}`;
                return (
                  <tr key={tier.title} className="border-b last:border-0">
                    <td className="py-2 pr-4 tabular-nums">{range}</td>
                    <td className="py-2 pr-4 font-medium">{tier.title}</td>
                    <td className="py-2 text-muted-foreground">{tier.blurb}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">隐私与数据</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm leading-relaxed text-muted-foreground">
          <p>
            本站是纯静态站点：没有后端、没有登录、不放置 Cookie，<b className="text-foreground">也不做任何持久化存储</b>。
            答题进度保存在当前标签页的会话内存（sessionStorage）里：刷新与页面跳转不丢进度，
            <b className="text-foreground">关闭标签页即被浏览器自动销毁</b>，你的设备上不会留下可翻查的答案历史。
            “重新测试”则即刻清空。
          </p>
          <p>
            为什么不用 localStorage？它能支持“隔天继续答”，但代价是完整答案档案长期驻留本地，
            直到手动清除——对一个匿名娱乐测评，这是负债而非功能。同类产品的通行做法也是如此：
            娱乐测评（BuzzFeed 型）只在页面内存中持答案、结果按会话生成；专业心理自测多用服务端匿名会话并附伦理声明；
            隐私优先的静态测评普遍选择零持久化或会话级存储。
          </p>
          <p>
            历史说明：v1/v2 版本曾使用 localStorage，切换到会话级存储时会自动清除这些遗留数据。
          </p>
          <p>
            分享文本默认只包含完成度、百分位与分类得分（隐私保护模式）；只有你显式选择“包含差异明细”，才会附带每道题的选择——发什么、发到哪里，完全由你复制粘贴的那一刻决定。
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">数据来源 / 参考</CardTitle>
          <CardDescription>逐题依据见结果页“来源备注”字段</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm leading-relaxed text-muted-foreground">
          <p>
            每题的人群频率与解释基于公开文献的粗略量级：OR6A2 与香菜气味感知、ALDH2*2
            与乙醛代谢、CYP1A2/ADORA2A 与咖啡因代谢、MC1R 与皮肤光型、ABCC11
            与耳垢类型、TAS2R38 与苦味敏感、心象谱系（aphantasia ≈1%–4%）、发展性脸盲
            ≈2.5%、血管迷走性晕厥终生发生率 ≈22%、睡眠瘫痪终生患病率 ≈7.6% 等。
          </p>
          <p>
            这些数字是<strong className="text-foreground">量级估计而非精确参数</strong>，且随参照人群变化；本题库不提供逐条文献引注，正式版将补齐。相对 v1
            数据的修订记录（合并重复题、翻转睡眠时型好极、修正氢氰酸频率、删除体味的“社交成本”表述等）见
            <code className="mx-1 rounded bg-muted px-1 py-0.5 text-xs">src/data/questions.ts</code>
            头部注释。
          </p>
        </CardContent>
      </Card>

      <Disclaimer />
    </div>
  );
}
