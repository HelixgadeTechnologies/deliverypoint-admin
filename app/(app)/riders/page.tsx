"use client";
import {
  riderStats,
  riderTableHead,
} from "@/lib/config/demo-data/riders";
// import { useRoleStore } from "@/store/role-store";
import SearchInput from "@/ui/forms/search-input";
import DropDown from "@/ui/forms/select-dropdown";
import DashboardStatCard from "@/ui/stat-card";
import StatusTab from "@/ui/status-tab";
import Table from "@/ui/table";
import ViewDetails from "@/ui/table-action";
import { Icon } from "@iconify/react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/app/(app)/firebase/config";
import { toast, Toaster } from "react-hot-toast";
import { Status } from "@/types/table-data";
import Loading from "@/app/loading";
import { RiderDetails } from "@/types/riders";


interface RiderTableRow {
  id: string;
  rider: {
    name: string;
    email: string;
    image: string;
  };
  vehicleType: string;
  riderStatus: "Online" | "Offline";
  deliveryStatus: Status;
  accountStatus: Status;
  completedDeliveries: number;
  registration: string;
  location: string;
  ratings: number;
}

export default function Riders() {
  const [activeRowId, setActiveRowId] = useState<string | null>(null);
  const [riders, setRiders] = useState<RiderDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [riderStatusFilter, setRiderStatusFilter] = useState("");
  const [deliveryStatusFilter, setDeliveryStatusFilter] = useState("");
  // const { role } = useRoleStore();

  // Fetch riders data from Firestore
  useEffect(() => {
    const fetchRiders = async () => {
      try {
        const ridersRef = collection(db, "riders");
        
        // Real-time listener for riders updates
        const unsubscribe = onSnapshot(ridersRef, (querySnapshot) => {
          const ridersData: RiderDetails[] = [];
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            ridersData.push({
              id: doc.id,
              uid: data.uid || doc.id,
              fullName: data.fullName || "Unknown Rider",
              email: data.email || "No email",
              phoneNumber: data.phoneNumber || "No phone",
              city: data.city || "Unknown",
              state: data.state || "Unknown",
              accountStatus: data.accountStatus || "Pending",
              isOnline: data.isOnline || false,
              profileCompleted: data.profileCompleted || false,
              profilePhotoUrl: data.profilePhotoUrl || "/placeholder.webp",
              createdAt: data.createdAt,
              updatedAt: data.updatedAt,
              userType: data.userType || "rider",
              currentLocation: data.currentLocation,
              deliveryStats: {
                cancelled: data.deliveryStats?.cancelled || 0,
                completed: data.deliveryStats?.completed || 0,
                total: data.deliveryStats?.total || 0,
                ongoing: data.deliveryStats?.ongoing || 0,
              },
              earnings: {
                thisMonth: data.earnings?.thisMonth || 0,
                thisWeek: data.earnings?.thisWeek || 0,
                today: data.earnings?.today || 0,
                total: data.earnings?.total || 0,
              },
              documents: {
                driversLicense: data.documents?.driversLicense || "",
                governmentId: data.documents?.governmentId || "",
              },
              vehicleInfo: {
                type: data.vehicleInfo?.type || "Not specified",
                color: data.vehicleInfo?.color || "",
                plateNumber: data.vehicleInfo?.plateNumber || "",
              },
              ratings: {
                average: data.ratings?.average || 0,
                totalReviews: data.ratings?.totalReviews || 0,
              }
            } as RiderDetails);
          });
          setRiders(ridersData);
          setLoading(false);
        });

        return unsubscribe;
      } catch (error) {
        console.error("Error fetching riders:", error);
        toast.error("Failed to load riders data");
        setLoading(false);
      }
    };

    fetchRiders();
  }, []);

  // Calculate stats dynamically
