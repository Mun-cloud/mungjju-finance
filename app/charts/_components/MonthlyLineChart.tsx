import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import React from "react";
import { useSpendingStore } from "@/store/spendingStore";

export default function MonthlyLineChart() {
  const spendingList = useSpendingStore((state) => state.spendingList);
  // 월별 지출 추이 데이터 계산
  const monthlyData = spendingList
    .reduce((acc, record) => {
      const date = new Date(record.date);
      const monthKey = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;
      const existing = acc.find((item: any) => item.month === monthKey);
      if (existing) {
        existing.amount += record.amount;
      } else {
        acc.push({ month: monthKey, amount: record.amount });
      }
      return acc;
    }, [] as { month: string; amount: number }[])
    .sort((a, b) => a.month.localeCompare(b.month));

  // 최근 1년(12개월) 데이터만 추출
  const last12MonthsData = monthlyData.slice(-12);

  if (last12MonthsData.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        월별 지출 추이 (최근 1년)
      </h2>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={last12MonthsData}>
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
          <Line
            type="monotone"
            dataKey="amount"
            stroke="#8884d8"
            strokeWidth={2}
            dot={{ fill: "#8884d8", strokeWidth: 2, r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
