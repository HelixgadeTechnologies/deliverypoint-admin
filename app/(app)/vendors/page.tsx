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
import { Icon } from "@iconify/react";
import { useState } from "react";
import ViewDetails from "@/ui/table-action";
import { useRoleStore } from "@/store/role-store";

export default function Vendors() {
  const [activeRowId, setActiveRowId] = useState<string | null>(null);
  const { role } = useRoleStore();

  // const filteredTableData = role === "admin" 
  //   ? vendorData.filter(data => data.status === "Active")  // Admin: only active vendors
  //   : vendorData;  // Super Admin: all vendors

  return (
    <section className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                <ViewDetails href={`/vendors/${row.id}`} />
              )}
            </td>
          </>
        )}
      >
        <div className="w-full md:w-[90%]">
          <SearchInput
            name="search"
            value=""
            placeholder="Search vendor..."
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
