import React from "react";

interface PersonalCategoryTableProps {
  expanded: boolean;
  onToggle: () => void;
  data: Record<string, Record<string, number>>;
}

export default function PersonalCategoryTable({
  expanded,
  onToggle,
  data,
}: PersonalCategoryTableProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors duration-150"
      >
        <h2 className="text-lg font-semibold text-gray-900">
          개인별 카테고리별 지출 표
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
            {Object.keys(data).length === 0 && (
              <div className="text-center py-8 text-gray-500">
                이번달 지출 데이터가 없습니다
              </div>
            )}
            {Object.entries(data).map(([role, categories]) => {
              const roleTotal = Object.values(categories).reduce(
                (sum, amount) => sum + amount,
                0
              );
              const roleData = Object.entries(categories)
                .sort(([, a], [, b]) => b - a)
                .map(([name, value]) => ({ name, value }));
              return (
                <div key={role} className="mb-6 last:mb-0">
                  <div className="px-4 py-2 bg-gray-50 border-b border-gray-100 mb-2">
                    <h3 className="text-sm font-medium text-gray-700">
                      {role === "husband" ? "🐶뭉" : "🐰쭈"} (총{" "}
                      {roleTotal.toLocaleString()}원)
                    </h3>
                  </div>
                  <table className="w-full">
                    <thead className="bg-gray-25">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          카테고리
                        </th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          금액
                        </th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          비율
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {roleData.map((item) => (
                        <tr key={item.name} className="hover:bg-gray-50">
                          <td className="px-4 py-2 text-sm font-medium text-gray-900">
                            {item.name}
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-900 text-right">
                            {item.value.toLocaleString()}원
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-500 text-right">
                            {roleTotal > 0
                              ? ((item.value / roleTotal) * 100).toFixed(1)
                              : 0}
                            %
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
