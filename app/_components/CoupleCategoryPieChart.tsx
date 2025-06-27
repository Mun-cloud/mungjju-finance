import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import React from "react";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884D8",
  "#82CA9D",
  "#FFC658",
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
];

interface CoupleCategoryPieChartProps {
  expanded: boolean;
  onToggle: () => void;
  data: { name: string; value: number }[];
}

export default function CoupleCategoryPieChart({
  expanded,
  onToggle,
  data,
}: CoupleCategoryPieChartProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors duration-150"
      >
        <h2 className="text-lg font-semibold text-gray-900">
          뭉쭈 합산 카테고리별 지출 그래프
        </h2>
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
            expanded ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      {expanded && (
        <div className="px-4 pb-4">
          {data.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    isAnimationActive={false}
                  >
                    {data.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => `${Number(value).toLocaleString()}원`}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                {data
                  .sort((a, b) => b.value - a.value)
                  .map((item, index) => (
                    <div key={item.name} className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{
                          backgroundColor: COLORS[index % COLORS.length],
                        }}
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
            </>
          ) : (
            <div className="text-center py-8 text-gray-500">
              이번달 지출 데이터가 없습니다
            </div>
          )}
        </div>
      )}
    </div>
  );
}
