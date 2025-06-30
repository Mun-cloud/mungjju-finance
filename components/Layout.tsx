"use client";

import { useSession } from "next-auth/react";
import Header from "./Header";
import BottomNavigation from "./BottomNavigation";
import LoginSection from "./LoginSection";
import { Spending } from "@prisma/client";
import StoreInitializer from "./StoreInitializer";

interface LayoutProps {
  children: React.ReactNode;
  title: string;
  showSyncButton?: boolean;
  onSyncSuccess?: (records: Spending[]) => void;
  showBackButton?: boolean;
  showBottomNav?: boolean;
}

/**
 * 공통 레이아웃 컴포넌트
 *
 * @param children - 메인 콘텐츠
 * @param title - 헤더에 표시할 제목
 * @param showSyncButton - 동기화 버튼 표시 여부 (기본값: true)
 * @param onSyncSuccess - 동기화 성공 시 호출할 콜백 함수
 * @param showBackButton - 뒤로가기 버튼 표시 여부 (기본값: false)
 * @param showBottomNav - 하단 네비게이션 표시 여부 (기본값: true)
 */
export default function Layout({
  children,
  title,
  showSyncButton = true,
  showBackButton = false,
  showBottomNav = true,
}: LayoutProps) {
  const { data: session, status } = useSession();

  // 로딩 상태 처리
  if (status === "loading") {
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

  // 로그인하지 않은 경우 로그인 안내 섹션 표시
  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <LoginSection />
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* 헤더 */}
        <Header
          title={title}
          showSyncButton={showSyncButton}
          showBackButton={showBackButton}
        />

        {/* 메인 콘텐츠 */}
        <div className={`grow ${showBottomNav ? "pb-16" : ""}`}>
          <main className="max-w-md mx-auto px-4 py-6">{children}</main>
        </div>

        {/* 하단 네비게이션 */}
        {showBottomNav && <BottomNavigation />}

        <StoreInitializer />
      </div>
    </>
  );
}
