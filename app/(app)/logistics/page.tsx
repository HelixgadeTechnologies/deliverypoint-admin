"use client";

import { logisticsTableHead } from "@/lib/config/demo-data/logistics";
import {
  fetchLogistics,
  calculateLogisticsStats,
  mapFirebaseLogisticsToUI,
  formatStatsForDashboard,
} from "@/lib/services/logisticsservice";
import type { Logistics } from "@/types/table-data";
import SearchInput from "@/ui/forms/search-input";
import DropDown from "@/ui/forms/select-dropdown";
import DashboardStatCard from "@/ui/stat-card";
import StatusTab from "@/ui/status-tab";
import Table from "@/ui/table";
import ViewDetails from "@/ui/table-action";
import { Icon } from "@iconify/react";
import { useState, useEffect } from "react";

export default function Logistics() {
  const [activeRowId, setActiveRowId] = useState<string | null>(null);
  const [data, setData] = useState<Logistics[]>([]);
  const [filteredData, setFilteredData] = useState<Logistics[]>([]);
  const [stats, setStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("");
  const [vehicleFilter, setVehicleFilter] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const firebaseData = await fetchLogistics();
        const uiData = mapFirebaseLogisticsToUI(firebaseData);
        const logisticsStats = calculateLogisticsStats(firebaseData);
        const dashboardStats = formatStatsForDashboard(logisticsStats);



        setData(uiData);
        setFilteredData(uiData);
        setStats(dashboardStats);
      } catch (err) {
        console.error("Failed to load logistics data", err);
        setError("Failed to load logistics data");
      } finally {
        setLoading(false);
      }
    };

    loadData();

  }, []);

  // Filter logic
  useEffect(() => {
    let result = data;

    // Search filter (Rider Name)
    if (searchQuery) {
      result = result.filter((item) =>
        item.riderAssigned.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter) {
      result = result.filter(
        (item) => item.status.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    // Payment Type filter
    if (paymentFilter) {
      result = result.filter(
        (item) => item.paymentType.toLowerCase() === paymentFilter.toLowerCase()
      );
    }

    // Vehicle Type filter
    if (vehicleFilter) {
      result = result.filter(
        (item) =>
          item.riderAssigned.vehicle.toLowerCase() ===
          vehicleFilter.toLowerCase()
      );
    }

    setFilteredData(result);
  }, [data, searchQuery, statusFilter, paymentFilter, vehicleFilter]);

  if (loading) {
    return <div className="p-6 text-center">Loading logistics data...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-500">{error}</div>;
  }

  return (
    <section className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardStatCard data={stats} />
      </div>
      <Table
        heading="Logistics Management"
        subtitle="Manage and track logistics operations"
        tableHead={logisticsTableHead}
        tableData={filteredData}
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
                className={`h-[28px] px-3 text-xs w-[90px] min-w-[80px] rounded-lg flex justify-center items-center  ${row.paymentType === "Card"
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
            value={searchQuery}
            placeholder="Search rider..."
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="w-full md:w-[30%] flex flex-col md:flex-row md:items-center gap-2">
          <DropDown
            name="status"
            value={statusFilter}
            placeholder="Status"
            options={[
              { label: "Pending", value: "pending" },
              { label: "In Progress", value: "in progress" },
              { label: "Completed", value: "completed" },
              { label: "Cancelled", value: "cancelled" },
              { label: "Declined", value: "declined" },
            ]}
            onChange={(value) => setStatusFilter(value)}
          />
          <DropDown
            name="paymentType"
            value={paymentFilter}
            placeholder="Payment Type"
            options={[
              { label: "Card", value: "card" },
              { label: "Wallet", value: "wallet" },
              { label: "Cash", value: "cash" },
            ]}
            onChange={(value) => setPaymentFilter(value)}
          />
          <DropDown
            name="vehicleType"
            value={vehicleFilter}
            placeholder="Vehicle Type"
            options={[
              { label: "Bicycle", value: "bicycle" },
              { label: "Motorcycle", value: "motorcycle" },
              { label: "Van", value: "van" },
            ]}
            onChange={(value) => setVehicleFilter(value)}
          />
        </div>
      </Table>
    </section>
  );
}
