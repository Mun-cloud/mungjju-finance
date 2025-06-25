import { SpendingList as SpendingListType } from "@/types/list";

interface SpendingItemProps {
  record: SpendingListType;
}

const SpendingItem = ({ record }: SpendingItemProps) => {
  return (
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
  );
};

export default SpendingItem;
