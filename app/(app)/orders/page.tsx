"use client";

import {
  orderStats,
  orderTableData,
  orderTableHead,
} from "@/lib/config/demo-data/orders";
import SearchInput from "@/ui/forms/search-input";
import DropDown from "@/ui/forms/select-dropdown";
import DashboardStatCard from "@/ui/stat-card";
import StatusTab from "@/ui/status-tab";
import Table from "@/ui/table";
import ViewDetails from "@/ui/table-action";
import { Icon } from "@iconify/react";
import { useState } from "react";

export default function Orders() {
  const [activeRowId, setActiveRowId] = useState<string | null>(null);
  return (
    <section className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <DashboardStatCard data={orderStats} />
      </div>
      <Table
        heading="Order Management"
        subtitle="Manage and monitor orders"
        tableHead={orderTableHead}
        tableData={orderTableData}
        renderRow={(row) => (
          <>
            <td className="px-6">{row.id}</td>
            <td className="px-6 max-w-[220px]">
              <h4 className="text-sm truncate text-center">{row.customerDetails.name}</h4>
              <p className="text-xs truncate text-[#7C7979] text-center">
                {row.customerDetails.phoneNumber}
              </p>
            </td>
            <td className="px-6">{row.pickupLocation}</td>
            <td className="px-6">{row.dropOffLocation}</td>
            <td className="px-6">{row.riderName}</td>
            <td className="px-6">{row.vendorName}</td>
            <td className="px-6">
              <StatusTab status={row.status} />
            </td>
            <td className="px-6 max-w-[220px]">
              <h4 className="text-sm truncate text-center">N{row.earnings.main}</h4>
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
                <ViewDetails href={`/orders/${row.id}`} />
              )}
            </td>
          </>
        )}
      >
        <div className="w-full md:w-[90%]">
          <SearchInput
            name="search"
            value=""
            placeholder="Search rider..."
            onChange={() => {}}
          />
        </div>
        <div className="w-full md:w-[10%] flex items-center gap-2">
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
