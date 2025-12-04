"use client";
import { usePathname, useRouter } from "next/navigation";
import { JSX, useState, useEffect } from "react";
import BackButton from "@/ui/back-button";
import Button from "@/ui/button";
import CardComponent from "@/ui/card-wrapper";
import StatusTab from "@/ui/status-tab";
import Image from "next/image";
import Heading from "@/ui/text-heading";
import SummaryRow from "@/ui/summary-row";
import Divider from "@/ui/divider";
import UserActivatedModal from "@/components/users/user-activated-modal";
import UserDeactivateModal from "@/components/users/user-deactivate-modal";
import OrderDetailsModal from "@/components/users/user-order-details-modal";
import { UserOrderDetails } from "@/types/users";
// import { useRoleStore } from "@/store/role-store";
import { doc, getDoc, setDoc, collection, query, where, getDocs, orderBy, limit, getCountFromServer } from "firebase/firestore";
import { db } from "@/app/(app)/firebase/config";
import Loading from "@/app/loading";
import { formatDateTime } from "@/utils/date-utility";
import { toast, Toaster } from "react-hot-toast";

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
  accountStatus?: string; // Added for status management
  suspensionReason?: string; // Added for suspension reasons
}

export default function UserDetails() {
  // for order details
  const [selectedOrder, setSelectedOrder] = useState<UserOrderDetails | null>(
    null
  );
  const [selectedUser, setSelectedUser] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalOrderSummary, setTotalOrderSummary] = useState(0);
  const [lastOrderDate, setLastOrderDate] = useState<string | null>(null);
  // const { role } = useRoleStore();
  const router = useRouter();

  const pathname = usePathname();
  const [userActivatedModal, setUserActivatedModal] = useState(false);
  const [userDeactivatedModal, setUserDeactivatedModal] = useState(false);

  const userId = pathname.split("/").pop();
  // Fetch user data from Firestore
  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) return;

      try {
        const userRef = doc(db, "customers", userId);
        const userSnapshot = await getDoc(userRef);

        if (userSnapshot.exists()) {
          setSelectedUser({
            id: userSnapshot.id,
            ...userSnapshot.data(),
          } as Customer);
        }

        // Fetch orders data
        const ordersRef = collection(db, "orders");

        // 1. Get total orders count
        const ordersCountQuery = query(
          ordersRef,
          where("customerId", "==", userId)
        );
        const ordersCountSnapshot = await getCountFromServer(ordersCountQuery);
        setTotalOrders(ordersCountSnapshot.data().count);

        // 2. Get top 3 recent orders
        const recentOrdersQuery = query(
          ordersRef,
          where("customerId", "==", userId),
          orderBy("createdAt", "desc"),
          limit(3)
        );
        const recentOrdersSnapshot = await getDocs(recentOrdersQuery);
        const orders = recentOrdersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setRecentOrders(orders);

        // 3. Calculate total order summary (sum of all order amounts)
        const allOrdersQuery = query(
          ordersRef,
          where("customerId", "==", userId)
        );
        const allOrdersSnapshot = await getDocs(allOrdersQuery);
        let totalSum = 0;
        let latestOrderDate: string | null = null;

        allOrdersSnapshot.forEach((doc) => {
          const data = doc.data();
          totalSum += data.totalAmount || 0;

          // Track the latest order date
          if (!latestOrderDate || data.createdAt > latestOrderDate) {
            latestOrderDate = data.createdAt;
          }
        });

        setTotalOrderSummary(totalSum);
        setLastOrderDate(latestOrderDate);

      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  // Function to update user status - creates field if it doesn't exist using setDoc merge
  const updateUserStatus = async (newStatus: string, suspensionReason?: string) => {
    if (!selectedUser || !userId) return;

    setActionLoading(true);
    try {
      const userRef = doc(db, "customers", userId);

      const updateData: any = {
        accountStatus: newStatus,
        updatedAt: new Date().toISOString(),
      };

      if (suspensionReason) {
        updateData.suspensionReason = suspensionReason;
      } else if (newStatus === "active") {
        // Clear suspension reason when activating
        updateData.suspensionReason = null;
      }

      // Use setDoc with merge: true to create fields if they don't exist
      await setDoc(userRef, updateData, { merge: true });

      // Update local state
      setSelectedUser(prev => prev ? {
        ...prev,
        accountStatus: newStatus,
        ...(suspensionReason && { suspensionReason }),
        ...(newStatus === "active" && { suspensionReason: undefined }) // Clear suspension reason on activate
      } : null);

      toast.success(`User ${getStatusActionMessage(newStatus)} successfully!`);

      // Close modal
      if (newStatus === "active") {
        setUserActivatedModal(false);
      } else if (newStatus === "suspended") {
        setUserDeactivatedModal(false);
      }

      // Refresh the page after a short delay
      setTimeout(() => {
        router.refresh();
      }, 1000);

    } catch (error) {
      console.error("Error updating user status:", error);
      toast.error("Failed to update user status");
    } finally {
      setActionLoading(false);
    }
  };

  // Helper function for status messages
  const getStatusActionMessage = (status: string) => {
    switch (status) {
      case "active":
        return "activated";
      case "suspended":
        return "Suspended";
      default:
        return "updated";
    }
  };

  // Action handlers
  const handleActivateUser = async () => {
    await updateUserStatus("active");
  };

  const handleSuspendUser = async (reason: string) => {
    await updateUserStatus("suspended", reason);
  };

  // Get status for display - using accountStatus if available, otherwise onboarding completion
  const getDisplayStatus = (user: Customer) => {
    if (user.accountStatus) {
      return user.accountStatus === "active"
        ? "active"
        : user.accountStatus === "suspended"
          ? "suspended"
          : "pending";
    }
    return user.onboardingStatus?.onboardingComplete ? "active" : "pending";
  };

  if (loading) return <Loading />;
  if (!selectedUser) return <div>User not found.</div>;

  const userStatus = getDisplayStatus(selectedUser);

  // for buttons - change onClick functions to api calls that in turn trigger modal later
  const statusActions: Record<string, JSX.Element> = {
    active: (
      <Button
        content="Suspend User"
        variant="error"
        icon="mynaui:pause"
        onClick={() => setUserDeactivatedModal(true)}
        isDisabled={actionLoading}
      />
    ),
    pending: (
      <Button
        content="Activate User"
        variant="normal"
        icon="material-symbols:check-rounded"
        onClick={() => setUserActivatedModal(true)}
        isDisabled={actionLoading}
      />
    ),
    suspended: (
      <Button
        content="Activate User"
        variant="normal"
        icon="material-symbols:check-rounded"
        onClick={() => setUserActivatedModal(true)}
        isDisabled={actionLoading}
      />
    ),
  };

  // for card on suspended users
  const statusCard: Record<string, JSX.Element> = {
    Suspended: (
      <div className="bg-[#FF4D4F15] py-2 px-4 rounded-2xl text-[#FF4D4F] w-full">
        <h4 className="font-semibold text-base">Reason</h4>
        <p className="text-sm font-normal">
          {selectedUser.suspensionReason ||
            "User was involved in actions not conforming to company's policy"}
        </p>
      </div>
    ),
  };

  return (
    <>
      {/* main details */}
      <CardComponent>
        <div className="space-y-6">
          {/* back button */}
          <BackButton text="Back to Users" />

          {/* header */}
          <div className="flex flex-col md:flex-row items-start justify-between gap-4">
            <div className="flex flex-col md:flex-row items-start md:items-center relative gap-3">
              <Image
                src={selectedUser.profileImage || "/placeholder.webp"}
                alt="Profile Picture"
                height={50}
                width={50}
                className="object-cover rounded-full"
              />
              <div>
                <h4 className="text-base capitalize">
                  {selectedUser.firstName} {selectedUser.lastName}
                </h4>
                <p className="text-sm text-[#7C7979]">{selectedUser.email}</p>
              </div>

              {/* status */}
              <div className="">
                <StatusTab status={userStatus} />
              </div>
            </div>

            {/* action buttons */}
            <div className="w-full md:w-[200px]">
              {statusActions[userStatus]}
            </div>
          </div>

          {/* details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* profile info */}
            <CardComponent height="100%">
              <Heading xs heading="Profile Information" />
              <div className="space-y-4 text-sm">
                <div>
                  <h4 className="text-[#1F1F1F]">Name</h4>
                  <p className="text-[#6E747D] capitalize">
                    {selectedUser.firstName} {selectedUser.lastName}
                  </p>
                </div>
                <div>
                  <h4 className="text-[#1F1F1F]">Contact Email</h4>
                  <p className="text-[#6E747D]">{selectedUser.email}</p>
                </div>
                <div>
                  <h4 className="text-[#1F1F1F]">Phone Number</h4>
                  <p className="text-[#6E747D]">{selectedUser.phoneNumber}</p>
                </div>
                <div>
                  <h4 className="text-[#1F1F1F]">Address</h4>
                  <p className="text-[#6E747D]">
                    {selectedUser.address || "N/A"}
                  </p>
                </div>
                <div>
                  <h4 className="text-[#1F1F1F]">Location</h4>
                  <p className="text-[#6E747D]">
                    {selectedUser.city || "N/A"}, {selectedUser.state || "N/A"}
                  </p>
                </div>
                <div>
                  <h4 className="text-[#1F1F1F]">Registration Date</h4>
                  <p className="text-[#6E747D]">
                    {formatDateTime(selectedUser.createdAt)}
                  </p>
                </div>
                <div>
                  <h4 className="text-[#1F1F1F]">Profile Completed</h4>
                  <p className="text-[#6E747D]">
                    {selectedUser.profileCompleted ? "Yes" : "No"}
                  </p>
                </div>
                <div>
                  <h4 className="text-[#1F1F1F]">Last Order</h4>
                  <p className="text-[#6E747D]">
                    {lastOrderDate ? formatDateTime(lastOrderDate) : "N/A"}
                  </p>
                </div>
              </div>
            </CardComponent>

            {/* order history */}
            {/* {role === "super admin" && (
            )} */}
            <CardComponent height="100%">
              <Heading xs heading="Order History" />
              <div className="space-y-4">
                <SummaryRow
                  icon="material-symbols-light:package-2-outline"
                  name="Total Orders"
                  color="#21C788"
                  amount={totalOrders.toString()}
                />
                <Divider />
                <div className="space-y-4 scrollable">
                  {recentOrders.length > 0 ? (
                    recentOrders.map((order) => (
                      <div
                        key={order.id}
                        className="h-[85px] w-full bg-white p-4 shadow rounded flex justify-between items-center">
                        <div className="text-sm">
                          <h4 className="text-[#1F1F1F]">{order.orderId}</h4>
                          <p className="text-[#6E747D]">{formatDateTime(order.createdAt)}</p>
                        </div>
                        <div className="space-y-1">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className={`w-20 h-7 rounded-lg text-white flex justify-center items-center text-xs cursor-pointer ${order.status === "completed"
                              ? "bg-[#21C788]"
                              : order.status === "cancelled"
                                ? "bg-[#FF4D4F]"
                                : "bg-[#FFAC33]"
                              }`}>
                            {order.status}
                          </button>
                          <p className="text-sm text-[#6E747D]">
                            ₦ {order.totalAmount?.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-[#6E747D]">
                      <p>No orders yet</p>
                    </div>
                  )}
                </div>
              </div>
            </CardComponent>

            {/* order summary */}
            {/* {role === "super admin" && (
            )} */}
            <CardComponent height="100%">
              <Heading xs heading="Order Summary" />
              <SummaryRow
                icon="mynaui:dollar"
                name="Total Order Summary"
                color="#21C788"
                amount={`₦${totalOrderSummary.toLocaleString()}`}
              />
              <div className="mt-4 text-sm">
                <h4 className="text-[#1F1F1F]">Last Order</h4>
                <p className="text-[#6E747D]">
                  {lastOrderDate ? formatDateTime(lastOrderDate) : "N/A"}
                </p>
              </div>
              <div className="mt-6">{statusCard[userStatus]}</div>
            </CardComponent>
          </div>
        </div>
      </CardComponent>

      {/* user activated modal */}
      <UserActivatedModal
        isOpen={userActivatedModal}
        onClose={() => setUserActivatedModal(false)}
        user={`${selectedUser.firstName} ${selectedUser.lastName}`}
        onActivate={handleActivateUser}
        isLoading={actionLoading}
      />

      {/* user deactivate modal */}
      <UserDeactivateModal
        isOpen={userDeactivatedModal}
        onClose={() => setUserDeactivatedModal(false)}
        onSuspend={handleSuspendUser}
        isLoading={actionLoading}
      />

      {/* order details */}
      {selectedOrder && (
        <OrderDetailsModal
          isOpen={!!selectedOrder}
          onClose={() => setSelectedOrder(null)}
          orderDetails={selectedOrder}
        />
      )}

      <Toaster position="top-right" />
    </>
  );
}
