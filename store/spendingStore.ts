import { Spending } from "@prisma/client";
import { create } from "zustand";

interface SpendingState {
  myRole: "husband" | "wife";
  spendingList: Spending[];
  setMyRole: (role: "husband" | "wife") => void;
  setSpendingList: (list: Spending[]) => void;
}

export const useSpendingStore = create<SpendingState>(
  (set: (partial: Partial<SpendingState>) => void) => ({
    myRole: "husband",
    spendingList: [],
    setMyRole: (role: "husband" | "wife") => set({ myRole: role }),
    setSpendingList: (spendingList: Spending[]) => {
      set({ spendingList });
    },
  })
);
