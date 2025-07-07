"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Layout from "../../components/Layout";
import CategoryPieChart from "./_components/CategoryPieChart";
import MonthlyLineChart from "./_components/MonthlyLineChart";
import CategoryMonthlyBarChart from "./_components/CategoryMonthlyBarChart";
import PriceDistributionBarChart from "./_components/PriceDistributionBarChart";

/**
 * 차트 페이지 컴포넌트
 *
 * 다양한 지출 분석 차트를 제공합니다:
 * 1. 카테고리별 지출 분포 (도넛 차트)
 * 2. 월별 지출 추이 (라인 차트)
 * 3. 카테고리별 월별 비교 (바 차트)
 * 4. 지출 금액 분포 (히스토그램)
 */
export default function ChartsPage() {
  const { data: session } = useSession();
  const router = useRouter();

  // 하이드레이션 완료 전까지 로딩 표시
  if (!session) {
    router.push("/");
    return null;
  }

  return (
    <Layout title="차트 분석" showBackButton={true}>
      <div className="space-y-6">
        <CategoryPieChart />
        <MonthlyLineChart />
        <CategoryMonthlyBarChart />
        <PriceDistributionBarChart />
      </div>
    </Layout>
  );
}
