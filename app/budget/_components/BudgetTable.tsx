import { Spending } from "@prisma/client";

interface BudgetTableProps {
  budgets: Array<{ category: string; amount: number }>;
  spendingByCategory: Record<string, number>;
  totalSpentThisMonth: number;
  onRowClick: (category: string) => void;
}

export default function BudgetTable({
  budgets,
  spendingByCategory,
  totalSpentThisMonth,
  onRowClick,
}: BudgetTableProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden text-black">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-4 py-2 text-left">항목</th>
            <th className="px-4 py-2 text-right">예산</th>
            <th className="px-4 py-2 text-right">현재 지출</th>
            <th className="px-4 py-2 text-right">잔여 예산</th>
          </tr>
        </thead>
        <tbody>
          {budgets.map(({ category, amount }) => {
            // '전체' 카테고리일 때만 전체 합계 사용
            const spent =
              category === "전체"
                ? totalSpentThisMonth
                : spendingByCategory[category] || 0;
            const remain = amount - spent;
            
            return (
              <tr
                key={category}
                onClick={() => onRowClick(category)}
                className="cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <td className="px-3 py-3 font-medium">{category}</td>
                <td className="px-3 py-3 text-right">
                  {amount.toLocaleString()}원
                </td>
                <td
                  className={`px-3 py-3 text-right ${
                    spent > amount ? "text-red-500 font-bold" : ""
                  }`}
                >
                  {spent.toLocaleString()}원
                </td>
                <td
                  className={`px-3 py-3 text-right ${
                    remain < 0 ? "text-red-500 font-bold" : ""
                  }`}
                >
                  {remain.toLocaleString()}원
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}