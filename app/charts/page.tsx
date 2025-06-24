"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import Layout from "../../components/Layout";
import { SpendingList as SpendingListType } from "@/types/list";

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
  const { data: session, status } = useSession();
  const router = useRouter();
  const [spendingRecords, setSpendingRecords] = useState<SpendingListType[]>(
    []
  );
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 로컬 스토리지에서 데이터 가져오기
  useEffect(() => {
    const storedData = localStorage.getItem("spendingRecords");
    if (storedData) {
      const records = JSON.parse(storedData);
      setSpendingRecords(records);
    }
  }, []);

  /**
   * 동기화된 소비 기록을 상태에 저장하는 콜백 함수
   * @param records - 동기화된 소비 기록 배열
   */
  const handleSyncResult = (records: SpendingListType[]) => {
    setSpendingRecords(records);
    localStorage.setItem("spendingRecords", JSON.stringify(records));
  };

  // 1. 카테고리별 지출 분포 데이터
  const categoryData = spendingRecords
    .reduce((acc, record) => {
      const category = record.category_name || "기타";
      const existing = acc.find((item) => item.name === category);
      if (existing) {
        existing.value += record.s_price;
      } else {
        acc.push({ name: category, value: record.s_price });
      }
      return acc;
    }, [] as { name: string; value: number }[])
    .sort((a, b) => b.value - a.value);

  // 2. 월별 지출 추이 데이터
  const monthlyData = spendingRecords
    .reduce((acc, record) => {
      const date = new Date(record.s_date);
      const monthKey = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;
      const existing = acc.find((item) => item.month === monthKey);
      if (existing) {
        existing.amount += record.s_price;
      } else {
        acc.push({ month: monthKey, amount: record.s_price });
      }
      return acc;
    }, [] as { month: string; amount: number }[])
    .sort((a, b) => a.month.localeCompare(b.month));

  // 3. 카테고리별 월별 비교 데이터
  const categoryMonthlyData = spendingRecords
    .reduce((acc, record) => {
      const date = new Date(record.s_date);
      const monthKey = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;
      const category = record.category_name || "기타";

      let monthData = acc.find((item) => item.month === monthKey);
      if (!monthData) {
        monthData = { month: monthKey };
        acc.push(monthData);
      }

      monthData[category] = (monthData[category] || 0) + record.s_price;
      return acc;
    }, [] as any[])
    .sort((a, b) => a.month.localeCompare(b.month));

  // 4. 지출 금액 분포 데이터 (히스토그램)
  const priceRanges = [
    { range: "1만원 미만", min: 0, max: 10000 },
    { range: "1-3만원", min: 10000, max: 30000 },
    { range: "3-5만원", min: 30000, max: 50000 },
    { range: "5-10만원", min: 50000, max: 100000 },
    { range: "10-20만원", min: 100000, max: 200000 },
    { range: "20만원 이상", min: 200000, max: Infinity },
  ];

  const priceDistributionData = priceRanges.map((range) => ({
    range: range.range,
    count: spendingRecords.filter(
      (record) => record.s_price >= range.min && record.s_price < range.max
    ).length,
  }));

  // 차트 색상 팔레트
  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884D8",
    "#82CA9D",
    "#FFC658",
    "#FF6B6B",
  ];

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

  // 로딩 상태 처리
  if (status === "loading") {
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

  // 로그인하지 않은 경우 대시보드로 리다이렉트
  if (!session) {
    router.push("/");
    return null;
  }

  return (
    <Layout
      title="차트 분석"
      onSyncSuccess={handleSyncResult}
      showBackButton={true}
    >
      <div className="space-y-6">
        {/* 데이터가 없는 경우 안내 */}
        {spendingRecords.length === 0 ? (
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
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <p className="text-gray-500 font-medium mb-2">
              분석할 데이터가 없습니다
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
        ) : (
          <>
            {/* 1. 카테고리별 지출 분포 (도넛 차트) */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                카테고리별 지출 분포
              </h2>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => [
                      `${value.toLocaleString()}원`,
                      "지출액",
                    ]}
                    labelFormatter={(label) => `카테고리: ${label}`}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                {categoryData.slice(0, 6).map((item, index) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{
                        backgroundColor: COLORS[index % COLORS.length],
                      }}
                    />
                    <span className="truncate text-gray-900 font-medium">
                      {item.name}
                    </span>
                    <span className="font-bold text-gray-900">
                      {item.value.toLocaleString()}원
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. 월별 지출 추이 (라인 차트) */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                월별 지출 추이
              </h2>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="month"
                    tickFormatter={(value) => {
                      const [, month] = value.split("-");
                      return `${month}월`;
                    }}
                  />
                  <YAxis
                    tickFormatter={(value) =>
                      `${(value / 10000).toFixed(0)}만원`
                    }
                  />
                  <Tooltip
                    formatter={(value: number) => [
                      `${value.toLocaleString()}원`,
                      "지출액",
                    ]}
                    labelFormatter={(label) => {
                      const [year, month] = label.split("-");
                      return `${year}년 ${month}월`;
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="amount"
                    stroke="#8884d8"
                    strokeWidth={2}
                    dot={{ fill: "#8884d8", strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* 3. 카테고리별 월별 비교 (바 차트) */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                카테고리별 월별 비교
              </h2>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={categoryMonthlyData.slice(-6)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="month"
                    tickFormatter={(value) => {
                      const [, month] = value.split("-");
                      return `${month}월`;
                    }}
                  />
                  <YAxis
                    tickFormatter={(value) =>
                      `${(value / 10000).toFixed(0)}만원`
                    }
                  />
                  <Tooltip
                    formatter={(value: number) => [
                      `${value.toLocaleString()}원`,
                      "지출액",
                    ]}
                    labelFormatter={(label) => {
                      const [year, month] = label.split("-");
                      return `${year}년 ${month}월`;
                    }}
                  />
                  <Legend />
                  {categoryData.slice(0, 4).map((category, index) => (
                    <Bar
                      key={category.name}
                      dataKey={category.name}
                      fill={COLORS[index % COLORS.length]}
                      stackId="a"
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* 4. 지출 금액 분포 (히스토그램) */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                지출 금액 분포
              </h2>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={priceDistributionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="range" />
                  <YAxis />
                  <Tooltip
                    formatter={(value: number) => [`${value}건`, "거래 수"]}
                    labelFormatter={(label) => `금액대: ${label}`}
                  />
                  <Bar dataKey="count" fill="#82CA9D" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
