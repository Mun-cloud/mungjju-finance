import ExpandCollapseButtons from "./ExpandCollapseButtons";
import FilterControls from "./FilterControls";
import FilterSummary from "./FilterSummary";
import SearchInput from "./SearchInput";

const SpendingListFilterSection = () => {
  return (
    <div className="px-4 py-3 border-b border-gray-100 bg-gray-50 flex flex-col gap-3">
      {/* 검색 입력 */}
      <SearchInput />

      {/* 전체 열기, 닫기 버튼 */}
      <ExpandCollapseButtons />

      {/* 필터 컨트롤 */}
      <FilterControls />

      {/* 필터 결과 요약 */}
      <FilterSummary />
    </div>
  );
};

export default SpendingListFilterSection;
