import type { Metadata } from "next";
import { ResultView } from "@/components/result-view";

export const metadata: Metadata = {
  title: "结果",
  description: "总分、称号、分类得分、分项明细与可分享的测评结果。",
};

export default function ResultPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold tracking-tight sm:text-2xl">你的测评结果</h1>
      <ResultView />
    </div>
  );
}
