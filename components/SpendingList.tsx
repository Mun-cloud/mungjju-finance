import { SpendingList as SpendingListType } from "@/types/list";

interface SpendingListProps {
  spendingRecords: SpendingListType[];
}

/**
 * 소비 기록 목록을 표시하는 컴포넌트
 *
 * 각 소비 기록은 카테고리, 지출 내역, 날짜, 시간, 금액을 포함합니다.
 *
 * @param spendingRecords - 표시할 소비 기록 배열
 */
export default function SpendingList({ spendingRecords }: SpendingListProps) {
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
      {spendingRecords.map((record) => (
        <div
          key={record._id}
          className="px-4 py-4 hover:bg-gray-50 transition-colors duration-150"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
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
                  <span>{record.s_date}</span>
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
  );
}
