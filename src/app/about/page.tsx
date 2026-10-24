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
import { TITLE_TIERS } from "@/lib/scoring";

export const metadata: Metadata = {
  title: "评分方法",
  description: "评分规则、称号阈值、科学免责声明与数据来源说明。",
};

export default function AboutPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">评分方法</h1>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">评分规则</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm leading-relaxed text-muted-foreground">
          <ul className="list-disc space-y-1.5 pl-5">
            <li>
              共 {QUESTION_COUNT} 项（后续扩充到 27 项时规则不变），每项满分 100 分。
            </li>
            <li>
              每题两个选项各有一个分数（例如 100 / 70，100 / 90）。分数代表在本评分体系下
              “现代功能覆盖更好 / 健康风险更低 / 感觉运动处理更完整”的程度，
              <strong className="text-foreground">不代表医学上更高级</strong>。
            </li>
            <li>总分 = 全部 N 项得分的算术平均，保留 1 位小数。</li>
            <li>分类得分 = 该类别（感官与知觉 / 身体与自主神经 / 大脑与心理）下各项的平均分。</li>
            <li>对中性神经多样性（ASMR、联觉、绝对音感、心盲症等），两个选项给出接近的分数，避免把差异写成“缺陷”。</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">称号阈值</CardTitle>
          <CardDescription>按总分划分，仅为趣味标签</CardDescription>
        </CardHeader>
        <CardContent>
          <table className="w-full text-sm">
            <caption className="sr-only">称号与分数区间对照表</caption>
            <thead>
              <tr className="border-b text-left text-xs text-muted-foreground">
                <th scope="col" className="py-2 pr-4 font-medium">分数区间</th>
                <th scope="col" className="py-2 pr-4 font-medium">称号</th>
                <th scope="col" className="py-2 font-medium">说明</th>
              </tr>
            </thead>
            <tbody>
              {TITLE_TIERS.map((tier, i) => {
                const range =
                  i === 0
                    ? `${tier.min} – 100`
                    : tier.min === 0
                      ? "< 75"
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
            本站是纯静态站点：没有后端、没有登录、不使用 Cookie 追踪。答题进度与隐私偏好只保存在你自己浏览器的
            localStorage 中，清除浏览器数据即可全部删除。
          </p>
          <p>
            分享文本默认只包含各项得分（隐私保护模式）；只有你显式选择“包含差异明细”，才会附带每道题的选择。
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">数据来源 / 参考</CardTitle>
          <CardDescription>占位说明，正式版将逐题列出参考文献</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm leading-relaxed text-muted-foreground">
          <p>
            每道题的“来源备注”字段（sourceNote）用于标注该特质的科学出处，例如：OR6A2
            基因与香菜气味感知、ALDH2*2 变体与乙醛代谢、感觉冲突理论与晕动症、aphantasia/phantasia
            心象谱系研究、ASMR 流行率调查等。
          </p>
          <p>
            正式题目库扩充时，将在此处附上完整参考文献列表与评分依据说明。
          </p>
        </CardContent>
      </Card>

      <Disclaimer />
    </div>
  );
}
