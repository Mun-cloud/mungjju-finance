"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { SpendingList } from "@/types/list";
import ArrowLeftIcon from "@/assets/icons/arrow-left.svg";
import LogoutIcon from "@/assets/icons/logout.svg";
import SyncButton from "./SyncButton";

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
  showBackButton = false,
}: HeaderProps) {
  const { data: session } = useSession();

  const router = useRouter();

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
                <ArrowLeftIcon className="w-5 h-5" />
              </button>
            )}
            <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
          </div>

          <div className="flex items-center gap-2">
            {showSyncButton && session && <SyncButton />}

            {session && (
              <button
                onClick={() => (window.location.href = "/api/auth/signout")}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                title="로그아웃"
              >
                <LogoutIcon className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
