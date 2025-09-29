"use client";

import Layout from "@/components/Layout";
import { useSpendingStore } from "@/store/spendingStore";
import { useState, useMemo } from "react";
import SpendingDetailModal from "../charts/_components/SpendingDetailModal";
import { Spending } from "@prisma/client";
import MonthSelector from "./_components/MonthSelector";
import BudgetTable from "./_components/BudgetTable";
import MonthlyMemo from "./_components/MonthlyMemo";
import { useMonthlyMemo } from "./_hooks/useMonthlyMemo";

// 예산 항목과 금액(원하는 값으로 수정 가능)
const BUDGETS = [
  { category: "식비", amount: 600000 },
  { category: "교통비", amount: 70000 },
  { category: "생활비", amount: 750000 },
  { category: "차량유지비", amount: 130000 },
  { category: "데이트", amount: 300000 },
  { category: "건강", amount: 70000 },
  { category: "가족", amount: 100000 },
  { category: "보험", amount: 250000 },
  { category: "경조사", amount: 150000 },
  { category: "기타", amount: 435000 },
  { category: "전체", amount: 2420000 },
  //{ category: "공과금", amount: 120000 },
  //{ category: "용돈", amount: 350000 },
  //{ category: "여행", amount: 200000 },
];

function getCurrentMonth() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

export default function BudgetPage() {
  const total = useSpendingStore((state) => state.spendingList);
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCategoryData, setSelectedCategoryData] = useState<Spending[]>(
    []
  );
  const [modalTitle, setModalTitle] = useState("");

  // 메모 관련 로직을 커스텀 훅으로 분리
  const { monthlyMemo, isSavingMemo, setMonthlyMemo, saveMonthlyMemo } =
    useMonthlyMemo(selectedMonth);

  // 예산에 포함된 카테고리 목록(기타 제외)
  const budgetCategories = BUDGETS.filter((b) => b.category !== "기타").map(
    (b) => b.category
  );

  // 월별, 카테고리별 지출 합계 계산 (기타 포함)
  const spendingByCategory = useMemo(() => {
    const result: Record<string, number> = {};
    let etcSum = 0;
    total.forEach((record) => {
      const recordDate = new Date(record.date);
      const recordMonth = `${recordDate.getFullYear()}-${String(
        recordDate.getMonth() + 1
      ).padStart(2, "0")}`;
      if (recordMonth === selectedMonth && record.category !== "용돈") {
        if (budgetCategories.includes(record.category)) {
          if (!result[record.category]) result[record.category] = 0;
          result[record.category] += record.amount;
        } else {
          etcSum += record.amount;
        }
      }
    });
    result["기타"] = etcSum;
    return result;
  }, [total, selectedMonth, budgetCategories]);

  // 월 선택 옵션 생성 (최근 12개월)
  const monthOptions = useMemo(() => {
    const options = [];
    const now = new Date();
    for (let i = 0; i < 12; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const value = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;
      options.push(value);
    }
    return options;
  }, []);

  // 전체 지출 합계 계산
  const totalSpentThisMonth = useMemo(() => {
    return Object.values(spendingByCategory).reduce((sum, v) => sum + v, 0);
  }, [spendingByCategory]);

  // 행 클릭 핸들러
  const handleRowClick = (category: string) => {
    const getRecordMonth = (record: Spending) => {
      const recordDate = new Date(record.date);
      return `${recordDate.getFullYear()}-${String(
        recordDate.getMonth() + 1
      ).padStart(2, "0")}`;
    };

    let filteredData: Spending[];

    if (category === "전체") {
      // 전체: 선택된 월의 모든 지출 (용돈 제외)
      filteredData = total.filter(
        (record) =>
          getRecordMonth(record) === selectedMonth && record.category !== "용돈"
      );
    } else if (category === "기타") {
      // 기타: 예산에 정의되지 않은 카테고리들
      filteredData = total.filter(
        (record) =>
          getRecordMonth(record) === selectedMonth &&
          !budgetCategories.includes(record.category) &&
          record.category !== "용돈"
      );
    } else {
      // 일반 카테고리: 해당 카테고리만
      filteredData = total.filter(
        (record) =>
          getRecordMonth(record) === selectedMonth &&
          record.category === category
      );
    }

    setSelectedCategoryData(filteredData);
    const [year, month] = selectedMonth.split("-");
    setModalTitle(`${category} (${year}년 ${month}월)`);
    setModalOpen(true);
  };

  return (
    <Layout title="예산" showBackButton={true}>
      <div className="space-y-4">
        <MonthSelector
          selectedMonth={selectedMonth}
          monthOptions={monthOptions}
          onMonthChange={setSelectedMonth}
          totalSpentThisMonth={totalSpentThisMonth}
        />

        <BudgetTable
          budgets={BUDGETS}
          spendingByCategory={spendingByCategory}
          totalSpentThisMonth={totalSpentThisMonth}
          onRowClick={handleRowClick}
        />

        <MonthlyMemo
          selectedMonth={selectedMonth}
          monthlyMemo={monthlyMemo}
          isSavingMemo={isSavingMemo}
          onMemoChange={setMonthlyMemo}
          onSaveMemo={saveMonthlyMemo}
        />
      </div>

      <SpendingDetailModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={modalTitle}
        spendingList={selectedCategoryData}
      />
    </Layout>
  );
}
