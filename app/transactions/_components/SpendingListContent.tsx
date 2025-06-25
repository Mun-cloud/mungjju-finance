import { useSpendingFiltersStore } from "@/store/spendingFiltersStore";
import SpendingDateGroup from "./SpendingDateGroup";
import NoFilteredResults from "./NoFilteredResults";

const SpendingListContent = () => {
  const { getFilteredRecords, getGroupedRecords, spendingRecords } =
    useSpendingFiltersStore();

  const filteredRecords = getFilteredRecords();
  const groupedRecords = getGroupedRecords();

  // 필터링된 결과가 없을 때
  if (filteredRecords.length === 0 && spendingRecords.length > 0) {
    return <NoFilteredResults />;
  }

  // 지출 내역 목록
  if (filteredRecords.length > 0) {
    return (
      <div className="divide-y divide-gray-100">
        {Object.entries(groupedRecords).map(([date, records]) => (
          <SpendingDateGroup key={date} date={date} records={records} />
        ))}
      </div>
    );
  }

  return null;
};

export default SpendingListContent;