const dynamicRiderStats = [
  {
    ...riderStats[0],
    amount: riders.length.toString(),
  },
  {
    ...riderStats[1],
    amount: riders.filter((r) => r.accountStatus === "active").length.toString(),
  },
  {
    ...riderStats[2],
    amount: riders.filter((r) => r.accountStatus === "pending").length.toString(),
  },
  {
    ...riderStats[3],
    amount: riders.filter((r) => r.isOnline === false).length.toString(),
  },
];

  // Transform Firestore data to table format
  const transformRidersToTableData = (riders: RiderDetails[]): RiderTableRow[] => {
    return riders.map(rider => ({
      id: rider.id,
      rider: {
        name: rider.fullName,
        email: rider.email,
        image: rider.profilePhotoUrl || "/placeholder-avatar.png",
      },
      vehicleType: rider.vehicleInfo.type,
      riderStatus: rider.isOnline ? "Online" : "Offline",
      deliveryStatus: mapAccountStatusToDeliveryStatus(rider.accountStatus),
      accountStatus: rider.accountStatus,
      completedDeliveries: rider.deliveryStats.completed,
      registration: new Date(rider.createdAt?.toDate?.() || rider.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }),
      location: `${rider.city}, ${rider.state}`,
      ratings: rider.ratings.average,
    }));
  };

  // Map Firestore accountStatus to deliveryStatus for the table
  const mapAccountStatusToDeliveryStatus = (accountStatus: string): Status => {
    switch (accountStatus) {
      case "approved":
        return "active" as Status;
      case "pending":
        return "pending" as Status;
      case "suspended":
        return "suspended" as Status;
      case "rejected":
        return "cancelled" as Status;
      default:
        return "pending" as Status;
    }
  };

  // Filter riders based on search and filters
  const filteredRiders = riders.filter(rider => {
    const matchesSearch = 
      rider.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rider.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rider.phoneNumber?.includes(searchTerm) ||
      rider.vehicleInfo.type?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRiderStatus = 
      !riderStatusFilter || 
      (riderStatusFilter === "Online" && rider.isOnline) ||
      (riderStatusFilter === "Offline" && !rider.isOnline);

    const matchesDeliveryStatus =
      !deliveryStatusFilter ||
      mapAccountStatusToDeliveryStatus(rider.accountStatus) === deliveryStatusFilter;

    return matchesSearch && matchesRiderStatus && matchesDeliveryStatus;
  });

  const tableData = transformRidersToTableData(filteredRiders);

  if (loading) {
    return <Loading />;
  }

  return (
    <section className="space-y-6">
      <Toaster position="top-right" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardStatCard data={dynamicRiderStats} />
      </div>
      <Table
        heading="Rider Management"
        subtitle="Manage and monitor all platform riders"
        tableHead={riderTableHead}
        tableData={tableData}
        renderRow={(row) => (
          <>
            <td className="px-6 flex items-center gap-2 h-full pt-5">
              <div className="relative size-[50px]">
                <Image
                  src={row.rider.image}
                  alt="Profile Picture"
                  fill
                  priority
                  className="object-cover rounded-full"
                />
              </div>
              <div className="text-sm">
                <h4 className="font-medium capitalize">{row.rider.name}</h4>
                <p className="text-[#7C7979]">{row.rider.email}</p>
              </div>
            </td>
            <td className="px-6">
              <span className="capitalize">{row.vehicleType}</span>
            </td>
            <td className="px-6">
              <div
                className={`h-[28px] w-[84px] rounded-lg text-xs flex justify-center items-center ${
                  row.riderStatus === "Online"
                    ? "bg-[#0095DA15] text-[#0095DA]"
                    : "bg-[#C9D1DA66] text-[#1F1F1F]"
                }`}
              >
                {row.riderStatus}
              </div>
            </td>
            <td className="px-6">
              <StatusTab status={row.accountStatus} />
            </td>
            <td className="px-6 font-medium">{row.completedDeliveries}</td>
            <td className="px-6 text-sm text-[#6E747D]">{row.registration}</td>
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
                <ViewDetails href={`/riders/${row.id}`} />
              )}
            </td>
          </>
        )}
      >
        <div className="w-full md:w-3/4">
          <SearchInput
            name="search"
            value={searchTerm}
            placeholder="Search rider by name, email, phone, or vehicle..."
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-full md:w-1/4 flex flex-col md:flex-row md:items-center gap-2">
          <DropDown
            name="riderStatus"
            value={riderStatusFilter}
            placeholder="Rider Status"
            options={[
              { value: "", label: "All Status" },
              { value: "Online", label: "Online" },
              { value: "Offline", label: "Offline" },
            ]}
            onChange={(value) => setRiderStatusFilter(value)}
          />
          <DropDown
            name="deliveryStatus"
            value={deliveryStatusFilter}
            placeholder="Account Status"
            options={[
              { value: "", label: "All Status" },
              { value: "Active", label: "Active" },
              { value: "Inactive", label: "Inactive" },
              { value: "Suspended", label: "Suspended" },
            ]}
            onChange={(value) => setDeliveryStatusFilter(value)}
          />
        </div>
      </Table>
    </section>
  );
}