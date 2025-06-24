import { create } from "zustand";
import type { SpendingList } from "@/types/list";

interface SpendingState {
  myRole: "husband" | "wife";
  total: SpendingList[];
  husband: SpendingList[];
  wife: SpendingList[];
  setMyRole: (role: "husband" | "wife") => void;
  setHusband: (list: SpendingList[]) => void;
  setWife: (list: SpendingList[]) => void;
  setTotal: (husband: SpendingList[], wife: SpendingList[]) => void;
  loadFromStorage: () => void;
}

export const useSpendingStore = create<SpendingState>(
  (set: (partial: Partial<SpendingState>) => void) => ({
    myRole: "husband",
    total: [],
    husband: [],
    wife: [],
    setMyRole: (role: "husband" | "wife") => set({ myRole: role }),
    setHusband: (list: SpendingList[]) => set({ husband: list }),
    setWife: (list: SpendingList[]) => set({ wife: list }),
    setTotal: (husband: SpendingList[], wife: SpendingList[]) => {
      const total = [...husband, ...wife];
      total.sort(
        (a, b) =>
          new Date(b.s_date + b.s_time).getTime() -
          new Date(a.s_date + a.s_time).getTime()
      );
      set({ total });
    },
    loadFromStorage: () => {
      const husband = JSON.parse(
        localStorage.getItem("husbandSpendingList") || "[]"
      );
      const wife = JSON.parse(localStorage.getItem("wifeSpendingList") || "[]");
      set({ husband, wife });
    },
  })
);
