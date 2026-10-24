"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "cn";
import { QUESTIONS } from "@/data/questions";
import { useAnswers, useMounted } from "@/lib/storage";
import { CATEGORY_META } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

/**
 * 逐题答题器：进度条 + 两个选项卡片 + 上一题/下一题。
 * 答案实时写入 localStorage（响应式 store），刷新后从第一道未答题恢复。
 * 全部答完才能进入结果页。
 */
export function QuizRunner() {
  const router = useRouter();
  const mounted = useMounted();
  const [answers, setAnswers] = useAnswers();
  // 用户手动导航后锁定题号；未导航时按“第一道未答题”派生（刷新即恢复进度）
  const [navOverride, setNavOverride] = useState<number | null>(null);

  if (!mounted) {
    // SSR/首帧占位，避免闪现空进度
    return (
      <p className="py-10 text-center text-sm text-muted-foreground" aria-busy="true">
        正在加载你的答题进度…
      </p>
    );
  }

  const firstUnanswered = QUESTIONS.findIndex((q) => answers[q.id] === undefined);
  const complete = firstUnanswered === -1;
  // 未完成：恢复时停在第一道未答题；已完成：回到第 1 题（配完成提示条），
  // 避免从导航栏进入时被扔在最后一题
  const derivedIndex = complete ? 0 : firstUnanswered;
  const current = Math.min(Math.max(navOverride ?? derivedIndex, 0), QUESTIONS.length - 1);

  const answeredCount = QUESTIONS.filter((q) => answers[q.id] !== undefined).length;
  const progressPercent = Math.round((answeredCount / QUESTIONS.length) * 100);
  const question = QUESTIONS[current];
  const selected = answers[question.id];
  const isLast = current === QUESTIONS.length - 1;

  function select(optionIndex: 0 | 1) {
    // 锁定当前位置，避免派生索引在作答后自动跳题
    setNavOverride(current);
    setAnswers({ ...answers, [question.id]: optionIndex });
  }

  function goNext() {
    if (selected === undefined) return;
    if (isLast) {
      // 最后一题：全部答完才能出结果
      if (complete) {
        router.push("/result");
      }
      return;
    }
    setNavOverride(Math.min(current + 1, QUESTIONS.length - 1));
  }

  function goPrev() {
    setNavOverride(Math.max(current - 1, 0));
  }

  function jumpToFirstUnanswered() {
    const idx = QUESTIONS.findIndex((q) => answers[q.id] === undefined);
    if (idx !== -1) setNavOverride(idx);
  }

  function clearAndRestart() {
    setAnswers({});
    setNavOverride(null); // 回到“第 1 题”的派生状态
  }

  return (
    <div className="space-y-4">
      {/* 进度 */}
      <div className="space-y-2">
        <div className="flex items-baseline justify-between text-sm">
          <span className="font-medium">
            第 {current + 1} / {QUESTIONS.length} 题
          </span>
          <span className="text-muted-foreground">
            已答 {answeredCount} 题（{progressPercent}%）
          </span>
        </div>
        <Progress
          value={progressPercent}
          aria-label={`答题进度：${answeredCount} / ${QUESTIONS.length} 题`}
        />
      </div>

      {/* 已完成状态提示条：查看结果或清空重做 */}
      {complete && (
        <div
          role="status"
          className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-primary/30 bg-accent/60 p-3 text-sm"
        >
          <span>你已答完全部 {QUESTIONS.length} 题，可以直接查看结果。</span>
          <div className="flex gap-2">
            <Button size="lg" className="h-8 px-3" onClick={() => router.push("/result")}>
              查看结果
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-8 px-3"
              onClick={clearAndRestart}
            >
              清空重做
            </Button>
          </div>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardDescription className="flex items-center gap-2">
            <Badge variant="secondary">{CATEGORY_META[question.category].label}</Badge>
            <span>{question.title}</span>
          </CardDescription>
          <CardTitle className="text-lg sm:text-xl">{question.question}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div role="radiogroup" aria-label={question.question} className="grid gap-3">
            {question.options.map((option, index) => {
              const isSelected = selected === index;
              return (
                <button
                  key={option.label}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => select(index as 0 | 1)}
                  className={cn(
                    "group flex w-full items-start gap-3 rounded-lg border p-4 text-left transition-colors",
                    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                    isSelected
                      ? "border-primary bg-accent"
                      : "border-border bg-card hover:border-foreground/40 hover:bg-accent/50",
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      "mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border",
                      isSelected ? "border-primary bg-primary" : "border-input",
                    )}
                  >
                    {isSelected && (
                      <span className="size-2 rounded-full bg-primary-foreground" />
                    )}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-medium sm:text-base">
                      {option.label}
                    </span>
                    {option.note && (
                      <span className="mt-1 block text-xs leading-relaxed text-muted-foreground sm:text-sm">
                        {option.note}
                      </span>
                    )}
                  </span>
                </button>
              );
            })}
          </div>

          {selected !== undefined && question.explanation && (
            <p className="rounded-md bg-muted/60 p-3 text-xs leading-relaxed text-muted-foreground sm:text-sm">
              <span className="font-medium text-foreground">小知识：</span>
              {question.explanation}
            </p>
          )}

          <div className="flex items-center justify-between gap-3 pt-1">
            <Button
              variant="outline"
              size="lg"
              className="h-10 px-5"
              onClick={goPrev}
              disabled={current === 0}
            >
              上一题
            </Button>
            <Button
              size="lg"
              className="h-10 px-5"
              onClick={goNext}
              disabled={selected === undefined}
            >
              {isLast ? "查看结果" : "下一题"}
            </Button>
          </div>
          {isLast && !complete && (
            <p className="text-center text-xs text-muted-foreground">
              还有题目未作答。
              <button
                type="button"
                className="underline focus-visible:outline-2 focus-visible:outline-offset-2"
                onClick={jumpToFirstUnanswered}
              >
                跳到第一道未答题
              </button>
              ，全部答完才能查看结果。
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
