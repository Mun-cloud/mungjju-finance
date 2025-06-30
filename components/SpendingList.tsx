import SpendingListFilterSection from "@/app/transactions/_components/SpendingListFilterSection";
import SpendingListContent from "@/app/transactions/_components/SpendingListContent";
import EmptySpendingList from "@/app/transactions/_components/EmptySpendingList";
import { useSpendingFiltersStore } from "@/store/spendingFiltersStore";
import { useEffect } from "react";
import { Spending } from "@prisma/client";

interface SpendingListProps {
  spendingRecords: Spending[];
}

/**
 * 소비 기록 목록을 일별로 그룹화하여 표시하는 컴포넌트
 *
 * 각 날짜별로 그룹화되어 있고, 날짜를 클릭하면 해당 날짜의 지출 내역이 펼쳐집니다.
 *
 * @param spendingRecords - 표시할 소비 기록 배열
 */
export default function SpendingList({ spendingRecords }: SpendingListProps) {
  const { setSpendingRecords } = useSpendingFiltersStore();

  // spendingRecords가 변경될 때마다 스토어에 설정
  useEffect(() => {
    setSpendingRecords(spendingRecords);
  }, [spendingRecords, setSpendingRecords]);

  // 빈 상태 표시
  if (spendingRecords.length === 0) {
    return <EmptySpendingList />;
  }

  return (
    <div>
      {/* 필터 섹션 */}
      <SpendingListFilterSection />

      {/* 지출 목록 컨텐츠 */}
      <SpendingListContent />
    </div>
  );
}
