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
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/app/(app)/firebase/config";
import { timeAgo } from "@/utils/date-utility";
import Loading from "@/app/loading";

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
  onboardingStatus: {
    currentStep: number;
    onboardingComplete: boolean;
  };
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

        const customersData = customersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Customer[];

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
  const getDisplayStatus = (customer: Customer) => {
    return customer.onboardingStatus?.onboardingComplete ? "Active" : "Pending";
  };

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
              src="/placeholder.svg"
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
            <StatusTab status={getDisplayStatus(row)} />
          </td>
          <td className="px-6">0</td>{" "}
          {/* Total Orders - hardcoded as 0 since not in data */}
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
