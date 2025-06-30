"use client";

import Layout from "../components/Layout";
import { useSpendingStore } from "@/store/spendingStore";
// import DashboardHeartIcon from "@/assets/icons/dashboard-heart.svg";
// import DashboardCalendarIcon from "@/assets/icons/dashboard-calendar.svg";
import { calculateThisMonthSpending } from "@/lib/calculator";
import useMount from "@/hooks/useMount";
import { useState } from "react";
import CoupleCategoryPieChart from "@/app/_components/CoupleCategoryPieChart";
import PersonalCategoryPieChart from "@/app/_components/PersonalCategoryPieChart";
import CoupleCategoryTable from "@/app/_components/CoupleCategoryTable";
import PersonalCategoryTable from "@/app/_components/PersonalCategoryTable";
import SummaryCards from "@/app/_components/SummaryCards";
import RecentSpendingList from "@/app/_components/RecentSpendingList";

/**
 * TODO
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
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set()
  );

  // zustand store에서 데이터 가져오기
  const spendingList = useSpendingStore((state) => state.spendingList);
  const myRole = useSpendingStore((state) => state.myRole);

  // 내 지출만 필터링
  const myList = spendingList.filter((item) => item.role === myRole);

  const myThisMonthSpending = calculateThisMonthSpending(myList);
  const coupleThisMonthSpending = calculateThisMonthSpending(spendingList);

  // 이번달 카테고리별 지출 데이터 계산
  const thisMonthCategoryData = (() => {
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();

    const thisMonthRecords = spendingList.filter((record) => {
      const recordDate = new Date(record.date);
      return (
        recordDate.getMonth() + 1 === currentMonth &&
        recordDate.getFullYear() === currentYear
      );
    });

    // 부부 합산 카테고리별 지출
    const coupleCategorySpending = thisMonthRecords.reduce((acc, record) => {
      const category = record.category;
      if (!acc[category]) {
        acc[category] = 0;
      }
      acc[category] += record.amount;
      return acc;
    }, {} as Record<string, number>);

    // 개인별 카테고리별 지출
    const personalCategorySpending = thisMonthRecords.reduce((acc, record) => {
      const category = record.category;
      const role = record.role;
      if (!acc[role]) {
        acc[role] = {};
      }
      if (!acc[role][category]) {
        acc[role][category] = 0;
      }
      acc[role][category] += record.amount;
      return acc;
    }, {} as Record<string, Record<string, number>>);

    return {
      couple: Object.entries(coupleCategorySpending).map(([name, value]) => ({
        name,
        value: value as number,
      })),
      personal: personalCategorySpending,
    };
  })();

  // 섹션 토글 함수
  const toggleSection = (sectionName: string) => {
    const newExpandedSections = new Set(expandedSections);
    if (newExpandedSections.has(sectionName)) {
      newExpandedSections.delete(sectionName);
    } else {
      newExpandedSections.add(sectionName);
    }
    setExpandedSections(newExpandedSections);
  };

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
      <SummaryCards
        myThisMonthSpending={myThisMonthSpending}
        coupleThisMonthSpending={coupleThisMonthSpending}
      />

      {/* 카테고리별 지출 분석 섹션들 */}
      <div className="space-y-3 mb-3">
        {/* 부부 합산 카테고리별 지출 그래프 */}
        <CoupleCategoryPieChart
          expanded={expandedSections.has("couple-chart")}
          onToggle={() => toggleSection("couple-chart")}
          data={thisMonthCategoryData.couple}
        />
        {/* 개인별 카테고리별 지출 그래프 */}
        <PersonalCategoryPieChart
          expanded={expandedSections.has("personal-chart")}
          onToggle={() => toggleSection("personal-chart")}
          data={thisMonthCategoryData.personal}
        />
        {/* 부부 합산 카테고리별 지출 표 */}
        <CoupleCategoryTable
          expanded={expandedSections.has("couple-table")}
          onToggle={() => toggleSection("couple-table")}
          data={thisMonthCategoryData.couple}
          total={coupleThisMonthSpending}
        />
        {/* 개인별 카테고리별 지출 표 */}
        <PersonalCategoryTable
          expanded={expandedSections.has("personal-table")}
          onToggle={() => toggleSection("personal-table")}
          data={thisMonthCategoryData.personal}
        />
      </div>

      {/* 최근 지출 기록 (아코디언 없이 10개만) */}
      <RecentSpendingList total={spendingList} />
    </Layout>
  );
}
