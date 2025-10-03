"use client";

import {
  logisticsData,
  logisticsStats,
  logisticsTableHead,
} from "@/lib/config/demo-data/logistics";
import SearchInput from "@/ui/forms/search-input";
import DropDown from "@/ui/forms/select-dropdown";
import DashboardStatCard from "@/ui/stat-card";
import StatusTab from "@/ui/status-tab";
import Table from "@/ui/table";
import ViewDetails from "@/ui/table-action";
import { Icon } from "@iconify/react";
import { useState } from "react";

export default function Logistics() {
  const [activeRowId, setActiveRowId] = useState<string | null>(null);
  return (
    <section className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardStatCard data={logisticsStats} />
      </div>
      <Table
        heading="Logistics Management"
        subtitle="Manage and track logistics operations"
        tableHead={logisticsTableHead}
        tableData={logisticsData}
        renderRow={(row) => (
          <>
            <td className="px-6">{row.id}</td>
            {/* rider assigned */}
            <td className="px-6 max-w-[220px]">
              <h4 className="text-sm truncate text-center">
                {row.riderAssigned.name}
              </h4>
              <p className="text-xs truncate text-[#7C7979] text-center">
                {row.riderAssigned.vehicle}
              </p>
            </td>
            {/* sender */}
            <td className="px-6 max-w-[220px]">
              <h4 className="text-sm truncate text-center">
                {row.sender.name}
              </h4>
              <p className="text-xs truncate text-[#7C7979] text-center">
                {row.sender.phoneNumber}
              </p>
            </td>
            <td className="px-6">{row.pickupLocation}</td>
            <td className="px-6">{row.dropoffLocation}</td>
            <td className="px-6">
              <div
                className={`h-[28px] px-3 text-xs w-[90px] min-w-[80px] rounded-lg flex justify-center items-center  ${
                  row.paymentType === "Card"
                    ? "bg-[#FB923C1A] text-[#92400E]"
                    : row.paymentType === "Cash"
                    ? "bg-[#C9D1DA66] text-[#1F1F1F]"
                    : "bg-[#0095DA1A] text-[#0095DA]"
                }`}
              >
                {row.paymentType}
              </div>
            </td>
            <td className="px-6">
              <StatusTab status={row.status} />
            </td>
            <td className="px-6 max-w-[220px]">
              <h4 className="text-sm truncate text-center">
                N{row.earnings.main}
              </h4>
              <p className="text-xs truncate text-[#7C7979] text-center">
                Platform: N{row.earnings.platform}
              </p>
            </td>
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
                <ViewDetails href={`/logistics/${row.id}`} />
              )}
            </td>
          </>
        )}
      >
        <div className="w-full md:w-[70%]">
          <SearchInput
            name="search"
            value=""
            placeholder="Search rider..."
            onChange={() => {}}
          />
        </div>
        <div className="w-full md:w-[30%] flex flex-col md:flex-row md:items-center gap-2">
          <DropDown
            name="status"
            value=""
            placeholder="Status"
            options={[]}
            onChange={() => {}}
          />
          <DropDown
            name="paymentType"
            value=""
            placeholder="Payment Type"
            options={[]}
            onChange={() => {}}
          />
          <DropDown
            name="vehicleType"
            value=""
            placeholder="Vehicle Type"
            options={[]}
            onChange={() => {}}
          />
        </div>
      </Table>
    </section>
  );
}
