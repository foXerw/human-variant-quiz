import type { Metadata } from "next";
import { QuizRunner } from "@/components/quiz-runner";

export const metadata: Metadata = {
  title: "测评",
  description: "回答二选一题目，进度自动保存在你的浏览器里。",
};

export default function QuizPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold tracking-tight sm:text-2xl">人类配置差异测评</h1>
      <QuizRunner />
    </div>
  );
}
