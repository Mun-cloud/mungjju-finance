"use client";

import { useState, useMemo } from "react";

import SpendingList from "../../components/SpendingList";
import Layout from "../../components/Layout";
import { useSpendingStore } from "@/store/spendingStore";
import useMount from "@/hooks/useMount";
import MonthSelector from "./_components/MonthSelector";
import NoTransaction from "./_components/NoTransaction";

/**
 * 지출기록 페이지 컴포넌트
 *
 * 모든 지출 기록을 월별로 필터링하여 볼 수 있는 페이지입니다.
 */
export default function TransactionsPage() {
  const total = useSpendingStore((state) => state.total);
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const mounted = useMount();

  const filteredRecords = useMemo(() => {
    if (!selectedMonth) {
      return [];
    }
    return total.filter((record) => {
      const recordDate = new Date(record.s_date);
      // 날짜가 유효하지 않으면 필터에서 제외
      if (isNaN(recordDate.getTime())) return false;

      const recordMonth = `${recordDate.getFullYear()}-${String(
        recordDate.getMonth() + 1
      ).padStart(2, "0")}`;
      return recordMonth === selectedMonth;
    });
  }, [total, selectedMonth]);

  // 하이드레이션 완료 전까지 로딩 표시
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">로딩 중...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Layout title="지출기록" showBackButton={true}>
      {/* 월별 필터 */}
      <MonthSelector
        records={filteredRecords}
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
      />

      {/* 지출 기록 목록 */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden grow">
        <div className="px-4 py-3 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">지출 내역</h2>
        </div>
        <div className="overflow-y-auto grow">
          <SpendingList spendingRecords={filteredRecords} />
        </div>
      </div>

      {/* 데이터가 없는 경우 안내 */}
      {total.length === 0 && <NoTransaction />}
    </Layout>
  );
}
