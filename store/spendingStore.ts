import { Spending } from "@prisma/client";
import { create } from "zustand";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
dayjs.extend(utc);
dayjs.extend(timezone);

interface SpendingState {
  isLoading: boolean;
  myRole: "husband" | "wife";
  spendingList: Spending[];
  setIsLoading: (isLoading: boolean) => void;
  setMyRole: (role: "husband" | "wife") => void;
  setSpendingList: (list: Spending[]) => void;
}

export const useSpendingStore = create<SpendingState>(
  (set: (partial: Partial<SpendingState>) => void) => ({
    isLoading: false,
    myRole: "husband",
    spendingList: [],
    setIsLoading: (isLoading: boolean) => set({ isLoading }),
    setMyRole: (role: "husband" | "wife") => set({ myRole: role }),
    setSpendingList: (spendingList: Spending[]) => {
      set({ spendingList });
    },
  })
);
