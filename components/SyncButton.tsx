"use client";

import { useState } from "react";
import { syncBothGoogleDrives } from "../app/actions";
import { useSpendingStore } from "@/store/spendingStore";
import SyncIcon from "@/assets/icons/sync.svg";

export default function SyncButton() {
  const [isSyncing, setIsSyncing] = useState(false);

  /**
   * Google Drive 동기화 실행
   */
  const handleSync = async () => {
    setIsSyncing(true);

    try {
      const { success, husbandSpendingList, wifeSpendingList } =
        await syncBothGoogleDrives();

      console.log("husbandSpendingList", husbandSpendingList);
      console.log("wifeSpendingList", wifeSpendingList);

      if (success && husbandSpendingList && wifeSpendingList) {
        // localStorage에 저장
        localStorage.setItem(
          "husbandSpendingList",
          JSON.stringify(husbandSpendingList)
        );
        localStorage.setItem(
          "wifeSpendingList",
          JSON.stringify(wifeSpendingList)
        );
        // zustand store 갱신
        useSpendingStore.getState().setHusband(husbandSpendingList);
        useSpendingStore.getState().setWife(wifeSpendingList);
      }
    } catch (error) {
      console.error("동기화 실패:", error);
      alert("동기화에 실패했습니다. 다시 시도해주세요.");
    }
    setIsSyncing(false);
  };

  return (
    <button
      onClick={handleSync}
      className={`text-blue-500 hover:text-blue-600 transition-colors p-1  ${
        isSyncing ? "animate-spin-reverse" : ""
      }`}
      title="Google Drive 동기화"
    >
      <SyncIcon className="w-5 h-5" />
    </button>
  );
}
