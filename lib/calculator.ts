import { Spending } from "@prisma/client";

export const calculateThisMonthSpending = (list: Spending[]) => {
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  return list
    .filter((record) => {
      const recordDate = new Date(record.date);
      return (
        recordDate.getMonth() + 1 === currentMonth &&
        recordDate.getFullYear() === currentYear
      );
    })
    .reduce((sum, record) => sum + record.amount, 0);
};
