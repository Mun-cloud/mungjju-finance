import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import React, { useState } from "react";
import { useSpendingStore } from "@/store/spendingStore";
import SpendingDetailModal from "./SpendingDetailModal";
import { Spending } from "@prisma/client";

const priceRanges = [
  { range: "1만원 미만", min: 0, max: 10000 },
  { range: "1-3만원", min: 10000, max: 30000 },
  { range: "3-5만원", min: 30000, max: 50000 },
  { range: "5-10만원", min: 50000, max: 100000 },
  { range: "10-20만원", min: 100000, max: 200000 },
  { range: "20만원 이상", min: 200000, max: Infinity },
];

export default function PriceDistributionBarChart() {
  const spendingList = useSpendingStore((state) => state.spendingList);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPriceData, setSelectedPriceData] = useState<Spending[]>([]);
  const [modalTitle, setModalTitle] = useState("");

  const priceDistributionData = priceRanges.map((range) => ({
    range: range.range,
    count: spendingList.filter(
      (record) => record.amount >= range.min && record.amount < range.max
    ).length,
    min: range.min,
    max: range.max,
  }));

  const handleBarClick = (data: any) => {
    const priceRangeData = spendingList.filter(
      (record) => record.amount >= data.min && record.amount < data.max
    );
    setSelectedPriceData(priceRangeData);
    setModalTitle(`지출 금액 분포: ${data.range}`);
    setModalOpen(true);
  };

  if (spendingList.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        지출 금액 분포
      </h2>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={priceDistributionData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="range" />
          <YAxis />
          <Tooltip
            formatter={(value: number) => [`${value}건`, "거래 수"]}
            labelFormatter={(label) => `금액대: ${label}`}
          />
          <Bar 
            dataKey="count" 
            fill="#82CA9D"
            onClick={handleBarClick}
            style={{ cursor: "pointer" }}
          />
        </BarChart>
      </ResponsiveContainer>
      
      <SpendingDetailModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={modalTitle}
        spendingList={selectedPriceData}
      />
    </div>
  );
}
