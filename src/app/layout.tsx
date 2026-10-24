import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { SiteNav } from "@/components/site-nav";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "人类配置差异测评 | Human Variant Quiz",
    template: "%s | 人类配置差异测评",
  },
  description:
    "你是“究极人类”吗？同一种刺激，不同版本的大脑与身体。一个科普+娱乐向的二分式个体差异测评：晕 3D、吃香菜、喝酒脸红……测测你的配置版本。",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="zh-CN"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <SiteNav />
        <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-6 sm:py-10">
          {children}
        </main>
        <footer className="border-t">
          <div className="mx-auto flex max-w-3xl flex-col gap-3 px-4 py-6 text-xs text-muted-foreground">
            <div className="flex items-center justify-between gap-3">
              <p>
                科普 / 娱乐测评，非医学诊断 · 不评价生理优劣 · 所有特质都是连续谱
              </p>
              <div className="flex shrink-0 gap-3">
                <Link href="/about" className="underline hover:text-foreground">
                  评分方法
                </Link>
                <a
                  href="https://github.com/foXerw/human-variant-quiz"
                  className="underline hover:text-foreground"
                  target="_blank"
                  rel="noreferrer"
                >
                  源码
                </a>
              </div>
            </div>
            <p className="leading-relaxed">
              <strong className="font-medium text-foreground">隐私声明：</strong>
              本测评不保存任何答题记录——没有后端服务器、没有账号、不放置追踪
              Cookie，也不做持久化存储：答题进度只存在于当前标签页的会话内存
              （sessionStorage）中，<b>关闭标签页即彻底销毁</b>；刷新页面不丢进度，
              结果只是对会话内数据的实时计算，浏览器历史里也不会留下答案。
              分享文本由你手动复制发送，本站无法查看，也请避免在分享时附带可识别个人的信息。
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
