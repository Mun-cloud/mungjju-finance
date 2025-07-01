import { useSpendingStore } from "@/store/spendingStore";

import dayjs from "dayjs";
import React from "react";

export default function RecentSpendingList() {
  const spendingList = useSpendingStore((state) => state.spendingList);
  const isLoading = useSpendingStore((state) => state.isLoading);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900">최근 지출</h2>
      </div>
      <div className="divide-y divide-gray-100">
        {isLoading && (
          <div className="px-4 py-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
          </div>
        )}
        {spendingList.slice(0, 10).map((record) => (
          <div
            key={`${record.id}-${record.date}`}
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
                    {record.category}
                  </span>
                  {record.subCategory && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                      {record.subCategory}
                    </span>
                  )}
                </div>
                <h3 className="text-sm font-medium text-gray-900 truncate">
                  {record.where}
                </h3>
                {record.memo && (
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                    {record.memo}
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
                      {new Date(record.date).getMonth() + 1}월{" "}
                      {new Date(record.date).getDate()}일
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
                    <span>{dayjs(record.date).format("HH:mm")}</span>
                  </div>
                </div>
              </div>
              <div className="text-right ml-4">
                <p className="text-sm font-semibold text-gray-900">
                  {record.amount.toLocaleString()}원
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      {spendingList.length === 0 && (
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
  );
}
