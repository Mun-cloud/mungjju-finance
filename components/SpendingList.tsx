import { SpendingList as SpendingListType } from "@/types/list";
import { useState, useMemo } from "react";

interface SpendingListProps {
  spendingRecords: SpendingListType[];
}

/**
 * 소비 기록 목록을 일별로 그룹화하여 표시하는 컴포넌트
 *
 * 각 날짜별로 그룹화되어 있고, 날짜를 클릭하면 해당 날짜의 지출 내역이 펼쳐집니다.
 *
 * @param spendingRecords - 표시할 소비 기록 배열
 */
export default function SpendingList({ spendingRecords }: SpendingListProps) {
  const [expandedDates, setExpandedDates] = useState<Set<string>>(new Set());
  const [selectedRole, setSelectedRole] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // 사용 가능한 카테고리 목록 생성
  const availableCategories = useMemo(() => {
    const categories = new Set<string>();
    spendingRecords.forEach((record) => {
      if (record.category_name) {
        categories.add(record.category_name);
      }
    });
    return Array.from(categories).sort();
  }, [spendingRecords]);

  // 필터링된 기록
  const filteredRecords = useMemo(() => {
    return spendingRecords.filter((record) => {
      const roleMatch = selectedRole === "all" || record.role === selectedRole;
      const categoryMatch =
        selectedCategory === "all" || record.category_name === selectedCategory;
      return roleMatch && categoryMatch;
    });
  }, [spendingRecords, selectedRole, selectedCategory]);

  // 날짜별로 그룹화
  const groupedRecords = useMemo(() => {
    const groups: { [key: string]: SpendingListType[] } = {};

    filteredRecords.forEach((record) => {
      const date = record.s_date;
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(record);
    });

    // 날짜별로 정렬 (내림차순)
    return Object.entries(groups)
      .sort(
        ([dateA], [dateB]) =>
          new Date(dateB).getTime() - new Date(dateA).getTime()
      )
      .reduce((acc, [date, records]) => {
        acc[date] = records;
        return acc;
      }, {} as { [key: string]: SpendingListType[] });
  }, [filteredRecords]);

  // 날짜 토글 함수
  const toggleDate = (date: string) => {
    const newExpandedDates = new Set(expandedDates);
    if (newExpandedDates.has(date)) {
      newExpandedDates.delete(date);
    } else {
      newExpandedDates.add(date);
    }
    setExpandedDates(newExpandedDates);
  };

  // 전체 열기 함수
  const expandAll = () => {
    const allDates = new Set(Object.keys(groupedRecords));
    setExpandedDates(allDates);
  };

  // 전체 닫기 함수
  const collapseAll = () => {
    setExpandedDates(new Set());
  };

  // 필터 초기화 함수
  const resetFilters = () => {
    setSelectedRole("all");
    setSelectedCategory("all");
  };

  // 날짜별 총 지출액 계산
  const getDateTotal = (records: SpendingListType[]) => {
    return records.reduce((sum, record) => sum + record.s_price, 0);
  };

  // 날짜 포맷팅 (예: 2024-01-15 → 1월 15일)
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}월 ${date.getDate()}일`;
  };

  // 요일 포맷팅
  const getDayOfWeek = (dateString: string) => {
    const date = new Date(dateString);
    const days = ["일", "월", "화", "수", "목", "금", "토"];
    return days[date.getDay()];
  };

  // 필터링된 총 지출액
  const totalFilteredAmount = filteredRecords.reduce(
    (sum, record) => sum + record.s_price,
    0
  );

  if (spendingRecords.length === 0) {
    return (
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
    );
  }

  return (
    <div>
      {/* 필터 섹션 */}
      <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-gray-700">지출 내역</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={expandAll}
              className="px-3 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
            >
              전체 열기
            </button>
            <button
              onClick={collapseAll}
              className="px-3 py-1 text-xs font-medium text-gray-600 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
            >
              전체 닫기
            </button>
          </div>
        </div>

        {/* 필터 컨트롤 */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* 지출자 필터 */}
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-gray-600">지출자:</label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="px-2 py-1 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">전체</option>
              <option value="husband">🐶뭉</option>
              <option value="wife">🐰쭈</option>
            </select>
          </div>

          {/* 카테고리 필터 */}
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-gray-600">
              카테고리:
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-2 py-1 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">전체</option>
              {availableCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* 필터 초기화 버튼 */}
          {(selectedRole !== "all" || selectedCategory !== "all") && (
            <button
              onClick={resetFilters}
              className="px-2 py-1 text-xs font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-colors"
            >
              필터 초기화
            </button>
          )}
        </div>

        {/* 필터 결과 요약 */}
        {(selectedRole !== "all" || selectedCategory !== "all") && (
          <div className="mt-2 pt-2 border-t border-gray-200">
            <div className="flex items-center justify-between text-xs text-gray-600">
              <span>
                필터링된 결과: {filteredRecords.length}건 /{" "}
                {spendingRecords.length}건
              </span>
              <span>총 {totalFilteredAmount.toLocaleString()}원</span>
            </div>
          </div>
        )}
      </div>

      {/* 필터링된 결과가 없을 때 */}
      {filteredRecords.length === 0 && spendingRecords.length > 0 && (
        <div className="text-center py-8">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg
              className="w-6 h-6 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <p className="text-gray-500 font-medium mb-1">
            필터링된 결과가 없습니다
          </p>
          <p className="text-xs text-gray-400">다른 필터 조건을 선택해보세요</p>
        </div>
      )}

      {/* 지출 내역 목록 */}
      {filteredRecords.length > 0 && (
        <div className="divide-y divide-gray-100">
          {Object.entries(groupedRecords).map(([date, records]) => {
            const isExpanded = expandedDates.has(date);
            const dateTotal = getDateTotal(records);
            const dayOfWeek = getDayOfWeek(date);
            const isToday = new Date().toISOString().split("T")[0] === date;

            return (
              <div key={date} className="bg-white">
                {/* 날짜 헤더 */}
                <button
                  onClick={() => toggleDate(date)}
                  className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors duration-150"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-left">
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-medium text-gray-900">
                          {formatDate(date)}
                        </span>
                        <span className="text-xs text-gray-500">
                          ({dayOfWeek})
                        </span>
                        {isToday && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            오늘
                          </span>
                        )}
                        <span className="text-xs text-gray-500">
                          {records.length}건의 지출
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">
                        {dateTotal.toLocaleString()}원
                      </p>
                    </div>
                    <svg
                      className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                        isExpanded ? "rotate-180" : ""
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
                  </div>
                </button>

                {/* 지출 내역 목록 */}
                {isExpanded && (
                  <div className="border-t border-gray-100 bg-gray-50">
                    {records.map((record) => (
                      <div
                        key={`${record._id}-${record.s_date}-${record.s_time}`}
                        className="px-4 py-3 hover:bg-gray-100 transition-colors duration-150"
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
                                {record.role === "husband" ? "🐶뭉" : "🐰쭈"}
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
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
