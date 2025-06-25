"use client";

import SpendingList from "../components/SpendingList";
import Layout from "../components/Layout";
import { useSpendingStore } from "@/store/spendingStore";
import SyncIcon from "@/assets/icons/sync.svg";
import DashboardHeartIcon from "@/assets/icons/dashboard-heart.svg";
import { calculateThisMonthSpending } from "@/lib/calculator";
import useMount from "@/hooks/useMount";

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
  const mounted = useMount();

  // zustand store에서 부부 데이터 가져오기
  const total = useSpendingStore((state) => state.total);
  const myRole = useSpendingStore((state) => state.myRole);
  const myList = useSpendingStore((state) => state[myRole]);

  const myThisMonthSpending = calculateThisMonthSpending(myList);
  const coupleThisMonthSpending = calculateThisMonthSpending(total);

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
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">나의 이번 달</p>
              <p className="text-xl font-bold text-gray-900">
                {myThisMonthSpending.toLocaleString()}원
              </p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <SyncIcon className="w-5 h-5 text-blue-600" />
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
              <DashboardHeartIcon className="w-5 h-5 text-pink-600" />
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
