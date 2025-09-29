interface MonthlyMemoProps {
  selectedMonth: string;
  monthlyMemo: string;
  isSavingMemo: boolean;
  onMemoChange: (memo: string) => void;
  onSaveMemo: () => void;
}

export default function MonthlyMemo({
  selectedMonth,
  monthlyMemo,
  isSavingMemo,
  onMemoChange,
  onSaveMemo,
}: MonthlyMemoProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
      <div className="mb-2">
        <label className="text-sm font-medium text-gray-700">
          {selectedMonth} 메모:
        </label>
      </div>
      <textarea
        value={monthlyMemo}
        onChange={(e) => onMemoChange(e.target.value)}
        placeholder="이번 달에 대한 메모를 입력하세요..."
        className="w-full p-2 text-sm border border-gray-300 rounded-md resize-none text-black bg-white"
        rows={3}
      />
      <div className="mt-2 text-right">
        <button
          onClick={onSaveMemo}
          disabled={isSavingMemo}
          className="px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isSavingMemo ? "저장 중..." : "메모 저장"}
        </button>
      </div>
    </div>
  );
}