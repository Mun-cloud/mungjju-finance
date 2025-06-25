import { useSpendingFiltersStore } from "@/store/spendingFiltersStore";

const FilterSummary = () => {
  const {
    selectedRole,
    selectedCategory,
    spendingRecords,
    getFilteredRecords,
    getTotalFilteredAmount,
  } = useSpendingFiltersStore();

  const filteredRecords = getFilteredRecords();
  const totalFilteredAmount = getTotalFilteredAmount();

  if (selectedRole === "all" && selectedCategory === "all") {
    return null;
  }

  return (
    <div className="mt-2 pt-2 border-t border-gray-200">
      <div className="flex items-center justify-between text-xs text-gray-600">
        <span>
          필터링된 결과: {filteredRecords.length}건 / {spendingRecords.length}건
        </span>
        <span>총 {totalFilteredAmount.toLocaleString()}원</span>
      </div>
    </div>
  );
};

export default FilterSummary;
