"use client";

import { useState } from "react";
import Heading from "./text-heading";
import { Icon } from "@iconify/react";
import Avatar from "./avatar";
import NotificationsTab from "./notification-tab";
import { sosData } from "@/lib/config/demo-data/sos";
import SOSAlertModal from "@/components/sos-alert-modal";
import { useSidebar } from "@/context/SidebarContext";
import { usePathname } from "next/navigation";
import { breadcrumbs } from "@/lib/config/breadcrumbs";

export default function Header() {
  const [isSosAlertModal, setIsSosModal] = useState(false);
  const { openMobile } = useSidebar();
  const pathname = usePathname();
  const matched = breadcrumbs.find((b) => pathname.includes(b.href))
  return (
    <>
      <header className="bg-white py-4 px-4 md:px-10 border-b border-gray-200 flex justify-between items-center h-[92px] sticky top-0 md:static">
        <Heading
          heading="Admin Management"
          subtitle="Welcome back! Here's what's happening today."
          className="hidden md:block"
        />
        {/* mobile breadcrumb */}
      <h1 className="block md:hidden text-lg font-bold">{matched?.header}</h1>
        <div className="flex gap-2 md:gap-4 items-center justify-end w-full md:w-fit">
          {/* sos alert */}
          <div
            onClick={() => setIsSosModal(true)}
            className="h-11 w-[150px] rounded-full border border-[#FF4D4F] px-[17px] py-2.5 hidden md:flex justify-between items-center cursor-pointer"
          >
            <Icon icon="fa:warning" color="#FF4D4F" />
            <span className="text-sm text-[#FF4D4F]">SOS Alert</span>
            <div className="size-5 rounded-full p-2 bg-[#FF4D4F] text-white text-sm font-bold flex justify-center items-center">
              {sosData.length}
            </div>
          </div>
          <NotificationsTab />
          <Avatar name="John Doe" />
          <Icon
            icon={"material-symbols:menu-rounded"}
            height={32}
            width={32}
            color="#0095DA"
            className="block md:hidden"
            onClick={openMobile}
          />
        </div>
      </header>

      {/* sos alert modal */}
      <SOSAlertModal
        isOpen={isSosAlertModal}
        onClose={() => setIsSosModal(false)}
      />
    </>
  );
}
