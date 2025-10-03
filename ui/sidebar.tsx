"use client";

import { useSidebar } from "@/context/SidebarContext";
import { sidebarData } from "@/lib/config/sidebar";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Icon } from "@iconify/react";

export default function Sidebar() {
  const { mobileOpen, closeMobile } = useSidebar();
  const router = useRouter();
  const pathname = usePathname();
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
        <div className="relative w-full h-5 md:h-8 py-5">
          <Image
            src={"/logo-text.svg"}
            alt="DeliverPoint 2025"
            fill
            className="object-contain"
          />
        </div>

        <section className="flex flex-col justify-between h-full w-full mt-10">
          <div className="space-y-1">
            {sidebarData.map((link, index) => {
              const isActive = pathname.startsWith(link.url);
              return (
                <Link
                  key={index}
                  href={link.url}
                  onClick={() => {router.push(link.url); closeMobile()}}
                  className={`h-10 w-full px-4 py-2.5 rounded-lg flex items-center gap-2 ${
                    isActive
                      ? "bg-[#0095DA] text-white"
                      : "hover:bg-gray-50 text-gray-600"
                  }`}
                >
                  <Icon
                    icon={link.icon}
                    width={18}
                    height={18}
                    color={isActive ? "#FFF" : "#737373"}
                  />
                  <span className="text-sm">{link.name}</span>
                </Link>
              );
            })}
          </div>
          <div
            onClick={() => {}}
            className={`h-10 w-full px-4 py-2.5 rounded-lg flex items-center gap-2 text-[#FF4D4F] cursor-pointer hover:text-red-600 transition-colors duration-300`}
          >
            <Icon
              icon={"streamline:logout-1"}
              width={18}
              height={18}
              color={"#FF4D4F"}
            />
            <span className="text-sm">Logout</span>
          </div>
        </section>
      </aside>
    </>
  );
}
