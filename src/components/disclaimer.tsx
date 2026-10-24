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
            “100 分”仅表示在本评分体系下现代功能覆盖更好 / 风险更低 / 感觉运动处理更完整。
          </li>
        </ul>
      </AlertDescription>
    </Alert>
  );
}
