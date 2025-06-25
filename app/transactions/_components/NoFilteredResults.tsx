const NoFilteredResults = () => {
  return (
    <div className="text-center py-8">
      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
        <svg
          className="w-6 h-6 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      <p className="text-gray-500 font-medium mb-1">필터링된 결과가 없습니다</p>
      <p className="text-xs text-gray-400">다른 필터 조건을 선택해보세요</p>
    </div>
  );
};

export default NoFilteredResults;
