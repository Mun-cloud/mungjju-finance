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

  // 날짜별로 그룹화
  const groupedRecords = useMemo(() => {
    const groups: { [key: string]: SpendingListType[] } = {};

    spendingRecords.forEach((record) => {
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
  }, [spendingRecords]);

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
                    <span className="text-xs text-gray-500">({dayOfWeek})</span>
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
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            <span>{record.s_time}</span>
                          </div>

                          {record.s_card && (
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
                                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                                />
                              </svg>
                              <span>{record.s_card}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="ml-4 text-right">
                        <p className="text-lg font-bold text-gray-900">
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
  );
}
