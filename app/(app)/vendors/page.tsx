"use client";
import { vendorHead, vendorStats } from "@/lib/config/demo-data/vendors";
import SearchInput from "@/ui/forms/search-input";
import DropDown from "@/ui/forms/select-dropdown";
import DashboardStatCard from "@/ui/stat-card";
import StatusTab from "@/ui/status-tab";
import Table from "@/ui/table";
import Image from "next/image";
import { Icon } from "@iconify/react";
import { useState, useEffect } from "react";
import ViewDetails from "@/ui/table-action";
// import { useRoleStore } from "@/store/role-store";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/app/(app)/firebase/config";
import { toast, Toaster } from "react-hot-toast";
import { Status } from "@/types/table-data";
import Loading from "@/app/loading";
import { timeAgo } from "@/utils/date-utility";

interface Vendor {
  id: string;
  vendor: {
    vendorName: string;
    vendorBusiness: string;
    image: string;
  };
  contact: {
    email: string;
    phone: string;
  };
  status: Status;
  totalOrders: number;
  createdAt: string;
}

export default function Vendors() {
  const [activeRowId, setActiveRowId] = useState<string | null>(null);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Fetch vendors from Firestore
  useEffect(() => {
    const fetchVendors = async () => {
      try {
        setLoading(true);
        const vendorsRef = collection(db, "vendors");
        const vendorsSnapshot = await getDocs(vendorsRef);
        console.log(vendorsRef)

        const vendorsData: Vendor[] = vendorsSnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            vendor: {
              vendorName: data.businessName || data.vendorName || "Unknown Vendor",
              vendorBusiness: data.businessDescription || data.businessCategory || "Business",
              image: data.logoUrl || "/placeholder.svg",
            },
            contact: {
              email: data.email || "No email",
              phone: data.phoneNumber || "No phone",
            },
            status: data.status || "Active",
            totalOrders: data.totalOrders || 0,
            createdAt: data.createdAt,
          };
        });

        setVendors(vendorsData);
      } catch (error) {
        console.error("Error fetching vendors:", error);
        toast.error("Failed to load vendors");
      } finally {
        setLoading(false);
      }
    };

    fetchVendors();
  }, []);

  console.log(vendors);

  // Filter vendors based on role, search term, and status
  const filteredVendors = vendors.filter(vendor => {
    // Role-based filtering
    // if (role == "admin" && vendor.status !== "Active") {
    //   return false;
    // }

    // Search term filtering
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        vendor.vendor.vendorName.toLowerCase().includes(searchLower) ||
        vendor.vendor.vendorBusiness.toLowerCase().includes(searchLower) ||
        vendor.contact.email.toLowerCase().includes(searchLower) ||
        vendor.contact.phone.includes(searchTerm);

      if (!matchesSearch) return false;
    }

    // Status filtering
    if (statusFilter && vendor.status !== statusFilter) {
      return false;
    }

    return true;
  });

  // Calculate vendor stats dynamically
  const dynamicVendorStats = [
    {
      ...vendorStats[0],
      amount: vendors.length.toString(),
    },
    {
      ...vendorStats[1],
      amount: vendors.filter(v => v.status === "Active").length.toString(),
    },
    {
      ...vendorStats[2],
      amount: vendors.filter(v => v.status === "Pending").length.toString(),
    },
    {
      ...vendorStats[3],
      amount: vendors.filter(v => v.status === "Suspended").length.toString(),
    },
  ];

  // Status options for dropdown
  const statusOptions = [
    { value: "", label: "All Status" },
    { value: "Active", label: "Active" },
    { value: "Pending", label: "Pending" },
    { value: "Suspended", label: "Suspended" },
  ];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
  };

  const truncate = (text: string, max = 120) => {
    if (!text) return "";
    if (text.length <= max) return text;
    const slice = text.slice(0, max);
    const lastSpace = slice.lastIndexOf(" ");
    return (lastSpace > 0 ? slice.slice(0, lastSpace) : slice) + "...";
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <section className="space-y-6">
      <Toaster position="top-right" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardStatCard data={dynamicVendorStats} />
      </div>

      <Table
        heading="Vendor Management"
        subtitle="Manage and monitor all platform vendors"
        tableHead={vendorHead}
        tableData={filteredVendors}
        renderRow={(row) => (
          <>
            <td className="px-6 flex items-center gap-2 h-full pt-5 min-w-0">
              <div className="size-[50px] relative">
                <Image
                  src={row.vendor.image}
                  alt="Profile Picture"
                  fill
                  className="object-cover rounded-full"
                />
              </div>
              <div className="text-sm w-4/5 min-w-0">
                <h4 className="truncate">{row.vendor.vendorName}</h4>
                <p className="text-[#7C7979] whitespace-normal break-words max-w-full">{truncate(row.vendor.vendorBusiness)}</p>
              </div>
            </td>
            <td className="px-6 text-sm min-w-0">
              <h4>{row.contact.email}</h4>
              <p className="text-[#7C7979]">{row.contact.phone}</p>
            </td>
            <td className="px-6">
              <StatusTab status={row.status} />
            </td>
            <td className="px-6 text-center">{row.totalOrders}</td>
            {timeAgo(row.createdAt || "")}
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
            value={searchTerm}
            placeholder="Search vendor..."
            onChange={handleSearchChange}
          />
        </div>
        <div className="w-full md:w-[10%] flex items-center gap-2">
          <DropDown
            name="status"
            value={statusFilter}
            placeholder="Status"
            options={statusOptions}
            onChange={handleStatusChange}
          />
        </div>
      </Table>
    </section>
  );
}