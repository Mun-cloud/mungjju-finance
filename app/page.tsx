"use client";

import Layout from "../components/Layout";
import { useSpendingStore } from "@/store/spendingStore";
import DashboardHeartIcon from "@/assets/icons/dashboard-heart.svg";
import DashboardCalendarIcon from "@/assets/icons/dashboard-calendar.svg";
import { calculateThisMonthSpending } from "@/lib/calculator";
import useMount from "@/hooks/useMount";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { useState } from "react";

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
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set()
  );

  // zustand store에서 부부 데이터 가져오기
  const total = useSpendingStore((state) => state.total);
  const myRole = useSpendingStore((state) => state.myRole);
  const myList = useSpendingStore((state) => state[myRole]);

  const myThisMonthSpending = calculateThisMonthSpending(myList);
  const coupleThisMonthSpending = calculateThisMonthSpending(total);

  // 이번달 카테고리별 지출 데이터 계산
  const thisMonthCategoryData = (() => {
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();

    const thisMonthRecords = total.filter((record) => {
      const recordDate = new Date(record.s_date);
      return (
        recordDate.getMonth() + 1 === currentMonth &&
        recordDate.getFullYear() === currentYear
      );
    });

    // 부부 합산 카테고리별 지출
    const coupleCategorySpending = thisMonthRecords.reduce((acc, record) => {
      const category = record.category_name;
      if (!acc[category]) {
        acc[category] = 0;
      }
      acc[category] += record.s_price;
      return acc;
    }, {} as Record<string, number>);

    // 개인별 카테고리별 지출
    const personalCategorySpending = thisMonthRecords.reduce((acc, record) => {
      const category = record.category_name;
      const role = record.role;
      if (!acc[role]) {
        acc[role] = {};
      }
      if (!acc[role][category]) {
        acc[role][category] = 0;
      }
      acc[role][category] += record.s_price;
      return acc;
    }, {} as Record<string, Record<string, number>>);

    return {
      couple: Object.entries(coupleCategorySpending).map(([name, value]) => ({
        name,
        value,
      })),
      personal: personalCategorySpending,
    };
  })();

  // 차트 색상 배열
  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884D8",
    "#82CA9D",
    "#FFC658",
    "#FF6B6B",
    "#4ECDC4",
    "#45B7D1",
  ];

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
              <DashboardCalendarIcon className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">뭉쭈 이번 달</p>
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

      {/* 카테고리별 지출 분석 섹션들 */}
      <div className="space-y-3 mb-3">
        {/* 부부 합산 카테고리별 지출 그래프 */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <button
            onClick={() => toggleSection("couple-chart")}
            className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors duration-150"
          >
            <h2 className="text-lg font-semibold text-gray-900">
              뭉쭈 합산 카테고리별 지출 그래프
            </h2>
            <svg
              className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                expandedSections.has("couple-chart") ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
          {expandedSections.has("couple-chart") && (
            <div className="px-4 pb-4">
              {thisMonthCategoryData.couple.length > 0 ? (
                <>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={thisMonthCategoryData.couple}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        isAnimationActive={false}
                      >
                        {thisMonthCategoryData.couple.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value) =>
                          `${Number(value).toLocaleString()}원`
                        }
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  {/* 카테고리별 리스트 추가 */}
                  <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                    {thisMonthCategoryData.couple
                      .sort((a, b) => b.value - a.value)
                      .slice(0, 6)
                      .map((item, index) => (
                        <div
                          key={item.name}
                          className="flex items-center gap-2"
                        >
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
                </>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  이번달 지출 데이터가 없습니다
                </div>
              )}
            </div>
          )}
        </div>

        {/* 개인별 카테고리별 지출 그래프 */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <button
            onClick={() => toggleSection("personal-chart")}
            className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors duration-150"
          >
            <h2 className="text-lg font-semibold text-gray-900">
              개인별 카테고리별 지출 그래프
            </h2>
            <svg
              className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                expandedSections.has("personal-chart") ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
          {expandedSections.has("personal-chart") && (
            <div className="px-4 pb-4">
              {Object.keys(thisMonthCategoryData.personal).length > 0 ? (
                <div className="space-y-6">
                  {Object.entries(thisMonthCategoryData.personal).map(
                    ([role, categories]) => {
                      const roleData = Object.entries(categories).map(
                        ([name, value]) => ({
                          name,
                          value,
                        })
                      );

                      return (
                        <div key={role}>
                          <h3 className="text-lg font-medium text-gray-700 mb-3">
                            {role === "husband" ? "뭉" : "쭈"}
                          </h3>
                          <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                              <Pie
                                data={roleData}
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                                isAnimationActive={false}
                              >
                                {roleData.map((entry, index) => (
                                  <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS[index % COLORS.length]}
                                  />
                                ))}
                              </Pie>
                              <Tooltip
                                formatter={(value) =>
                                  `${Number(value).toLocaleString()}원`
                                }
                              />
                            </PieChart>
                          </ResponsiveContainer>
                          {/* 카테고리별 리스트 추가 */}
                          <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                            {roleData
                              .sort((a, b) => b.value - a.value)
                              .slice(0, 6)
                              .map((item, index) => (
                                <div
                                  key={item.name}
                                  className="flex items-center gap-2"
                                >
                                  <div
                                    className="w-3 h-3 rounded-full"
                                    style={{
                                      backgroundColor:
                                        COLORS[index % COLORS.length],
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
                      );
                    }
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  이번달 지출 데이터가 없습니다
                </div>
              )}
            </div>
          )}
        </div>

        {/* 부부 합산 카테고리별 지출 표 */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <button
            onClick={() => toggleSection("couple-table")}
            className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors duration-150"
          >
            <h2 className="text-lg font-semibold text-gray-900">
              뭉쭈 합산 카테고리별 지출 표
            </h2>
            <svg
              className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                expandedSections.has("couple-table") ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
          {expandedSections.has("couple-table") && (
            <div className="px-4 pb-4">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        카테고리
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        금액
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        비율
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {thisMonthCategoryData.couple
                      .sort((a, b) => b.value - a.value)
                      .map((item) => (
                        <tr key={item.name} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">
                            {item.name}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900 text-right">
                            {item.value.toLocaleString()}원
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-500 text-right">
                            {coupleThisMonthSpending > 0
                              ? (
                                  (item.value / coupleThisMonthSpending) *
                                  100
                                ).toFixed(1)
                              : 0}
                            %
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* 개인별 카테고리별 지출 표 */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <button
            onClick={() => toggleSection("personal-table")}
            className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors duration-150"
          >
            <h2 className="text-lg font-semibold text-gray-900">
              개인별 카테고리별 지출 표
            </h2>
            <svg
              className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                expandedSections.has("personal-table") ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
          {expandedSections.has("personal-table") && (
            <div className="px-4 pb-4">
              <div className="overflow-x-auto">
                {Object.entries(thisMonthCategoryData.personal).map(
                  ([role, categories]) => {
                    const roleTotal = Object.values(categories).reduce(
                      (sum, amount) => sum + amount,
                      0
                    );
                    const roleData = Object.entries(categories)
                      .sort(([, a], [, b]) => b - a)
                      .map(([name, value]) => ({ name, value }));

                    return (
                      <div key={role} className="mb-6 last:mb-0">
                        <div className="px-4 py-2 bg-gray-50 border-b border-gray-100 mb-2">
                          <h3 className="text-sm font-medium text-gray-700">
                            {role === "husband" ? "🐶뭉" : "🐰쭈"} (총{" "}
                            {roleTotal.toLocaleString()}원)
                          </h3>
                        </div>
                        <table className="w-full">
                          <thead className="bg-gray-25">
                            <tr>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                카테고리
                              </th>
                              <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                금액
                              </th>
                              <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                비율
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {roleData.map((item) => (
                              <tr key={item.name} className="hover:bg-gray-50">
                                <td className="px-4 py-2 text-sm font-medium text-gray-900">
                                  {item.name}
                                </td>
                                <td className="px-4 py-2 text-sm text-gray-900 text-right">
                                  {item.value.toLocaleString()}원
                                </td>
                                <td className="px-4 py-2 text-sm text-gray-500 text-right">
                                  {roleTotal > 0
                                    ? ((item.value / roleTotal) * 100).toFixed(
                                        1
                                      )
                                    : 0}
                                  %
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    );
                  }
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 최근 지출 기록 (아코디언 없이 10개만) */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">최근 지출</h2>
        </div>
        <div className="divide-y divide-gray-100">
          {total.slice(0, 10).map((record) => (
            <div
              key={`${record._id}-${record.s_date}-${record.s_time}`}
              className="px-4 py-3 hover:bg-gray-50 transition-colors duration-150"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        record.role === "husband"
                          ? "bg-green-100 text-green-800"
                          : "bg-pink-100 text-pink-800"
                      }`}
                    >
                      {record.role === "husband" ? "뭉" : "쭈"}
                    </span>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {record.category_name}
                    </span>
                    {record.subcategory_name && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                        {record.subcategory_name}
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm font-medium text-gray-900 truncate">
                    {record.s_where}
                  </h3>

                  {record.s_memo && (
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                      {record.s_memo}
                    </p>
                  )}

                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <svg
                        className="w-3 h-3"
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
                      <span>
                        {new Date(record.s_date).getMonth() + 1}월{" "}
                        {new Date(record.s_date).getDate()}일
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span>{record.s_time}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right ml-4">
                  <p className="text-sm font-semibold text-gray-900">
                    {record.s_price.toLocaleString()}원
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

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
              동기화된 소비 기록이 없습니다
            </p>
            <p className="text-sm text-gray-400">
              Google Drive와 동기화 버튼을 클릭해보세요
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
}
