"use client";

import Layout from "@/components/Layout";
import { useSpendingStore } from "@/store/spendingStore";
import { useState, useMemo } from "react";

// 예산 항목과 금액(원하는 값으로 수정 가능)
const BUDGETS = [
  { category: "식비", amount: 600000 },
  { category: "교통비", amount: 70000 },
  { category: "생활비", amount: 750000 },
  { category: "차량유지비", amount: 130000 },
  { category: "데이트", amount: 300000 },
  //   { category: "공과금", amount: 120000 },
  { category: "용돈", amount: 350000 },
  { category: "건강", amount: 70000 },
  { category: "가족", amount: 100000 },
  { category: "보험", amount: 250000 },
  { category: "경조사", amount: 150000 },
  { category: "기타", amount: 435000 },
  // { category: "여행", amount: 200000 },
  { category: "전체", amount: 2770000 },
];

function getCurrentMonth() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

export default function BudgetPage() {
  const total = useSpendingStore((state) => state.total);
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());

  // 예산에 포함된 카테고리 목록(기타 제외)
  const budgetCategories = BUDGETS.filter((b) => b.category !== "기타").map(
    (b) => b.category
  );

  // 월별, 카테고리별 지출 합계 계산 (기타 포함)
  const spendingByCategory = useMemo(() => {
    const result: Record<string, number> = {};
    let etcSum = 0;
    total.forEach((record) => {
      const recordDate = new Date(record.s_date);
      const recordMonth = `${recordDate.getFullYear()}-${String(
        recordDate.getMonth() + 1
      ).padStart(2, "0")}`;
      if (recordMonth === selectedMonth) {
        if (budgetCategories.includes(record.category_name)) {
          if (!result[record.category_name]) result[record.category_name] = 0;
          result[record.category_name] += record.s_price;
        } else {
          etcSum += record.s_price;
        }
      }
    });
    result["기타"] = etcSum;
    return result;
  }, [total, selectedMonth, budgetCategories]);

  // 월 선택 옵션 생성 (최근 12개월)
  const monthOptions = useMemo(() => {
    const options = [];
    const now = new Date();
    for (let i = 0; i < 12; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const value = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;
      options.push(value);
    }
    return options;
  }, []);

  // 전체 지출 합계 계산
  const totalSpentThisMonth = useMemo(() => {
    return Object.values(spendingByCategory).reduce((sum, v) => sum + v, 0);
  }, [spendingByCategory]);

  return (
    <Layout title="예산" showBackButton={true}>
      <div className="mb-4 text-black">
        <label className="text-sm font-medium text-gray-700 mr-2">
          월 선택:
        </label>
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="px-2 py-1 border border-gray-300 rounded-md bg-white"
        >
          {monthOptions.map((month) => (
            <option key={month} value={month}>
              {month}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-2 text-right text-base font-bold text-gray-800">
        이번달 총 지출: {totalSpentThisMonth.toLocaleString()}원
      </div>
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
            {BUDGETS.map(({ category, amount }) => {
              // '전체' 카테고리일 때만 전체 합계 사용
              const spent =
                category === "전체"
                  ? totalSpentThisMonth
                  : spendingByCategory[category] || 0;
              const remain = amount - spent;
              return (
                <tr key={category}>
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
    </Layout>
  );
}
// ... existing code ...
