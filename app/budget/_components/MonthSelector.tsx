interface MonthSelectorProps {
  selectedMonth: string;
  monthOptions: string[];
  onMonthChange: (month: string) => void;
  totalSpentThisMonth: number;
}

export default function MonthSelector({
  selectedMonth,
  monthOptions,
  onMonthChange,
  totalSpentThisMonth,
}: MonthSelectorProps) {
  return (
    <div className="space-y-4">
      <div className="text-black">
        <label className="text-sm font-medium text-gray-700 mr-2">
          월 선택:
        </label>
        <select
          value={selectedMonth}
          onChange={(e) => onMonthChange(e.target.value)}
          className="px-2 py-1 border border-gray-300 rounded-md bg-white"
        >
          {monthOptions.map((month) => (
            <option key={month} value={month}>
              {month}
            </option>
          ))}
        </select>
      </div>

      <div className="text-right text-base font-bold text-gray-800">
        이번달 총 지출: {totalSpentThisMonth.toLocaleString()}원
      </div>
    </div>
  );
}