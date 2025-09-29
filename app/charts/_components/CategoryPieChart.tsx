import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import React, { useMemo, useState } from "react";
import { Spending } from "@prisma/client";
import { useSpendingStore } from "@/store/spendingStore";
import SpendingDetailModal from "./SpendingDetailModal";

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

function getMonthOptions(records: Spending[]) {
  const months = Array.from(
    new Set(
      records
        .map((record) => {
          const date = new Date(record.date);
          if (isNaN(date.getTime())) return null;
          return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
            2,
            "0"
          )}`;
        })
        .filter(Boolean)
    )
  );
  return months.sort().reverse();
}

export default function CategoryPieChart() {
  const spendingList = useSpendingStore((state) => state.spendingList);
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
      2,
      "0"
    )}`;
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCategoryData, setSelectedCategoryData] = useState<Spending[]>([]);
  const [modalTitle, setModalTitle] = useState("");

  const monthOptions = useMemo(
    () => getMonthOptions(spendingList),
    [spendingList]
  );

  // 월별로 필터링
  const filteredRecords = useMemo(() => {
    return spendingList.filter((record) => {
      const date = new Date(record.date);
      if (isNaN(date.getTime())) return false;
      const recordMonth = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;
      return recordMonth === selectedMonth;
    });
  }, [spendingList, selectedMonth]);

  const categoryData = filteredRecords
    .reduce((acc, record) => {
      const category = record.category || "기타";
      const existing = acc.find((item: any) => item.name === category);
      if (existing) {
        existing.value += record.amount;
      } else {
        acc.push({ name: category, value: record.amount });
      }
      return acc;
    }, [] as { name: string; value: number }[])
    .sort((a, b) => b.value - a.value);

  const handlePieClick = (data: any) => {
    const categoryName = data.name;
    const categorySpending = filteredRecords.filter(
      (record) => (record.category || "기타") === categoryName
    );
    setSelectedCategoryData(categorySpending);
    setModalTitle(`${categoryName} (${selectedMonth})`);
    setModalOpen(true);
  };

  if (categoryData.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
        </div>
        <p className="text-gray-500 font-medium mb-2">
          분석할 데이터가 없습니다
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        카테고리별 지출 분포
      </h2>
      <div className="mb-4">
        <label className="text-sm font-medium text-gray-700 mr-2">
          월 선택:
        </label>
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="px-2 py-1 border border-gray-300 rounded-md bg-white"
        >
          {monthOptions.map((month: string) => (
            <option key={month} value={month}>
              {month}
            </option>
          ))}
        </select>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={categoryData}
            cx="50%"
            cy="50%"
            innerRadius={40}
            outerRadius={80}
            paddingAngle={2}
            dataKey="value"
            onClick={handlePieClick}
            style={{ cursor: "pointer" }}
          >
            {categoryData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) => [
              `${value.toLocaleString()}원`,
              "지출액",
            ]}
            labelFormatter={(label) => `카테고리: ${label}`}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
        {categoryData.slice(0, 6).map((item, index) => (
          <div key={item.name} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            />
            <span className="truncate text-gray-900 font-medium">
              {item.name}
            </span>
            <span className="font-bold text-gray-900">
              {item.value.toLocaleString()}원
            </span>
          </div>
        ))}
      </div>
      
      <SpendingDetailModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={modalTitle}
        spendingList={selectedCategoryData}
      />
    </div>
  );
}
