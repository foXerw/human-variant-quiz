"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "cn";
import { QUESTIONS } from "@/data/questions";
import { calculateResult, formatOdds } from "@/lib/scoring";
import { useAnswers, useMounted } from "@/lib/storage";
import { CATEGORY_META } from "@/lib/types";
import { Disclaimer } from "@/components/disclaimer";
import { CategoryChart } from "@/components/category-chart";
import { SharePanel } from "@/components/share-panel";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

/**
 * 结果页主体：localStorage（响应式 store）→ calculateResult →
 * 总分 + 称号 + 分类图表 + 分项明细 + 分享 + 重测。
 * 未答完（或直接访问）时拦截并引导回 /quiz。
 */
export function ResultView() {
  const router = useRouter();
  const mounted = useMounted();
  const [answers, setAnswers] = useAnswers();
  const result = mounted ? calculateResult(answers, QUESTIONS) : null;

  function restart() {
    setAnswers({});
    router.push("/quiz");
  }

  if (!mounted) {
    return (
      <p className="py-10 text-center text-sm text-muted-foreground" aria-busy="true">
        正在计算你的结果…
      </p>
    );
  }

  if (!result) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>还没有可展示的结果</CardTitle>
          <CardDescription>
            需要先答完全部 {QUESTIONS.length} 道题才能计算总分。进度会自动保存，随时可以继续。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/quiz" className={cn(buttonVariants({ size: "lg" }), "h-10 px-6")}>
            继续测评
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* 完成度 + 称号（hero figure：每个视图只有一个大数字） */}
      <Card>
        <CardContent className="flex flex-col items-center gap-2 py-8 text-center">
          <p className="text-sm text-muted-foreground">配置完成度（全部好极 = 100）</p>
          <p className="text-6xl font-semibold tracking-tight sm:text-7xl">
            {result.totalScore}
          </p>
          <p className="text-sm font-medium">
            常模百分位：超过 {result.percentile}% 的模拟人类
          </p>
          <Badge variant="secondary" className="mt-2 px-3 py-1 text-sm">
            {result.titleInfo.title}
          </Badge>
          <p className="max-w-md text-sm text-muted-foreground">
            {result.titleInfo.blurb}
          </p>
          <p className="max-w-md text-xs text-muted-foreground/80">
            按各特质的人群频率估算，随机出现“全部好极”配置的概率约为{" "}
            {formatOdds(result.perfectProbability)}。
          </p>
        </CardContent>
      </Card>

      {/* 分类平均分：图表 + 文字表格视图（不依赖图表传达信息） */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">分类完成度</CardTitle>
          <CardDescription>
            三个维度各自的加权完成度（全部好极 = 100）
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <CategoryChart categories={result.categories} />
          <dl className="grid gap-2 text-sm sm:grid-cols-3">
            {result.categories.map((c) => (
              <div key={c.category} className="rounded-md bg-muted/60 p-3">
                <dt className="text-xs text-muted-foreground">
                  {c.label}（{c.count} 题）
                </dt>
                <dd className="mt-1 text-xl font-semibold tabular-nums">{c.average}</dd>
              </div>
            ))}
          </dl>
        </CardContent>
      </Card>

      {/* 分项明细 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">分项明细（{result.totalCount} 项）</CardTitle>
          <CardDescription>题目、你的选择、得分与简短解释</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {result.items.map((item) => (
              <li key={item.questionId}>
                <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                  <h3 className="text-sm font-semibold">
                    {item.title}
                    <span className="ml-2 text-xs font-normal text-muted-foreground">
                      {CATEGORY_META[item.category].label}
                    </span>
                  </h3>
                  <span className="flex items-center gap-1.5">
                    <Badge variant={item.isGood ? "default" : "outline"}>
                      {item.isGood ? "好极 ✓" : "对照极"}
                    </Badge>
                    <span
                      className="text-xs text-muted-foreground tabular-nums"
                      title="该题权重（由依据层级决定：风险 3 / 功能 2 / 带宽 1 / 中性 1）"
                    >
                      权重 ×{item.weight}
                    </span>
                  </span>
                </div>
                <p className="mt-1.5">
                  <Badge variant="secondary" className="font-normal">
                    依据：{item.rationaleLabel}
                  </Badge>
                  <span className="ml-2 text-xs text-muted-foreground tabular-nums">
                    好极人群频率 ≈ {Math.round(item.goodFrequency * 100)}%
                  </span>
                </p>
                <p className="mt-1.5 text-xs text-muted-foreground">{item.question}</p>
                <p className="mt-1 text-sm">
                  你的选择：<span className="font-medium">{item.selectedLabel}</span>
                </p>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  {item.explanation}
                </p>
                {item.sourceNote && (
                  <p className="mt-1 text-xs text-muted-foreground/80">
                    来源备注：{item.sourceNote}
                  </p>
                )}
                <Separator className="mt-4" />
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <SharePanel result={result} />

      <Disclaimer />

      <div className="flex flex-wrap items-center justify-center gap-3 pb-4">
        <Button variant="outline" size="lg" className="h-10 px-6" onClick={restart}>
          重新测试
        </Button>
        <Link
          href="/about"
          className={cn(buttonVariants({ variant: "ghost", size: "lg" }), "h-10 px-6")}
        >
          查看评分方法
        </Link>
      </div>
    </div>
  );
}
