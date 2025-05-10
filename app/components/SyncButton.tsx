"use client";

import { useState } from "react";
import { syncWithGoogleDrive } from "../actions";
import { SpendingList } from "@/types/list";

interface SyncButtonProps {
  handleFile: (records: SpendingList[]) => void;
}

export default function SyncButton({ handleFile }: SyncButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSync = async () => {
    setLoading(true);
    setError(null);

    try {
      const { success, spendingList } = await syncWithGoogleDrive();

      if (success && spendingList) {
        handleFile(spendingList);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "데이터를 불러오는데 실패했습니다."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-4">
      <button
        onClick={handleSync}
        disabled={loading}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
      >
        {loading ? "동기화 중..." : "Google Drive와 동기화"}
      </button>
      {error && <p className="mt-2 text-red-500">{error}</p>}
    </div>
  );
}
