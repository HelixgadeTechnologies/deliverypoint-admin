"use client";

import { Icon } from "@iconify/react";

export default function NotificationsTab() {
    return (
        <>
        <div className="relative">
            <Icon 
            icon={"streamline-ultimate:alert-bell-notification-2"}
            height={35}
            width={35}
            color="#0095DA"
            />
            <div className="size-[22px] bg-[#0095DA] text-white rounded-full flex justify-center items-center text-xs absolute -top-1 right-0">3</div>
        </div>
        </>
    )
}