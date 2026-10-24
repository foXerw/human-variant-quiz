import Link from "next/link";

/** 顶部导航（所有页面共用，键盘可 Tab 聚焦） */
export function SiteNav() {
  return (
    <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <nav
        aria-label="主导航"
        className="mx-auto flex h-14 max-w-3xl items-center justify-between gap-2 px-4"
      >
        <Link
          href="/"
          className="text-sm font-semibold tracking-tight hover:underline focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          人类配置差异测评
        </Link>
        <div className="flex items-center gap-1 text-sm">
          <Link
            href="/quiz"
            className="rounded-md px-3 py-1.5 font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            测评
          </Link>
          <Link
            href="/about"
            className="rounded-md px-3 py-1.5 font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            评分方法
          </Link>
        </div>
      </nav>
    </header>
  );
}
