"use client";

import { Status } from "@/types/table-data";

type SummaryProps = {
  orderId: string;
  date: string;
  status: Status;
  amount: string;
};

export default function OrderSummaryTab({
  orderId,
  date,
  status,
  amount,
}: SummaryProps) {
  return (
    <div className="h-[85px] w-full bg-white p-4 shadow rounded flex justify-between items-center">
      <div className="text-sm">
        <h4 className="text-[#1F1F1F]">{orderId}</h4>
        <p className="text-[#6E747D]">{date}</p>
      </div>
      <div className="space-y-1">
        <button
          className={`w-20 h-7 rounded-lg text-white flex justify-center items-center text-xs cursor-pointer ${
            status === "Completed"
              ? "bg-[#21C788]"
              : status === "Canceled"
              ? "bg-[#FF4D4F]"
              : "bg-[#FFAC33]"
          }`}
        >
          {status}
        </button>
        <p className="text-sm text-[#6E747D]">₦ {amount}</p>
      </div>
    </div>
  );
}
