import { useSpendingFiltersStore } from "@/store/spendingFiltersStore";

const ExpandCollapseButtons = () => {
  const { expandAll, collapseAll } = useSpendingFiltersStore();

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={expandAll}
        className="px-3 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
      >
        전체 열기
      </button>
      <button
        onClick={collapseAll}
        className="px-3 py-1 text-xs font-medium text-gray-600 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
      >
        전체 닫기
      </button>
    </div>
  );
};

export default ExpandCollapseButtons;
