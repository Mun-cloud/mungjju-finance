"use client";

import { useState } from "react";
import SyncButton from "./components/SyncButton";
import { useSession } from "next-auth/react";
import { SpendingList } from "@/types/list";

export default function Home() {
  const { status } = useSession();
  const [spendingRecords, setSpendingRecords] = useState<SpendingList[]>([]);

  const handleFile = (file: SpendingList[]) => {
    setSpendingRecords(file);
  };

  if (status === "loading") {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">소비 기록</h1>
      <SyncButton handleFile={handleFile} />
      <div className="space-y-4">
        {spendingRecords.map((list) => (
          <div
            key={list._id}
            className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div>
                <h2 className="font-semibold">
                  {list.category_name} - {list.subcategory_name}
                </h2>
                <p className="text-gray-600">{list.s_where}</p>
                <p className="text-sm text-gray-500">
                  {list.s_date} {list.s_time}
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg">
                  {list.s_price.toLocaleString()}원
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
