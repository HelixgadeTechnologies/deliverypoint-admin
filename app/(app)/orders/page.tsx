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
import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/app/(app)/firebase/config";
import { Order } from "@/types/order";

export default function Orders() {
  const [activeRowId, setActiveRowId] = useState<string | null>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(orderStats);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const ordersRef = collection(db, "orders");
        const snapshot = await getDocs(ordersRef);

        let totalOrders = 0;
        let completed = 0;
        let inProgress = 0;
        let declinedCancelled = 0;

        const data = snapshot.docs.map((doc) => {
          const d = doc.data() as Order;
          // createdAt is stored as ISO string in your example -> keep ISO or Date as needed
          const createdAtIso = d.createdAt ? new Date(d.createdAt).toISOString() : "";

          // Infer vendor name from items if not present at top level
          let totalItems = Object.keys(d.items).length;
          let vendorName = totalItems > 1 ? "Multiple Vendors" : d.vendorName || "";

          // Statistics Calculation
          totalOrders++;
          const status = d.status?.toLowerCase() || "pending";
          const isDelivered = d.deliveryStatus === "delivered";
          const isCanceled = d.status === "cancelled";

          if (isCanceled || status === "cancelled" || status === "declined") {
            declinedCancelled++;
          } else if (isDelivered || status === "completed") {
            completed++;
          } else if (status === "in progress" || status === "pending") {
            inProgress++;
          }

          return {
            id: doc.id,
            orderId: d.orderId || doc.id,
            customerDetails: {
              name: d.customerName || "Unknown",
              phoneNumber: "", // Not in data
            },
            pickupLocation: "", // Not in data
            dropOffLocation: d.deliveryAddress || "",
            vendorAddress: d.vendorAddress || "",
            riderName: d.riderName || "searching",
            vendorName: vendorName || "Unknown",
            status: d.status || "pending",
            earnings: {
              main: d.totalAmount ?? 0,
              platform: 0, // Not in data
            },
            items: d.items || {},
            createdAt: createdAtIso,
            raw: d,
          };
        });

        setOrders(data);

        // Update Stats
        setStats([
          {
            title: "Orders",
            amount: totalOrders.toString(),
            icon: "solar:wallet-outline",
            iconBg: "#0095DA",
            percent: 0,
          },
          {
            title: "Completed",
            amount: completed.toString(),
            icon: "prime:check-circle",
            iconBg: "#21C788",
            percent: 0,
          },
          {
            title: "In Progress",
            amount: inProgress.toString(),
            icon: "tdesign:time",
            iconBg: "#FFAC33",
            percent: 0,
          },
          {
            title: "Declined/Cancelled",
            amount: declinedCancelled.toString(),
            icon: "gg:close-o",
            iconBg: "#FF4D4F",
            percent: 0,
          },
        ]);

      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Filter orders based on search and status
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      searchTerm === "" ||
      order.orderId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.vendorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.riderName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerDetails?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.status?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "" ||
      order.status?.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  // Status options for dropdown
  const statusOptions = [
    { value: "", label: "All Status" },
    { value: "pending", label: "Pending" },
    { value: "accepted", label: "Accepted" },
    { value: "completed", label: "Completed" },
    { value: "cancelled", label: "Cancelled" },
  ];

  if (loading) {
    return (
      <section className="space-y-6">
        <div className="text-center py-8">Loading orders…</div>
      </section>
    );
  }


  return (
    <section className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardStatCard data={stats} />
      </div>
      <Table
        heading="Order Management"
        subtitle="Manage and monitor orders"
        tableHead={orderTableHead}
        tableData={filteredOrders}
        renderRow={(row) => (
          <>
            <td className="px-6">{row.orderId}</td>
            <td className="px-6 max-w-[220px]">
              <h4 className="text-sm truncate text-center">
                {row.customerDetails.name}
              </h4>
              <p className="text-xs truncate text-[#7C7979] text-center">
                {row.customerDetails.phoneNumber}
              </p>
            </td>
            <td className="px-6">{row.vendorAddress}</td>
            <td className="px-6">{row.dropOffLocation}</td>
            <td className="px-6">{row.riderName}</td>
            <td className="px-6">{row.vendorName}</td>
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
                <ViewDetails href={`/orders/${row.id}`} />
              )}
            </td>
          </>
        )}
      >
        <div className="w-full md:w-[90%]">
          <SearchInput
            name="search"
            value={searchTerm}
            placeholder="Search orders..."
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-full md:w-[10%] flex items-center gap-2">
          <DropDown
            name="status"
            value={statusFilter}
            placeholder="Status"
            options={statusOptions}
            onChange={(value) => setStatusFilter(value)}
          />
        </div>
      </Table>
    </section>
  );
}
