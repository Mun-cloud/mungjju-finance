"use client";

import { useState } from "react";
import { syncMyGoogleDriveAndSaveToDB } from "../app/actions";
import SyncIcon from "@/assets/icons/sync.svg";

export default function SyncButton() {
  const [isSyncing, setIsSyncing] = useState(false);

  /**
   * Google Drive 동기화 실행
   */
  const handleSync = async () => {
    setIsSyncing(true);

    try {
      const { success } = await syncMyGoogleDriveAndSaveToDB();
      if (success) {
        alert("동기화가 완료되었습니다!");
      } else {
        alert("동기화에 실패했습니다. 다시 시도해주세요.");
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
