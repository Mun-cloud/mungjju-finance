"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import SpendingList from "../../components/SpendingList";
import Layout from "../../components/Layout";
import { useSpendingStore } from "@/store/spendingStore";

/**
 * 지출기록 페이지 컴포넌트
 *
 * 모든 지출 기록을 월별로 필터링하여 볼 수 있는 페이지입니다.
 */
export default function TransactionsPage() {
  const router = useRouter();
  const total = useSpendingStore((state) => state.total);
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  // 사용 가능한 월 목록 생성
  const availableMonths = Array.from(
    new Set(
      total
        .map((record) => {
          const date = new Date(record.s_date);
          if (isNaN(date.getTime())) return null; // 유효하지 않은 날짜는 제외
          return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
            2,
            "0"
          )}`;
        })
        .filter((month) => month !== null) // null(=invalid date) 제거
    )
  )
    .sort()
    .reverse();

  // 이번 달(YYYY-MM) 구하기
  const now = new Date();
  const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
    2,
    "0"
  )}`;

  // selectedMonth를 이번 달로 초기화
  useEffect(() => {
    if (availableMonths.length > 0) {
      // 이번 달이 있으면 그걸로, 없으면 가장 최근 달로
      setSelectedMonth(
        availableMonths.includes(thisMonth) ? thisMonth : availableMonths[0]
      );
    }
  }, [availableMonths.length]);

  // 월별 총 지출액 계산
  const monthlyTotal = filteredRecords.reduce(
    (sum, record) => sum + record.s_price,
    0
  );

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
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-gray-900">월별 필터</h2>
          <span className="text-sm text-gray-500">
            총 {filteredRecords.length}건
          </span>
        </div>

        <div className="flex items-center gap-3 justify-between">
          <select
            value={selectedMonth}
            defaultValue={availableMonths[0]}
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

          <div className="text-right">
            <p className="text-sm text-gray-500">총 지출</p>
            <p className="text-lg font-bold text-gray-900">
              {monthlyTotal.toLocaleString()}원
            </p>
          </div>
        </div>
      </div>

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
      {total.length === 0 && (
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
                d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          </div>
          <p className="text-gray-500 font-medium mb-2">
            동기화된 데이터가 없습니다
          </p>
          <p className="text-sm text-gray-400">
            대시보드에서 Google Drive와 동기화해주세요
          </p>
          <button
            onClick={() => router.push("/")}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            대시보드로 이동
          </button>
        </div>
      )}
    </Layout>
  );
}
