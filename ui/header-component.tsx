"use client";

import { useState } from "react";
import Heading from "./text-heading";
import { Icon } from "@iconify/react";
import Avatar from "./avatar";
import NotificationsTab from "./notification-tab";
import { sosData } from "@/lib/config/demo-data/sos";
import SOSAlertModal from "@/components/sos-alert-modal";

export default function Header() {
  const [isSosAlertModal, setIsSosModal] = useState(false);
  return (
    <>
      <header className="bg-white py-4 px-10 border-b border-gray-200 flex justify-between items-center h-[92px]">
        <Heading
          heading="Admin Management"
          subtitle="Welcome back! Here's what's happening today."
        />
        <div className="flex gap-4 items-center w-full md:w-fit">
          {/* sos alert */}
          <div
            onClick={() => setIsSosModal(true)}
            className="h-11 w-[150px] rounded-full border border-[#FF4D4F] px-[17px] py-2.5 flex justify-between items-center cursor-pointer"
          >
            <Icon icon="fa:warning" color="#FF4D4F" />
            <span className="text-sm text-[#FF4D4F]">SOS Alert</span>
            <div className="size-5 rounded-full p-2 bg-[#FF4D4F] text-white text-sm font-bold flex justify-center items-center">
              {sosData.length}
            </div>
          </div>
          <NotificationsTab />
          <Avatar name="Esther Chinda" />
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
