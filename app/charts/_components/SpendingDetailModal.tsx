import React, { useEffect } from "react";
import { Spending } from "@prisma/client";

interface SpendingDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  spendingList: Spending[];
}

export default function SpendingDetailModal({
  isOpen,
  onClose,
  title,
  spendingList,
}: SpendingDetailModalProps) {
  // 모달이 열렸을 때 body 스크롤 방지
  useEffect(() => {
    if (isOpen) {
      // 현재 스크롤 위치 저장
      const scrollY = window.scrollY;
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
    } else {
      // 스크롤 상태 복원
      const scrollY = document.body.style.top;
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || "0", 10) * -1);
      }
    }

    // 컴포넌트 언마운트 시 스크롤 상태 복원
    return () => {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const formatDate = (date: any) => {
    const d = new Date(date);
    return `${d.getMonth() + 1}/${d.getDate()}`;
  };

  const formatAmount = (amount: number) => {
    return `${amount.toLocaleString()}원`;
  };

  const totalAmount = spendingList.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 max-h-[80vh] overflow-hidden flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="p-3 bg-gray-50 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">총 지출</span>
            <span className="text-lg font-bold text-gray-900">
              {formatAmount(totalAmount)}
            </span>
          </div>
          <div className="flex justify-between items-center mt-1">
            <span className="text-sm text-gray-600">건수</span>
            <span className="text-sm text-gray-700">
              {spendingList.length}건
            </span>
          </div>
        </div>

        <div className="overflow-y-auto grow">
          {spendingList.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              해당하는 지출 기록이 없습니다.
            </div>
          ) : (
            <div className="space-y-2">
              {spendingList.map((spending, index) => (
                <div
                  key={spending.id || index}
                  className="p-3 border border-gray-200 rounded-lg"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-gray-900">
                          {spending.category}
                        </span>
                        {spending.subCategory && (
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            {spending.subCategory}
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-600">
                        {formatDate(spending.date)} • {spending.where}
                      </div>
                      {spending.memo && (
                        <div className="text-xs text-gray-500 mt-1">
                          {spending.memo}
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-gray-900">
                        {formatAmount(spending.amount)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {spending.role === "husband" ? "남편" : "아내"}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
