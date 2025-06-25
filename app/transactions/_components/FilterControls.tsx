import { useSpendingFiltersStore } from "@/store/spendingFiltersStore";

const FilterControls = () => {
  const {
    selectedRole,
    setSelectedRole,
    selectedCategory,
    setSelectedCategory,
    getAvailableCategories,
    resetFilters,
  } = useSpendingFiltersStore();

  const availableCategories = getAvailableCategories();

  return (
    <div className="flex items-center gap-3 flex-wrap">
      {/* 지출자 필터 */}
      <div className="flex items-center gap-2">
        <label className="text-xs font-medium text-gray-600">지출자:</label>
        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          className="px-2 py-1 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="all">전체</option>
          <option value="husband">🐶뭉</option>
          <option value="wife">🐰쭈</option>
        </select>
      </div>

      {/* 카테고리 필터 */}
      <div className="flex items-center gap-2">
        <label className="text-xs font-medium text-gray-600">카테고리:</label>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-2 py-1 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="all">전체</option>
          {availableCategories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* 필터 초기화 버튼 */}
      {(selectedRole !== "all" || selectedCategory !== "all") && (
        <button
          onClick={resetFilters}
          className="px-2 py-1 text-xs font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-colors"
        >
          필터 초기화
        </button>
      )}
    </div>
  );
};

export default FilterControls;
