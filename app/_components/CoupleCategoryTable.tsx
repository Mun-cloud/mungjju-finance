import React from "react";

interface CoupleCategoryTableProps {
  expanded: boolean;
  onToggle: () => void;
  data: { name: string; value: number }[];
  total: number;
}

export default function CoupleCategoryTable({
  expanded,
  onToggle,
  data,
  total,
}: CoupleCategoryTableProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors duration-150"
      >
        <h2 className="text-lg font-semibold text-gray-900">
          뭉쭈 합산 카테고리별 지출 표
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
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    카테고리
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    금액
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    비율
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data
                  .sort((a, b) => b.value - a.value)
                  .map((item) => (
                    <tr key={item.name} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        {item.name}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 text-right">
                        {item.value.toLocaleString()}원
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500 text-right">
                        {total > 0
                          ? ((item.value / total) * 100).toFixed(1)
                          : 0}
                        %
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
