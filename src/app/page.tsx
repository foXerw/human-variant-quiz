import Link from "next/link";
import { cn } from "cn";
import { Disclaimer } from "@/components/disclaimer";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { QUESTION_COUNT } from "@/data/questions";

export default function HomePage() {
  return (
    <div className="space-y-8">
      <section className="space-y-4 pt-4 text-center sm:pt-10">
        <p className="text-sm font-medium tracking-widest text-muted-foreground">
          HUMAN VARIANT QUIZ
        </p>
        <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">
          你是“究极人类”吗？
        </h1>
        <p className="mx-auto max-w-xl text-base text-muted-foreground sm:text-lg">
          同一种刺激，不同版本的大脑与身体。
          <br className="hidden sm:block" />
          香菜是香的还是肥皂味的？酒后面不改色还是立刻上脸？闭上眼能不能“看”到一只苹果？
        </p>
        <div className="flex flex-col items-center justify-center gap-3 pt-2 sm:flex-row">
          <Link
            href="/quiz"
            className={cn(buttonVariants({ size: "lg" }), "h-11 px-8 text-base")}
          >
            开始测评
          </Link>
          <Link
            href="/about"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "h-11 px-8 text-base"
            )}
          >
            查看评分方法
          </Link>
        </div>
      </section>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">这个测评是什么</CardTitle>
          <CardDescription>
            {QUESTION_COUNT} 道二选一题目 · 约 2 分钟 · 进度自动保存，刷新不丢
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm leading-relaxed text-muted-foreground">
          <p>
            回答一组关于感官、身体与大脑的二选一问题，系统按“每项满分 100
            分”的评分表计算平均分，生成你的总分、称号、分类得分与分项明细，还可以复制一段分享文本。
          </p>
          <p>
            数据只保存在你自己的浏览器里（localStorage）。没有登录、没有后端、不收集任何信息。
          </p>
        </CardContent>
      </Card>

      <Disclaimer />
    </div>
  );
}
