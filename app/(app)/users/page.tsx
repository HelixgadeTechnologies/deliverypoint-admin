"use client";

import { userTableHead } from "@/lib/config/demo-data/users";
import SearchInput from "@/ui/forms/search-input";
import DropDown from "@/ui/forms/select-dropdown";
import StatusTab from "@/ui/status-tab";
import Table from "@/ui/table";
import ViewDetails from "@/ui/table-action";
import Image from "next/image";
import { useState, useEffect, ChangeEvent } from "react";
import { Icon } from "@iconify/react";
// import { useRoleStore } from "@/store/role-store";
import { collection, getDocs, query, where, getCountFromServer } from "firebase/firestore";
import { db } from "@/app/(app)/firebase/config";
import { timeAgo } from "@/utils/date-utility";
import Loading from "@/app/loading";
import { Status } from "@/types/table-data";

interface Customer {
  id: string;
  uid: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  accountType: string;
  address: string;
  city: string;
  state: string;
  createdAt: string;
  updatedAt: string;
  profileCompleted: boolean;
  profileImage?: string; // Profile image URL
  onboardingStatus: {
    currentStep: number;
    onboardingComplete: boolean;
  };
  accountStatus: Status; // Added for status management
  totalOrders?: number; // Total orders count
}

export default function Users() {
  const [activeRowId, setActiveRowId] = useState<string | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // const { role } = useRoleStore();

  // Fetch customers from Firestore
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        const customersRef = collection(db, "customers");
        const customersSnapshot = await getDocs(customersRef);

        const customersData = await Promise.all(
          customersSnapshot.docs.map(async (doc) => {
            const customerData = doc.data();

            // Fetch order count for this customer
            const ordersRef = collection(db, "orders");
            const ordersQuery = query(
              ordersRef,
              where("customerId", "==", doc.id)
            );
            const orderCountSnapshot = await getCountFromServer(ordersQuery);
            const totalOrders = orderCountSnapshot.data().count;

            return {
              id: doc.id,
              ...customerData,
              totalOrders,
            };
          })
        ) as Customer[];

        setCustomers(customersData);
      } catch (error) {
        console.error("Error fetching customers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  // Filter customers based on search and status
  const filteredCustomers = customers.filter((customer) => {
    const fullName = `${customer.firstName} ${customer.lastName}`.toLowerCase();
    const matchesSearch =
      fullName.includes(searchTerm.toLowerCase()) ||
      customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phoneNumber?.includes(searchTerm);

    // Since there's no accountStatus field, we'll use onboarding status
    const matchesStatus =
      statusFilter === "" ||
      (statusFilter === "completed" &&
        customer.onboardingStatus?.onboardingComplete) ||
      (statusFilter === "pending" &&
        !customer.onboardingStatus?.onboardingComplete);

    return matchesSearch && matchesStatus;
  });

  // Status options for dropdown - using onboarding status since no accountStatus field
  const statusOptions = [
    { value: "", label: "All Status" },
    { value: "completed", label: "Completed" },
    { value: "pending", label: "Pending" },
  ];

  // Get status for display - using onboarding completion as status
  // const getDisplayStatus = (customer: Customer) => {
  //   return customer.accountStatus ? "active" : "pending";
  // };

  if (loading) return <Loading />

  return (
    <Table
      heading="User Management"
      subtitle="Manage and monitor user accounts"
      tableHead={userTableHead}
      tableData={filteredCustomers}
      renderRow={(row) => (
        <>
          <td className="px-6 flex items-center gap-2 h-full pt-5">
            <Image
              src={row.profileImage || "/placeholder.webp"}
              alt="Profile Picture"
              height={50}
              width={50}
              className="object-cover rounded-full"
            />
            <div className="text-sm">
              <h4 className="capitalize">
                {row.firstName} {row.lastName}
              </h4>
              <p className="text-[#7C7979]">{row.email}</p>
            </div>
          </td>
          <td className="px-6">{row.phoneNumber}</td>
          <td className="px-6">
            <StatusTab
              status={
                row.onboardingStatus?.onboardingComplete
                  ? "active"
                  : "pending"
              }
            />
          </td>
          <td className="px-6">{row.totalOrders || 0}</td>
          <td className="px-6">{timeAgo(row.createdAt)}</td>
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
      )}>
      <div className="w-full md:w-[90%]">
        <SearchInput
          name="search"
          value={searchTerm}
          placeholder="Search customers..."
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setSearchTerm(e.target.value)
          }
        />
      </div>
      <div className="w-full md:w-[10%]">
        <DropDown
          name="status"
          value={statusFilter}
          placeholder="Status"
          options={statusOptions}
          onChange={(value) => setStatusFilter(value)}
        />
      </div>
    </Table>
  );
}
