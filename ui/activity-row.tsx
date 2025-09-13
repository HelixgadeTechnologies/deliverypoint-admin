"use client";

import { Icon } from "@iconify/react";

interface ActivityTypes {
  message: string;
  time: string;
  icon: string;
  themeColor: string;
}

type ActivityProps = {
  data: Array<ActivityTypes>;
};

export default function ActivityRow({ data }: ActivityProps) {
  return data.map((d, idx) => (
    <div key={idx} className="flex justify-between items-center">
      <div className="flex items-center gap-4">
        {/* icon */}
        <div
          style={{
            backgroundColor: `${d.themeColor}20`,
          }}
          className="size-11 rounded-2xl flex justify-center items-center shadow-sm"
        >
          <Icon icon={d.icon} color={d.themeColor} height={20} width={20} />
        </div>
        {/* message and time */}
        <div>
          <p className="text-[#1F1F1F] text-base">{d.message}</p>
          <p className="text-[#7C7979] text-sm">{d.time}</p>
        </div>
      </div>

      {/* indicator */}
      <div
        style={{ backgroundColor: d.themeColor }}
        className="size-2 rounded-full"
      ></div>
    </div>
  ));
}
