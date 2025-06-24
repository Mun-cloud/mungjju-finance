"use client";

import { useState, useEffect } from "react";
import SpendingList from "../components/SpendingList";
import Layout from "../components/Layout";
import { useSpendingStore } from "@/store/spendingStore";

/**
 * TODO
 * 1. 가계부 데이터 하나 더 가져와서 분류하기
 * 2. 지출자 표시
 * 3. 대시보드에 표시하는 데이터 변경
 * 4. 지출자별, 카테고리별 필터링 추가
 * 5. 예산 관리
 * 6. 카테고리 관리
 * 7. 간단한 메세지 기능
 */
/**
 * 메인 페이지 컴포넌트 (대시보드)
 *
 * 이 페이지는 다음과 같은 기능을 제공합니다:
 * - Google Drive와의 동기화 기능
 * - 부부 Google Drive 동기화 기능
 * - 소비 기록 요약 및 통계
 */
export default function Home() {
  const [mounted, setMounted] = useState(false);

  // zustand store에서 부부 데이터 가져오기
  const { total, myRole } = useSpendingStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  // // 총 지출액 계산 (개인 + 부부)
  // const myTotalSpending = useSpendingStore()[myRole].reduce(
  //   (sum, record) => sum + record.s_price,
  //   0
  // );

  // // 부부 총 지출액 계산
  // const coupleTotalSpending = total.reduce(
  //   (sum, record) => sum + record.s_price,
  //   0
  // );

  // 이번 달 지출액 계산
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();
  const myThisMonthSpending = useSpendingStore()
    [myRole].filter((record) => {
      const recordDate = new Date(record.s_date);
      return (
        recordDate.getMonth() + 1 === currentMonth &&
        recordDate.getFullYear() === currentYear
      );
    })
    .reduce((sum, record) => sum + record.s_price, 0);

  // 부부 이번 달 지출액 계산
  const coupleThisMonthSpending = total
    .filter((record) => {
      const recordDate = new Date(record.s_date);
      return (
        recordDate.getMonth() + 1 === currentMonth &&
        recordDate.getFullYear() === currentYear
      );
    })
    .reduce((sum, record) => sum + record.s_price, 0);

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
    <Layout title="대시보드">
      {/* 통계 카드들 */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        {/* <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">개인 총 지출</p>
              <p className="text-xl font-bold text-gray-900">
                {myTotalSpending.toLocaleString()}원
              </p>
            </div>
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <svg
                className="w-5 h-5 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">부부 총 지출</p>
              <p className="text-xl font-bold text-gray-900">
                {coupleTotalSpending.toLocaleString()}원
              </p>
            </div>
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <svg
                className="w-5 h-5 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
          </div>
        </div> */}

        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">나의 이번 달</p>
              <p className="text-xl font-bold text-gray-900">
                {myThisMonthSpending.toLocaleString()}원
              </p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <svg
                className="w-5 h-5 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">부부 이번 달</p>
              <p className="text-xl font-bold text-gray-900">
                {coupleThisMonthSpending.toLocaleString()}원
              </p>
            </div>
            <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
              <svg
                className="w-5 h-5 text-pink-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* 최근 지출 기록 */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-4 py-2 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-900">최근 지출</h2>
        </div>
        <div className="max-h-96 overflow-y-auto">
          <SpendingList spendingRecords={total.slice(0, 10)} />
        </div>
      </div>
    </Layout>
  );
}
