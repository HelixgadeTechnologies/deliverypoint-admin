"use client";

import { Status } from "@/types/table-data";

type StatusProps = {
  status: Status;
};

export default function StatusTab({ status }: StatusProps) {
  return (
    <div
      className={`h-[28px] w-[98px] rounded-lg flex justify-center items-center text-xs ${
        status === "Resolved" || status === "Approved"
          ? "bg-[#10B98115] text-[#21C788]"
          : status === "Open" || status === "Pending"
          ? "bg-[#FFAC331A] text-[#FFAC33]"
          : "bg-[#0095DA15] text-[#0095DA]"
      }`}
    >
      {status}
    </div>
  );
}
