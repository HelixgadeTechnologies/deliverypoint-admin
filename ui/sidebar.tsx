"use client"

import { useSidebar } from "@/context/SidebarContext";
import Image from "next/image";

export default function Sidebar() {
    const { mobileOpen, closeMobile } = useSidebar();
  return (
    <>
      {/* overlay for mobile */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={closeMobile}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-40 flex flex-col items-start p-4 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-all duration-300 ease-in-out`}
      >
        <div className="relative w-full h-8">
            <Image 
            src={"/logo-text.svg"}
            alt="DeliverPoint 2025"
            fill
            className="object-cover"
            />
        </div>

        <section className="flex flex-col justify-between h-full w-full mt-10"></section>
      </aside>
    </>
  );
}
