import { SpendingList } from "@/types/list";

export const calculateThisMonthSpending = (list: SpendingList[]) => {
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  return list
    .filter((record) => {
      const recordDate = new Date(record.s_date);
      return (
        recordDate.getMonth() + 1 === currentMonth &&
        recordDate.getFullYear() === currentYear
      );
    })
    .reduce((sum, record) => sum + record.s_price, 0);
};
