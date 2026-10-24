"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "cn";
import { QUESTIONS } from "@/data/questions";
import { calculateResult } from "@/lib/scoring";
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
      {/* 总分 + 称号（hero figure：每个视图只有一个大数字） */}
      <Card>
        <CardContent className="flex flex-col items-center gap-2 py-8 text-center">
          <p className="text-sm text-muted-foreground">总分（满分 100）</p>
          <p className="text-6xl font-semibold tracking-tight sm:text-7xl">
            {result.totalScore}
          </p>
          <Badge variant="secondary" className="mt-2 px-3 py-1 text-sm">
            {result.titleInfo.title}
          </Badge>
          <p className="max-w-md text-sm text-muted-foreground">
            {result.titleInfo.blurb}
          </p>
        </CardContent>
      </Card>

      {/* 分类平均分：图表 + 文字表格视图（不依赖图表传达信息） */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">分类平均分</CardTitle>
          <CardDescription>三个维度各自的平均分（满分 100）</CardDescription>
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
                  <span className="text-sm font-semibold tabular-nums">
                    {item.score} 分
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground">{item.question}</p>
                <p className="mt-1 text-sm">
                  你的选择：<span className="font-medium">{item.selectedLabel}</span>
                </p>
                {/* 得分 meter：轨道与填充同一色阶（前景色的浅/深两步） */}
                <div
                  className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted"
                  role="meter"
                  aria-valuenow={item.score}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${item.title} 得分`}
                >
                  <div
                    className="h-full rounded-full bg-foreground"
                    style={{ width: `${item.score}%` }}
                  />
                </div>
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
