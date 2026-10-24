"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { CategoryScore } from "@/lib/types";

/**
 * 分类平均分横向条形图。
 * dataviz 规范：单系列量级对比 → 单色横向条形图；无图例（标题即说明）；
 * 数值直接标注在条形末端（文本用 text token，不穿数据色）；
 * 细条（≤24px）、数据端 4px 圆角、基线方角；网格线为发丝级实线；
 * 每根条形有 hover tooltip；页面另配文字表格视图，不依赖图表传达信息。
 */
export function CategoryChart({ categories }: { categories: CategoryScore[] }) {
  const height = Math.max(160, categories.length * 56 + 40);

  return (
    <div
      className="w-full"
      style={{ height }}
      role="img"
      aria-label={categories
        .map((c) => `${c.label} ${c.average} 分（共 ${c.count} 题）`)
        .join("，")}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={categories}
          layout="vertical"
          margin={{ top: 4, right: 48, bottom: 4, left: 4 }}
          barCategoryGap="32%"
        >
          <CartesianGrid
            horizontal={false}
            stroke="var(--border)"
            strokeDasharray="none"
          />
          <XAxis
            type="number"
            domain={[0, 100]}
            ticks={[0, 20, 40, 60, 80, 100]}
            tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            type="category"
            dataKey="label"
            width={92}
            tick={{ fontSize: 12, fill: "var(--foreground)" }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            cursor={{ fill: "var(--muted)" }}
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const c = payload[0].payload as CategoryScore;
              return (
                <div className="rounded-md border bg-popover px-3 py-2 text-sm text-popover-foreground shadow-md">
                  <p className="font-medium">{c.label}</p>
                  <p className="text-muted-foreground">
                    平均分 <span className="font-semibold text-foreground">{c.average}</span> / 100
                    （共 {c.count} 题）
                  </p>
                </div>
              );
            }}
          />
          <Bar
            dataKey="average"
            fill="var(--primary)"
            barSize={18}
            radius={[0, 4, 4, 0]}
            isAnimationActive={false}
          >
            <LabelList
              dataKey="average"
              position="right"
              offset={8}
              style={{ fontSize: 12, fontWeight: 600, fill: "var(--foreground)" }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
