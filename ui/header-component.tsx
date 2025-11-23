"use client";

import { useState, useEffect } from "react";
import Heading from "./text-heading";
import { Icon } from "@iconify/react";
import Avatar from "./avatar";
import NotificationsTab from "./notification-tab";
import { sosData } from "@/lib/config/demo-data/sos";
import SOSAlertModal from "@/components/sos-alert-modal";
import { useSidebar } from "@/context/SidebarContext";
import { usePathname } from "next/navigation";
import { breadcrumbs } from "@/lib/config/breadcrumbs";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/app/(app)/firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { useSOSAlerts } from "@/context/SOSContext";

export default function Header() {
  const [isSosAlertModal, setIsSosModal] = useState(false);
  const [userFullName, setUserFullName] = useState("John Doe"); // Default fallback
  const { openMobile } = useSidebar();
  const pathname = usePathname();
  const matched = breadcrumbs.find((b) => pathname.includes(b.href));

  // Fetch super admin data
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user?.email) {
        await fetchSuperAdminName(user.email);
      }
    });

    return () => unsubscribe();
  }, []);

  // Function to fetch super admin's full name
  const fetchSuperAdminName = async (email: string) => {
    try {
      const superAdminRef = doc(db, "super_admins", email);
      const superAdminSnapshot = await getDoc(superAdminRef);

      if (superAdminSnapshot.exists()) {
        const data = superAdminSnapshot.data();
        // Extract full name from the document, fallback to email if not available
        const fullName = data.fullName || data.email || "Super Admin";
        setUserFullName(fullName);
      } else {
        // If no document exists, use email as fallback
        setUserFullName(email.split('@')[0]); // Use username part of email
      }
    } catch (error) {
      console.error("Error fetching super admin name:", error);
      // Keep the default fallback name
    }
  };

  const { activeAlerts } = useSOSAlerts();

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
              {activeAlerts.length}
            </div>
          </div>
          <NotificationsTab />
          <Avatar name={userFullName} />
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