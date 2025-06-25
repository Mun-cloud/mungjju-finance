import { create } from "zustand";
import { SpendingList as SpendingListType } from "@/types/list";

interface SpendingFiltersState {
  // 상태
  selectedRole: string;
  selectedCategory: string;
  expandedDates: Set<string>;
  spendingRecords: SpendingListType[];

  // 액션
  setSelectedRole: (role: string) => void;
  setSelectedCategory: (category: string) => void;
  setSpendingRecords: (records: SpendingListType[]) => void;
  expandAll: () => void;
  collapseAll: () => void;
  resetFilters: () => void;
  toggleDate: (date: string) => void;

  // 계산된 값들을 반환하는 함수들
  getAvailableCategories: () => string[];
  getFilteredRecords: () => SpendingListType[];
  getGroupedRecords: () => { [key: string]: SpendingListType[] };
  getTotalFilteredAmount: () => number;
}

export const useSpendingFiltersStore = create<SpendingFiltersState>(
  (set, get) => ({
    // 초기 상태
    selectedRole: "all",
    selectedCategory: "all",
    expandedDates: new Set(),
    spendingRecords: [],

    // 액션들
    setSelectedRole: (role: string) => set({ selectedRole: role }),

    setSelectedCategory: (category: string) =>
      set({ selectedCategory: category }),

    setSpendingRecords: (records: SpendingListType[]) =>
      set({ spendingRecords: records }),

    expandAll: () => {
      const { getGroupedRecords } = get();
      const groupedRecords = getGroupedRecords();
      const allDates = new Set(Object.keys(groupedRecords));
      set({ expandedDates: allDates });
    },

    collapseAll: () => set({ expandedDates: new Set() }),

    resetFilters: () =>
      set({
        selectedRole: "all",
        selectedCategory: "all",
      }),

    toggleDate: (date: string) => {
      const { expandedDates } = get();
      const newExpandedDates = new Set(expandedDates);
      if (newExpandedDates.has(date)) {
        newExpandedDates.delete(date);
      } else {
        newExpandedDates.add(date);
      }
      set({ expandedDates: newExpandedDates });
    },

    // 계산된 값들을 반환하는 함수들
    getAvailableCategories: () => {
      const { spendingRecords } = get();
      const categories = new Set<string>();
      spendingRecords.forEach((record) => {
        if (record.category_name) {
          categories.add(record.category_name);
        }
      });
      return Array.from(categories).sort();
    },

    getFilteredRecords: () => {
      const { spendingRecords, selectedRole, selectedCategory } = get();
      return spendingRecords.filter((record) => {
        const roleMatch =
          selectedRole === "all" || record.role === selectedRole;
        const categoryMatch =
          selectedCategory === "all" ||
          record.category_name === selectedCategory;
        return roleMatch && categoryMatch;
      });
    },

    getGroupedRecords: () => {
      const { getFilteredRecords } = get();
      const filteredRecords = getFilteredRecords();
      const groups: { [key: string]: SpendingListType[] } = {};

      filteredRecords.forEach((record) => {
        const date = record.s_date;
        if (!groups[date]) {
          groups[date] = [];
        }
        groups[date].push(record);
      });

      // 날짜별로 정렬 (내림차순)
      return Object.entries(groups)
        .sort(
          ([dateA], [dateB]) =>
            new Date(dateB).getTime() - new Date(dateA).getTime()
        )
        .reduce((acc, [date, records]) => {
          acc[date] = records;
          return acc;
        }, {} as { [key: string]: SpendingListType[] });
    },

    getTotalFilteredAmount: () => {
      const { getFilteredRecords } = get();
      const filteredRecords = getFilteredRecords();
      return filteredRecords.reduce((sum, record) => sum + record.s_price, 0);
    },
  })
);
