"use client";
import { Icon } from "@iconify/react";
type Status = "Success" | "Pending" | "Failed" | "Inactive";
type StatusConfig = {
  icon: string;
  bgColor: string;
  textColor: string;
  lineColor: string;
};
const STATUS_STYLES: Record<Status, StatusConfig> = {
  Success: {
    icon: "prime:check-circle",
    bgColor: "bg-[#21C788]",
    textColor: "text-[#21C788]",
    lineColor: "bg-[#21C788]",
  },
  Pending: {
    icon: "tdesign:time",
    bgColor: "bg-[#FFAC33]",
    textColor: "text-[#FFAC33]",
    lineColor: "bg-[#FFAC33]",
  },
  Failed: {
    icon: "gg:close-o",
    bgColor: "bg-[#FF4D4F]",
    textColor: "text-[#FF4D4F]",
    lineColor: "bg-transparent",
  },
  Inactive: {
    icon: "octicon:dot-fill-24",
    bgColor: "bg-[#C9D1DA]",
    textColor: "text-[#1F1F1F]",
    lineColor: "bg-transparent",
  },
};
type StatusTimelineProps = {
  status: Status;
  title: string;
  subtitle: string;
  date: string;
  time: string;
  showLine?: boolean; // for last item in a list, you can disable the line
};
export default function StatusTimeline({
  status,
  title,
  subtitle,
  date,
  time,
  showLine = true,
}: StatusTimelineProps) {
  const { icon, bgColor, textColor, lineColor } = STATUS_STYLES[status];
  return (
    <div className="flex items-start gap-3">
      {/* Timeline indicator */}
      <div className="flex flex-col items-center">
        <div
          className={`size-[35px] rounded-full flex justify-center items-center shadow-md ${bgColor}`}
        >
          <Icon icon={icon} height={22} width={22} color="white" />
        </div>
        {showLine && <div className={`w-0.5 h-8 ${lineColor}`} />}
      </div>
      {/* Timeline content */}
      <div>
        <p className={`text-base font-semibold ${textColor}`}>{title}</p>
        <p className="text-sm text-[#6B7280] mb-1">{subtitle}</p>
        {status === "Inactive" ? (
          <p className="text-[#9CA3AF]">-- -- --</p>
        ) : (
          <p className="text-xs text-[#9CA3AF]">
            {date}, {time}
          </p>
        )}
      </div>
    </div>
  );
}
