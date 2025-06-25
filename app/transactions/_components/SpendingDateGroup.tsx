import { SpendingList as SpendingListType } from "@/types/list";
import { useSpendingFiltersStore } from "@/store/spendingFiltersStore";
import SpendingItem from "./SpendingItem";

interface SpendingDateGroupProps {
  date: string;
  records: SpendingListType[];
}

const SpendingDateGroup = ({ date, records }: SpendingDateGroupProps) => {
  const { expandedDates, toggleDate } = useSpendingFiltersStore();

  const isExpanded = expandedDates.has(date);
  const dateTotal = records.reduce((sum, record) => sum + record.s_price, 0);

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

  const dayOfWeek = getDayOfWeek(date);
  const isToday = new Date().toISOString().split("T")[0] === date;

  return (
    <div className="bg-white">
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
            <SpendingItem
              key={`${record._id}-${record.s_date}-${record.s_time}`}
              record={record}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SpendingDateGroup;
