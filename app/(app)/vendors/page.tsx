"use client";

import {
  vendorData,
  vendorHead,
  vendorStats,
} from "@/lib/config/demo-data/vendors";
import SearchInput from "@/ui/forms/search-input";
import DropDown from "@/ui/forms/select-dropdown";
import DashboardStatCard from "@/ui/stat-card";
import StatusTab from "@/ui/status-tab";
import Table from "@/ui/table";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { useState } from "react";

export default function Vendors() {
  const [activeRowId, setActiveRowId] = useState<string | null>(null);

  return (
    <section className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <DashboardStatCard data={vendorStats} />
      </div>
      <Table
        heading="Vendor Management"
        subtitle="Manage and monitor all platform vendors"
        tableHead={vendorHead}
        tableData={vendorData}
        renderRow={(row) => (
          <>
            <td className="px-6 flex items-center gap-2 h-full pt-5">
              <Image
                src={row.vendor.image}
                alt="Profile Picture"
                height={50}
                width={50}
                className="object-cover"
              />
              <div className="text-sm">
                <h4>{row.vendor.vendorName}</h4>
                <p className="text-[#7C7979]">{row.vendor.vendorBusiness}</p>
              </div>
            </td>
            <td className="px-6 text-sm">
              <h4>{row.contact.email}</h4>
              <p className="text-[#7C7979]">{row.contact.phone}</p>
            </td>
            <td className="px-6">
              <StatusTab status={row.status} />
            </td>
            <td className="px-6">{row.totalOrders}</td>
            <td className="px-6">{row.registration}</td>
            <td className="px-6 relative">
              <div className="flex justify-center items-center">
                <Icon
                  icon={"uiw:more"}
                  width={22}
                  height={22}
                  className="cursor-pointer"
                  color="#909CAD"
                  onClick={() =>
                    setActiveRowId((prev) => (prev === row.id ? null : row.id))
                  }
                />
              </div>
              {activeRowId === row.id && (
                <AnimatePresence>
                  <motion.div
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -10, opacity: 0 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="absolute top-3/5 mt-2 right-10 bg-white z-30 rounded-[6px] shadow-md w-[150px] text-sm"
                  >
                    <Link
                      href={`/vendors/${row.id}`}
                      className="cursor-pointer hover:text-blue-600 flex gap-2 p-3 items-center"
                    >
                      <Icon icon={"fluent-mdl2:view"} height={16} width={16} />
                      View Details
                    </Link>
                  </motion.div>
                </AnimatePresence>
              )}
            </td>
          </>
        )}
      >
        <div className="w-[90%]">
          <SearchInput
            name="search"
            value=""
            placeholder="Search..."
            onChange={() => {}}
          />
        </div>
        <div className="w-[10%] flex items-center gap-2">
          <DropDown
            name="status"
            value=""
            placeholder="Status"
            options={[]}
            onChange={() => {}}
          />
        </div>
      </Table>
    </section>
  );
}
