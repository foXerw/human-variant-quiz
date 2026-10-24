"use client";

import { useState } from "react";
import { cn } from "cn";
import { generateShareText } from "@/lib/scoring";
import { usePrivacy } from "@/lib/storage";
import type { QuizResult, SharePrivacy } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

/**
 * 复制分享文本。隐私优先：默认只公开各项得分，
 * 用户显式切换到“包含差异明细”后才会带上每题的选择。
 * 隐私偏好保存在 localStorage，下次访问保持。
 */
export function SharePanel({ result }: { result: QuizResult }) {
  const [privacy, setPrivacy] = usePrivacy();
  const [copied, setCopied] = useState(false);
  const text = generateShareText(result, privacy);

  function changePrivacy(p: SharePrivacy) {
    setPrivacy(p);
    setCopied(false);
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // 剪贴板 API 不可用（旧浏览器/非安全上下文）时退回选中复制
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
      } catch {
        /* ignore */
      }
      document.body.removeChild(ta);
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2500);
  }

  const modes: { value: SharePrivacy; label: string; hint: string }[] = [
    { value: "scores", label: "只公开得分", hint: "默认：不暴露每题的选择" },
    { value: "details", label: "包含差异明细", hint: "会列出题目与你选的选项" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">分享结果</CardTitle>
        <CardDescription>
          选择公开范围后复制文本。数据只在你自己的浏览器里，本站不收集任何信息。
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          role="radiogroup"
          aria-label="分享隐私级别"
          className="grid gap-2 sm:grid-cols-2"
        >
          {modes.map((mode) => (
            <button
              key={mode.value}
              type="button"
              role="radio"
              aria-checked={privacy === mode.value}
              onClick={() => changePrivacy(mode.value)}
              className={cn(
                "rounded-lg border p-3 text-left transition-colors",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                privacy === mode.value
                  ? "border-primary bg-accent"
                  : "border-border hover:bg-accent/50",
              )}
            >
              <span className="block text-sm font-medium">{mode.label}</span>
              <span className="mt-0.5 block text-xs text-muted-foreground">
                {mode.hint}
              </span>
            </button>
          ))}
        </div>
        <pre
          aria-label="分享文本预览"
          className="max-h-48 overflow-auto rounded-md bg-muted p-3 text-xs leading-relaxed whitespace-pre-wrap text-muted-foreground"
        >
          {text}
        </pre>
        <div className="flex items-center gap-3">
          <Button size="lg" className="h-10 px-6" onClick={copy}>
            复制分享文本
          </Button>
          <span aria-live="polite" className="text-sm text-muted-foreground">
            {copied ? "已复制到剪贴板 ✓" : ""}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
