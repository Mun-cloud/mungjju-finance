import { useSpendingStore } from "@/store/spendingStore";
import { Spending } from "@prisma/client";

import { useEffect, useMemo } from "react";

const MonthSelector = ({
  records,
  selectedMonth,
  setSelectedMonth,
}: {
  records: Spending[];
  selectedMonth: string;
  setSelectedMonth: (month: string) => void;
}) => {
  const total = useSpendingStore((state) => state.spendingList);
  // 이번 달(YYYY-MM) 구하기
  const now = new Date();
  const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
    2,
    "0"
  )}`;

  // 월별 총 지출액 계산
  const monthlyTotal = records.reduce((sum, record) => sum + record.amount, 0);

  // 사용 가능한 월 목록 생성
  const availableMonths = useMemo(
    () =>
      Array.from(
        new Set(
          total
            .map((record) => {
              const date = new Date(record.date);
              if (isNaN(date.getTime())) return null; // 유효하지 않은 날짜는 제외
              return `${date.getFullYear()}-${String(
                date.getMonth() + 1
              ).padStart(2, "0")}`;
            })
            .filter((month) => month !== null) // null(=invalid date) 제거
        )
      )
        .sort()
        .reverse(),
    [total]
  );

  // 이전 월로 이동
  const goToPreviousMonth = () => {
    const currentIndex = availableMonths.indexOf(selectedMonth);
    if (currentIndex < availableMonths.length - 1) {
      setSelectedMonth(availableMonths[currentIndex + 1]);
    }
  };

  // 다음 월로 이동
  const goToNextMonth = () => {
    const currentIndex = availableMonths.indexOf(selectedMonth);
    if (currentIndex > 0) {
      setSelectedMonth(availableMonths[currentIndex - 1]);
    }
  };

  // 현재 선택된 월의 인덱스
  const currentMonthIndex = availableMonths.indexOf(selectedMonth);

  // selectedMonth를 이번 달로 초기화
  useEffect(() => {
    if (availableMonths.length > 0) {
      // 이번 달이 있으면 그걸로, 없으면 가장 최근 달로
      setSelectedMonth(
        availableMonths.includes(thisMonth) ? thisMonth : availableMonths[0]
      );
    }
  }, [availableMonths, setSelectedMonth, thisMonth]);

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-3">
      <div className="flex items-center gap-3 justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={goToPreviousMonth}
            disabled={currentMonthIndex >= availableMonths.length - 1}
            className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {availableMonths.map((month) => {
              const [year, monthNum] = month.split("-");
              return (
                <option key={year + month} value={month}>
                  {year}년 {monthNum}월
                </option>
              );
            })}
          </select>

          <button
            onClick={goToNextMonth}
            disabled={currentMonthIndex <= 0}
            className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>

        <div className="text-right">
          <p className="text-sm text-gray-500">총 지출</p>
          <p className="text-lg font-bold text-gray-900">
            {monthlyTotal.toLocaleString()}원
          </p>
        </div>
      </div>
    </div>
  );
};

export default MonthSelector;
