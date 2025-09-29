import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export function useMonthlyMemo(selectedMonth: string) {
  const { data: session } = useSession();
  const [monthlyMemo, setMonthlyMemo] = useState("");
  const [isSavingMemo, setIsSavingMemo] = useState(false);

  // 월별 메모 불러오기
  const loadMonthlyMemo = async (yearMonth: string) => {
    if (!session?.user?.email) return;

    const [year, month] = yearMonth.split("-");
    try {
      const response = await fetch(
        `/api/monthly-memo?year=${year}&month=${month}`
      );
      if (response.ok) {
        const data = await response.json();
        setMonthlyMemo(data.memo || "");
      }
    } catch (error) {
      console.error("Error loading monthly memo:", error);
    }
  };

  // 월별 메모 저장
  const saveMonthlyMemo = async () => {
    if (!session?.user?.email) return;

    const [year, month] = selectedMonth.split("-");
    setIsSavingMemo(true);

    try {
      const response = await fetch("/api/monthly-memo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          year: parseInt(year),
          month: parseInt(month),
          memo: monthlyMemo,
        }),
      });

      if (response.ok) {
        console.log("메모가 저장되었습니다.");
      }
    } catch (error) {
      console.error("Error saving monthly memo:", error);
    } finally {
      setIsSavingMemo(false);
    }
  };

  // 월 변경 시 메모 로드
  useEffect(() => {
    loadMonthlyMemo(selectedMonth);
  }, [selectedMonth, session]);

  return {
    monthlyMemo,
    isSavingMemo,
    setMonthlyMemo,
    saveMonthlyMemo,
  };
}