"use client";

import DashboardStatCard from "@/ui/stat-card";
import StatusTab from "@/ui/status-tab";
import Table from "@/ui/table";
import { Icon } from "@iconify/react";
import { useState, useEffect } from "react";
import SearchInput from "@/ui/forms/search-input";
import DropDown from "@/ui/forms/select-dropdown";
import { supportHead, supportStats } from "@/lib/config/demo-data/support";
import ViewDetails from "@/ui/table-action";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/app/(app)/firebase/config";
import { toast, Toaster } from "react-hot-toast";
import { Status } from "@/types/table-data";
import Loading from "@/app/loading";
import { timeAgo } from "@/utils/date-utility";

interface SupportTicket {
  id: string;
  ticketId: string;
  subject: string;
  description: string;
  status: Status;
  priority: string;
  userId: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  adminId: string | null;
  adminResponse: string | null;
  respondedAt: string | null;
}

export default function Support() {
  const [activeRowId, setActiveRowId] = useState<string | null>(null);
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");

  // Fetch support tickets from Firestore
  useEffect(() => {
    const fetchSupportTickets = async () => {
      try {
        setLoading(true);
        const ticketsRef = collection(db, "support_tickets");
        const ticketsSnapshot = await getDocs(ticketsRef);

        const ticketsData: SupportTicket[] = ticketsSnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ticketId: data.ticketId || doc.id,
            subject: data.subject || "No Subject",
            description: data.description || "No description",
            status: data.status || "open",
            priority: data.priority || "medium",
            userId: data.userId || "",
            email: data.email || "No email",
            name: data.name || "No name",
            role: data.role || "",
            createdAt: data.createdAt || "",
            updatedAt: data.updatedAt || "",
            adminId: data.adminId || null,
            adminResponse: data.adminResponse || null,
            respondedAt: data.respondedAt || null,
          };
        });

        setSupportTickets(ticketsData);
      } catch (error) {
        console.error("Error fetching support tickets:", error);
        toast.error("Failed to load support tickets");
      } finally {
        setLoading(false);
      }
    };

    fetchSupportTickets();
  }, []);

  // Calculate stats dynamically
  const dynamicSupportStats = [
    {
      ...supportStats[0],
      amount: supportTickets.length.toString(),
    },
    {
      ...supportStats[1],
      amount: supportTickets.filter((t) => t.status === "open").length.toString(),
    },
    {
      ...supportStats[2],
      amount: supportTickets.filter((t) => t.status === "in progress").length.toString(),
    },
    {
      ...supportStats[3],
      amount: supportTickets.filter((t) => t.status === "resolved").length.toString(),
    },
  ];

  // Filter tickets
  const filteredTickets = supportTickets.filter((ticket) => {
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        ticket.ticketId.toLowerCase().includes(searchLower) ||
        ticket.subject.toLowerCase().includes(searchLower) ||
        ticket.description.toLowerCase().includes(searchLower) ||
        ticket.email.toLowerCase().includes(searchLower);

      if (!matchesSearch) return false;
    }

    if (statusFilter && ticket.status !== statusFilter) {
      return false;
    }

    if (priorityFilter && ticket.priority !== priorityFilter) {
      return false;
    }

    return true;
  });

  // Status options
  const statusOptions = [
    { value: "", label: "All Status" },
    { value: "open", label: "Open" },
    { value: "in-progress", label: "In Progress" },
    { value: "resolved", label: "Resolved" },
    { value: "closed", label: "Closed" },
  ];

  // Priority options
  const priorityOptions = [
    { value: "", label: "All Priority" },
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
    { value: "urgent", label: "Urgent" },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "low":
        return "bg-gray-100 text-gray-600";
      case "medium":
        return "bg-blue-100 text-blue-600";
      case "high":
        return "bg-orange-100 text-orange-600";
      case "urgent":
        return "bg-red-100 text-red-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <section className="space-y-6">
      <Toaster position="top-right" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardStatCard data={dynamicSupportStats} />
      </div>

      <Table
        heading="Support Tickets"
        subtitle="Manage support tickets from vendors"
        tableHead={supportHead}
        tableData={filteredTickets}
        renderRow={(row) => (
          <>
            <td className="px-6 py-4 text-sm">{row.ticketId}</td>
            <td className="px-6 py-4 max-w-[250px]">
              <h4 className="text-sm truncate">{row.subject}</h4>
              <p className="text-xs text-[#7C7979] truncate">{row.description}</p>
            </td>
            <td className="px-6 py-4 text-sm">{row.email}</td>
            <td className="px-6 py-4">
              <span className={`px-3 py-1 rounded-md text-xs capitalize ${getPriorityColor(row.priority)}`}>
                {row.priority}
              </span>
            </td>
            <td className="px-6 py-4 text-sm text-[#7C7979]">
              {timeAgo(row.createdAt)}
            </td>
            <td className="px-6 py-4 capitalize">
              <StatusTab status={row.status} />
            </td>
            <td className="px-6 py-4 relative">
              <div className="flex justify-center items-center">
                <Icon
                  icon="uiw:more"
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
                <ViewDetails href={`/support/${row.id}`} />
              )}
            </td>
          </>
        )}
      >
        <div className="w-full md:w-3/5">
          <SearchInput
            name="search"
            value={searchTerm}
            placeholder="Search tickets..."
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-full md:w-2/5 flex items-center gap-2">
          <DropDown
            name="status"
            value={statusFilter}
            placeholder="Status"
            options={statusOptions}
            onChange={(value) => setStatusFilter(value)}
          />
          <DropDown
            name="priority"
            value={priorityFilter}
            placeholder="Priority"
            options={priorityOptions}
            onChange={(value) => setPriorityFilter(value)}
          />
        </div>
      </Table>
    </section>
  );
}