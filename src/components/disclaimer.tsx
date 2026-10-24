import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

/**
 * 全站统一的免责声明。首页、结果页、关于页必须可见。
 */
export function Disclaimer({ className }: { className?: string }) {
  return (
    <Alert className={className}>
      <AlertTitle>免责声明</AlertTitle>
      <AlertDescription>
        <ul className="list-disc space-y-1 pl-4 text-sm leading-relaxed text-muted-foreground">
          <li>本测评是科普 / 娱乐内容，不是医学诊断，不评价生理优劣，也不提供治疗建议。</li>
          <li>所有特质都是连续谱，二选一只是简化；分数不代表你在医学上“更高级”。</li>
          <li>ASMR、联觉、绝对音感、心盲症等属于中性神经多样性，不是疾病或缺陷。</li>
          <li>
            每题的“好极”是<b>显式价值宣言</b>（依据层级：健康风险 &gt; 功能适应 &gt;
            感知带宽 &gt; 中性趣味），逐题标注在结果明细中，欢迎质疑。
          </li>
          <li>
            总分只是“好极加权完成度”，百分位只是相对于按人群频率模拟的假想人群——两者都不是健康评估。
          </li>
        </ul>
      </AlertDescription>
    </Alert>
  );
}
