import DashboardCalendarIcon from "@/assets/icons/dashboard-calendar.svg";
import DashboardHeartIcon from "@/assets/icons/dashboard-heart.svg";
import React from "react";

interface SummaryCardsProps {
  myThisMonthSpending: number;
  coupleThisMonthSpending: number;
}

export default function SummaryCards({
  myThisMonthSpending,
  coupleThisMonthSpending,
}: SummaryCardsProps) {
  return (
    <div className="grid grid-cols-2 gap-2 mb-3">
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 mb-1">나의 이번 달</p>
            <p className="text-xl font-bold text-gray-900">
              {myThisMonthSpending.toLocaleString()}원
            </p>
          </div>
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <DashboardCalendarIcon className="w-5 h-5 text-blue-600" />
          </div>
        </div>
      </div>
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 mb-1">뭉쭈 이번 달</p>
            <p className="text-xl font-bold text-gray-900">
              {coupleThisMonthSpending.toLocaleString()}원
            </p>
          </div>
          <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
            <DashboardHeartIcon className="w-5 h-5 text-pink-600" />
          </div>
        </div>
      </div>
    </div>
  );
}
