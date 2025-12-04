"use client";

import { Icon } from "@iconify/react";

interface StatType {
    title: string;
    amount: string;
    percent?: number;
    icon: string;
    iconBg: string;
    currency?: boolean;
}

type StatProps = {
    data: Array<StatType>
}

export default function DashboardStatCard({
    data
}: StatProps) {
    return data.map((d, index) => (
        <div key={index} className="h-fit w-full bg-white rounded-2xl py-8 px-4 shadow-md flex justify-between items-center">
            <div className="space-y-2">
                <p className="text-sm text-[#7C7979] font-normal whitespace-nowrap">{d.title}</p>
                <h1 className="text-[#040C13] text-2xl font-bold">{d.currency && '₦ '}{d.amount}</h1>
                {/* {d.percent !== undefined && d.percent !== null && (
                    <div className="h-[26px] w-[68px] rounded-full bg-[#10B98115] flex justify-between items-center px-2">
                        <Icon icon="heroicons:arrow-up-right-20-solid" height={12} width={12} color="#21C788" />
                        <p className="text-xs text-[#21C788] font-normal">+{d.percent}%</p>
                    </div>
                )} */}
            </div>
            <div
                className="size-14 rounded-2xl flex justify-center items-center shadow-lg"
                style={{ backgroundColor: d.iconBg }}
            >
                <Icon icon={d.icon} height={24} width={24} color="#FFF" />
            </div>
        </div>
    ))
}