"use client";

import { userTableData, userTableHead } from "@/lib/config/demo-data/users";
import SearchInput from "@/ui/forms/search-input";
import DropDown from "@/ui/forms/select-dropdown";
import StatusTab from "@/ui/status-tab";
import Table from "@/ui/table";
import ViewDetails from "@/ui/table-action";
import Image from "next/image";
import { useState } from "react";
import { Icon } from "@iconify/react";
import { useRoleStore } from "@/store/role-store";

export default function Users() {
  const [activeRowId, setActiveRowId] = useState<string | null>(null);

   const { role } = useRoleStore();
  
    const filteredTableData = role === "admin" 
      ? userTableData.filter(data => data.status === "Suspended")  // Admin: only active users
      : userTableData;  // Super Admin: all users
  return (
    <Table
      heading="User Management"
      subtitle="Manage and monitor user accounts"
      tableHead={userTableHead}
      tableData={filteredTableData}
      renderRow={(row) => (
        <>
          <td className="px-6 flex items-center gap-2 h-full pt-5">
            <Image
              src={row.user.image}
              alt="Profile Picture"
              height={50}
              width={50}
              className="object-cover"
            />
            <div className="text-sm">
              <h4>{row.user.name}</h4>
              <p className="text-[#7C7979]">{row.user.email}</p>
            </div>
          </td>
          <td className="px-6">{row.phoneNumber}</td>
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
              <ViewDetails href={`/users/${row.id}`} />
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
      <div className="w-full md:w-[10%]">
        <DropDown
          name="riderStatus"
          value=""
          placeholder="Rider Status"
          options={[]}
          onChange={() => {}}
        />
      </div>
    </Table>
  );
}
