"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { syncWithGoogleDrive } from "../actions";
import { SpendingList } from "@/types/list";

interface HeaderProps {
  title: string;
  showSyncButton?: boolean;
  onSyncSuccess?: (records: SpendingList[]) => void;
  showBackButton?: boolean;
}

/**
 * 공통 헤더 컴포넌트
 *
 * @param title - 헤더에 표시할 제목
 * @param showSyncButton - 동기화 버튼 표시 여부 (기본값: true)
 * @param onSyncSuccess - 동기화 성공 시 호출할 콜백 함수
 * @param showBackButton - 뒤로가기 버튼 표시 여부 (기본값: false)
 */
export default function Header({
  title,
  showSyncButton = true,
  onSyncSuccess,
  showBackButton = false,
}: HeaderProps) {
  const { data: session } = useSession();
  const router = useRouter();

  /**
   * Google Drive 동기화 실행
   */
  const handleSync = async () => {
    if (!onSyncSuccess) return;

    try {
      const { success, spendingList } = await syncWithGoogleDrive();
      if (success && spendingList) {
        onSyncSuccess(spendingList);
      }
    } catch (error) {
      console.error("동기화 실패:", error);
      alert("동기화에 실패했습니다. 다시 시도해주세요.");
    }
  };

  /**
   * 뒤로가기 처리
   */
  const handleBack = () => {
    router.back();
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-md mx-auto px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {showBackButton && (
              <button
                onClick={handleBack}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
              </button>
            )}
            <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
          </div>

          <div className="flex items-center gap-2">
            {showSyncButton && session && (
              <button
                onClick={handleSync}
                className="text-blue-500 hover:text-blue-600 transition-colors p-1"
                title="Google Drive 동기화"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </button>
            )}

            {session && (
              <button
                onClick={() => (window.location.href = "/api/auth/signout")}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                title="로그아웃"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
