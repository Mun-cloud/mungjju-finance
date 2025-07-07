import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import React from "react";
import { useSpendingStore } from "@/store/spendingStore";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884D8",
  "#82CA9D",
  "#FFC658",
  "#FF6B6B",
];

export default function CategoryMonthlyBarChart() {
  const spendingList = useSpendingStore((state) => state.spendingList);
  // 카테고리별 월별 비교 데이터 계산
  const categoryMonthlyData = spendingList
    .reduce((acc, record) => {
      const date = new Date(record.date);
      const monthKey = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;
      const category = record.category || record.category || "기타";
      let monthData = acc.find((item: any) => item.month === monthKey);
      if (!monthData) {
        monthData = { month: monthKey };
        acc.push(monthData);
      }
      monthData[category] = (monthData[category] || 0) + record.amount;
      return acc;
    }, [] as any[])
    .sort((a, b) => a.month.localeCompare(b.month));

  // 상위 4개 카테고리만 추출
  const allCategories = Array.from(
    new Set(spendingList.map((r) => r.category || "기타"))
  );
  const topCategories = allCategories.slice(0, 4);

  if (categoryMonthlyData.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        카테고리별 월별 비교
      </h2>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={categoryMonthlyData.slice(-6)}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="month"
            tickFormatter={(value) => {
              const [, month] = value.split("-");
              return `${month}월`;
            }}
          />
          <YAxis
            tickFormatter={(value) => `${(value / 10000).toFixed(0)}만원`}
          />
          <Tooltip
            formatter={(value: number) => [
              `${value.toLocaleString()}원`,
              "지출액",
            ]}
            labelFormatter={(label) => {
              const [year, month] = label.split("-");
              return `${year}년 ${month}월`;
            }}
          />
          <Legend />
          {topCategories.map((category, index) => (
            <Bar
              key={category}
              dataKey={category}
              fill={COLORS[index % COLORS.length]}
              stackId="a"
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
