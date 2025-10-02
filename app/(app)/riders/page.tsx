"use client";
import {
  riderStats,
  riderTableData,
  riderTableHead,
} from "@/lib/config/demo-data/riders";
import SearchInput from "@/ui/forms/search-input";
import DropDown from "@/ui/forms/select-dropdown";
import DashboardStatCard from "@/ui/stat-card";
import StatusTab from "@/ui/status-tab";
import Table from "@/ui/table";
import ViewDetails from "@/ui/table-action";
import { Icon } from "@iconify/react";
import Image from "next/image";
import { useState } from "react";
export default function Riders() {
  const [activeRowId, setActiveRowId] = useState<string | null>(null);
  return (
    <section className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <DashboardStatCard data={riderStats} />
      </div>
      <Table
        heading="Rider Management"
        subtitle="Manage and monitor all platform riders"
        tableHead={riderTableHead}
        tableData={riderTableData}
        renderRow={(row) => (
          <>
            <td className="px-6 flex items-center gap-2 h-full pt-5">
              <Image
                src={row.rider.image}
                alt="Profile Picture"
                height={50}
                width={50}
                className="object-cover"
              />
              <div className="text-sm">
                <h4>{row.rider.name}</h4>
                <p className="text-[#7C7979]">{row.rider.email}</p>
              </div>
            </td>
            <td className="px-6">{row.vehicleType}</td>
            <td className="px-6">
              <div
                className={`h-[28px] w-[84px] rounded-lg text-xs flex justify-center items-center ${
                  row.riderStatus === "Online"
                    ? "bg-[#0095DA15] text-[#0095DA]"
                    : "bg-[#C9D1DA66] text-[#1F1F1F]"
                }`}
              >
                {row.riderStatus}
              </div>
            </td>
            <td className="px-6">
              <StatusTab status={row.deliveryStatus} />
            </td>
            <td className="px-6">{row.completedDeliveries}</td>
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
                <ViewDetails href={`/riders/${row.id}`} />
              )}
            </td>
          </>
        )}
      >
        <div className="w-full md:w-3/4">
          <SearchInput
            name="search"
            value=""
            placeholder="Search rider..."
            onChange={() => {}}
          />
        </div>
        <div className="w-full md:w-1/4 flex flex-col md:flex-row md:items-center gap-2">
          <DropDown
            name="riderStatus"
            value=""
            placeholder="Rider Status"
            options={[]}
            onChange={() => {}}
          />
          <DropDown
            name="deliveryStatus"
            value=""
            placeholder="Delivery Status"
            options={[]}
            onChange={() => {}}
          />
        </div>
      </Table>
    </section>
  );
}
