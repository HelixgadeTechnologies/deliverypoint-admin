"use client";

import { Ticket } from "@/types/support";
import DashboardStatCard from "@/ui/stat-card";
import StatusTab from "@/ui/status-tab";
import Table from "@/ui/table";
import { Icon } from "@iconify/react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SearchInput from "@/ui/forms/search-input";
import DropDown from "@/ui/forms/select-dropdown";

// export const metadata = {
//   title: "Support - Delivery Point | Admin",
//   description: "Manage support tickets from users, vendors, and riders",
// };

export default function Support() {
  const [activeRowId, setActiveRowId] = useState<string | null>(null);

  const stats = [
    {
      title: "Total Tickets",
      amount: "0",
      icon: "majesticons:headset-line",
      iconBg: "#0095DA",
    },
    {
      title: "Open Tickets",
      amount: "0",
      icon: "simple-line-icons:close",
      iconBg: "#FF4D4F",
    },
    {
      title: "In Progress",
      amount: "0",
      icon: "ion:time-outline",
      iconBg: "#FFAC33",
    },
    {
      title: "Resolved Today",
      amount: "0",
      icon: "simple-line-icons:check",
      iconBg: "#21C788",
    },
  ];

  const head = [
    "Ticket ID",
    "Submitted By",
    "User Type",
    "Subject",
    "Date Created",
    "Status",
    "Actions",
  ];

  const tickets: Ticket[] = [
    {
      ticketID: "#TK-1001",
      submittedBy: "John Doe",
      userType: "Rider",
      subject: {
        title: "App Keeps Crashing",
        description: "The rider app keeps crashing when I try to mark ...",
      },
      dateCreated: "14 Mar, 2025	",
      status: "In Progress",
    },
    {
      ticketID: "#TK-1002",
      submittedBy: "John Doe",
      userType: "User",
      subject: {
        title: "Order not received",
        description:
          "My order #ORD-12345 was marked as delivered but I never received it. The rider said they left it at my door but nothing was there.",
      },
      dateCreated: "14 Mar, 2025	",
      status: "Resolved",
    },
    {
      ticketID: "#TK-1003",
      submittedBy: "John Doe",
      userType: "Vendor",
      subject: {
        title: "Payment Settlement Delay",
        description: "My weekly settlement is 3 days late. Usually receiv...",
      },
      dateCreated: "14 Mar, 2025	",
      status: "Open",
    },
  ];

  return (
    <section className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <DashboardStatCard data={stats} />
      </div>
      <Table
        heading="Support"
        subtitle="Manage support tickets from users, vendors, and riders"
        tableHead={head}
        tableData={tickets}
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
                      prev === row.ticketID ? null : row.ticketID
                    )
                  }
                />
              </div>
              {activeRowId === row.ticketID && (
                <AnimatePresence>
                  <motion.div
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -10, opacity: 0 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="absolute top-3/5 mt-2 right-10 bg-white z-30 rounded-[6px] shadow-md w-[150px] text-sm"
                  >
                    <div
                      // onClick={() => handleViewUser(row, setActiveRowId)}
                      className="cursor-pointer hover:text-blue-600 flex gap-2 p-3 items-center"
                    >
                      <Icon icon={"fluent-mdl2:view"} height={16} width={16} />
                      View Details
                    </div>
                  </motion.div>
                </AnimatePresence>
              )}
            </td>
          </>
        )}
      >
        <div className="w-4/5">
          <SearchInput
            name="search"
            value=""
            placeholder="Search Rider..."
            onChange={() => {}}
          />
        </div>
        <div className="w-1/5 flex items-center gap-2">
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
