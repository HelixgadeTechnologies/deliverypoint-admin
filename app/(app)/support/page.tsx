"use client";

import DashboardStatCard from "@/ui/stat-card";
import StatusTab from "@/ui/status-tab";
import Table from "@/ui/table";
import { Icon } from "@iconify/react";
import { useState } from "react";
import SearchInput from "@/ui/forms/search-input";
import DropDown from "@/ui/forms/select-dropdown";
import { supportHead, supportStats, supportTickets } from "@/lib/config/demo-data/support";
import ViewDetails from "@/ui/table-action";


export default function Support() {
  const [activeRowId, setActiveRowId] = useState<string | null>(null);


  return (
    <section className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <DashboardStatCard data={supportStats} />
      </div>
      <Table
        heading="Support"
        subtitle="Manage support tickets from users, vendors, and riders"
        tableHead={supportHead}
        tableData={supportTickets}
        renderRow={(row) => (
          <>
            <td className="px-6">{row.ticketID}</td>
            <td className="px-6">{row.submittedBy}</td>
            <td className="px-6">{row.userType}</td>
            <td className="px-6 max-w-[220px]">
              <h4 className="text-sm text-center truncate">
                {row.subject.title}
              </h4>
              <p className="text-xs text-center truncate text-[#7C7979]">
                {row.subject.description}
              </p>
            </td>
            <td className="px-6">{row.dateCreated}</td>
            <td className="px-6">
              <StatusTab status={row.status} />
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
                    setActiveRowId((prev) =>
                      prev === row.id ? null : row.id
                    )
                  }
                />
              </div>
              {activeRowId === row.id && (
              <ViewDetails href={`/support/${row.id}`} />
              )}
            </td>
          </>
        )}
      >
        <div className="w-full md:w-4/5">
          <SearchInput
            name="search"
            value=""
            placeholder="Search tickets..."
            onChange={() => {}}
          />
        </div>
        <div className="w-full md:w-1/5 flex items-center gap-2">
          <DropDown
          name="userType"
          value=""
          placeholder="User Type"
          options={[]}
          onChange={() => {}}
          />
            <DropDown
          name="orderStatus"
          value=""
          placeholder="Order Status"
          options={[]}
          onChange={() => {}}
          />
        </div>
      </Table>
    </section>
  );
}
