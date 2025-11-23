"use client";
import { useState, useEffect } from "react";
import BackButton from "@/ui/back-button";
import CardComponent from "@/ui/card-wrapper";
import { usePathname, useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import Image from "next/image";
import StatusTab from "@/ui/status-tab";
import Button from "@/ui/button";
import { JSX } from "react";
import Heading from "@/ui/text-heading";
import DocumentPreview from "@/ui/document-preview-modal";
import SummaryRow from "@/ui/summary-row";
import Divider from "@/ui/divider";
// import { useRoleStore } from "@/store/role-store";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/app/(app)/firebase/config";
import type { RiderDetails } from "@/types/riders";
import RiderSuspendedModal from "@/components/riders/rider-suspended-modal";
import RiderActivatedModal from "@/components/riders/rider-activated-modal";
import RiderApprovedModal from "@/components/riders/rider-approved-modal";
import Loading from "@/app/loading";
import { formatDate, formatDateTime, getFileSize, getFileTypeFromUrl } from "@/utils/date-utility";
import { toast, Toaster } from "react-hot-toast";


export default function RiderDetails() {
  const [selectedRider, setSelectedRider] = useState<RiderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  // const { role } = useRoleStore();
  const router = useRouter();

  const pathname = usePathname();
  const riderId = pathname.split("/").pop();

  // Fetch rider data from Firestore
  useEffect(() => {
    const fetchRiderData = async () => {
      if (!riderId) return;

      try {
        const riderRef = doc(db, "riders", riderId);
        const riderSnapshot = await getDoc(riderRef);

        if (riderSnapshot.exists()) {
          const riderData = riderSnapshot.data();
          setSelectedRider({
            id: riderSnapshot.id,
            ...riderData,
          } as RiderDetails);
        }
      } catch (error) {
        console.error("Error fetching rider data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRiderData();
  }, [riderId]);

  // for action modals
  const [riderApprovedModal, setRiderApprovedModal] = useState(false);
  const [riderActivatedModal, setRiderActivatedModal] = useState(false);
  const [riderDeactivatedModal, setRiderDeactivatedModal] = useState(false);

  // Function to update rider status
  const updateRiderStatus = async (
    newStatus: string,
    suspensionReason?: string
  ) => {
    if (!selectedRider || !riderId) return;

    setActionLoading(true);
    try {
      const riderRef = doc(db, "riders", riderId);

      const updateData: any = {
        accountStatus: newStatus,
        updatedAt: new Date(),
      };

      if (suspensionReason) {
        updateData.suspensionReason = suspensionReason;
      }

      if (newStatus === "active") {
        updateData.isOnline = true;
      } else if (newStatus === "suspended") {
        updateData.isOnline = false;
      }

      await updateDoc(riderRef, updateData);

      // Update local state
      setSelectedRider((prev) =>
        prev
          ? {
              ...prev,
              accountStatus: newStatus as any,
              isOnline: newStatus === "active",
              ...(suspensionReason && { suspensionReason }),
            }
          : null
      );

      toast.success(`Rider ${getStatusActionMessage(newStatus)} successfully!`);

      // Close modal
      if (newStatus === "active") {
        setRiderActivatedModal(false);
      } else if (newStatus === "suspended") {
        setRiderDeactivatedModal(false);
      } else if (newStatus === "approved") {
        setRiderApprovedModal(false);
      }

      // Refresh the page after a short delay
      setTimeout(() => {
        router.refresh();
      }, 1000);
    } catch (error) {
      console.error("Error updating rider status:", error);
      toast.error("Failed to update rider status");
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
        return "suspended";
      case "approved":
        return "approved";
      default:
        return "updated";
    }
  };

  // Action handlers
  const handleApproveRider = async () => {
    await updateRiderStatus("active");
  };

  const handleActivateRider = async () => {
    await updateRiderStatus("active");
  };

  const handleSuspendRider = async (reason: string) => {
    await updateRiderStatus("suspended", reason);
  };

  if (loading) return <Loading />;
  if (!selectedRider) return <div>Rider not found.</div>;

  // for buttons - using consistent icons and actions based on status
  const statusActions: Record<string, JSX.Element> = {
    active: (
      <Button
        content="Suspend Rider"
        variant="error"
        icon="mynaui:pause"
        onClick={() => {
          setRiderDeactivatedModal(true);
        }}
        isDisabled={actionLoading}
      />
    ),
    pending: (
      <Button
        content="Approve Rider"
        variant="success"
        icon="material-symbols:check-rounded"
        onClick={() => {
          setRiderApprovedModal(true);
        }}
        isDisabled={actionLoading}
      />
    ),
    suspended: (
      <Button
        content="Activate Rider"
        variant="normal"
        icon="material-symbols:play-arrow"
        onClick={() => {
          setRiderActivatedModal(true);
        }}
        isDisabled={actionLoading}
      />
    ),
  };

  // Delivery summary data - using consistent icons
  const deliverySummaryData = [
    {
      name: "Total Deliveries",
      amount: selectedRider.deliveryStats?.total?.toString() || "0",
      icon: "majesticons:box-line",
      color: "#21C788",
    },
    {
      name: "Completed",
      amount: selectedRider.deliveryStats?.completed?.toString() || "0",
      icon: "mdi-light:clock",
      color: "#FFAC33",
    },
    {
      name: "Cancelled",
      amount: selectedRider.deliveryStats?.cancelled?.toString() || "0",
      icon: "streamline:graph-arrow-increase",
      color: "#FF4D4F",
    },
  ];

  // Payment summary data - using consistent icons
  const paymentSummaryData = [
    {
      name: "Total Earnings",
      amount: `₦${selectedRider.earnings?.total?.toLocaleString() || "0"}`,
      icon: "mynaui:dollar-solid",
      color: "#16A271",
    },
    {
      name: "This Month",
      amount: `₦${selectedRider.earnings?.thisMonth?.toLocaleString() || "0"}`,
      icon: "streamline:graph-arrow-increase",
      color: "#21C788",
    },
  ];

  return (
    <>
      <CardComponent>
        <div className="space-y-6">
          <BackButton text="Back to Riders" />

          {/* header */}
          <div className="flex flex-col md:flex-row items-start justify-between gap-4">
            <div className="flex flex-col md:flex-row items-start md:items-center relative gap-3">
              <div className="relative size-[50px]">
                <Image
                  src={selectedRider.profilePhotoUrl || "/placeholder.svg"}
                  alt="Profile Picture"
                  fill
                  priority
                  className="object-cover rounded-full"
                />
              </div>
              <div>
                <h4 className="text-base capitalize">
                  {selectedRider.fullName}
                </h4>
                <p className="text-sm text-[#7C7979]">{selectedRider.email}</p>
                <div className="flex items-center gap-2 text-sm">
                  <Icon
                    icon={"pepicons-pencil:star-filled"}
                    height={18}
                    width={18}
                    color="#EFB100"
                  />
                  <span>
                    {selectedRider.ratings?.average || 0} ratings (
                    {selectedRider.ratings?.totalReviews || 0} Reviews)
                  </span>
                </div>
              </div>

              {/* status */}
              <div className="">
                <StatusTab status={selectedRider.accountStatus} />
              </div>
            </div>

            {/* action buttons */}
            <div className="w-full md:w-[200px]">
              {statusActions[selectedRider.accountStatus]}
            </div>
          </div>

          {/* details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* profile info */}
            <CardComponent height="100%">
              <div className="flex justify-between items-start">
                <Heading xs heading="Profile Information" />
                {/* online status */}
                <div
                  className={`h-[28px] w-[84px] rounded-lg text-xs flex justify-center items-center ${
                    selectedRider.isOnline
                      ? "bg-[#0095DA15] text-[#0095DA]"
                      : "bg-[#C9D1DA66] text-[#1F1F1F]"
                  }`}>
                  {selectedRider.isOnline ? "Online" : "Offline"}
                </div>
              </div>
              <div className="space-y-4 text-sm">
                <div>
                  <h4 className="text-[#1F1F1F]">Phone Number</h4>
                  <p className="text-[#6E747D]">{selectedRider.phoneNumber}</p>
                </div>
                <div>
                  <h4 className="text-[#1F1F1F]">Vehicle Type</h4>
                  <p className="text-[#6E747D]">
                    {selectedRider.vehicleInfo?.type || "N/A"}
                  </p>
                </div>
                <div>
                  <h4 className="text-[#1F1F1F]">Vehicle Color</h4>
                  <p className="text-[#6E747D] capitalize">
                    {selectedRider.vehicleInfo?.color || "N/A"}
                  </p>
                </div>
                <div>
                  <h4 className="text-[#1F1F1F]">Plate Number</h4>
                  <p className="text-[#6E747D]">
                    {selectedRider.vehicleInfo?.plateNumber || "N/A"}
                  </p>
                </div>
                <div>
                  <h4 className="text-[#1F1F1F]">Location</h4>
                  <p className="text-[#6E747D]">
                    {selectedRider.city}, {selectedRider.state}
                  </p>
                </div>
                <div>
                  <h4 className="text-[#1F1F1F]">Registration Date</h4>
                  <p className="text-[#6E747D]">
                    {formatDateTime(selectedRider.createdAt)}
                  </p>
                </div>

                {/* docs */}
                <div className="space-y-4">
                  <h4 className="text-[#1F1F1F]">Documents</h4>
                  {selectedRider.documents ? (
                    <>
                      {selectedRider.documents.driversLicense && (
                        <DocumentPreview
                          title="Driver's License"
                          size={getFileSize(selectedRider.documents.driversLicense)}
                          type={getFileTypeFromUrl(selectedRider.documents.driversLicense)}
                          uploadDate={formatDate(selectedRider.createdAt, "short")}
                          docLink={selectedRider.documents.driversLicense}
                        />
                      )}
                      {selectedRider.documents.governmentId && (
                        <DocumentPreview
                          title="Government ID"
                          size={getFileSize(selectedRider.documents.governmentId)}
                          type={getFileTypeFromUrl(selectedRider.documents.governmentId)}
                          uploadDate={formatDate(selectedRider.createdAt, "short")}
                          docLink={selectedRider.documents.governmentId}
                        />
                      )}
                    </>
                  ) : (
                    <p className="text-[#6E747D] -mt-4">
                      No Documents available.
                    </p>
                  )}
                </div>
              </div>
            </CardComponent>

            {/* delivery summary */}
            <CardComponent height="100%">
              <Heading xs heading="Delivery Summary" />
              <div className="space-y-4">
                {/* icons and text */}
                <div className="space-y-4 text-sm">
                  {deliverySummaryData.map((summary, index) => (
                    <SummaryRow
                      key={index}
                      name={summary.name}
                      amount={summary.amount}
                      icon={summary.icon}
                      color={summary.color}
                    />
                  ))}
                </div>
                <Divider />
                <div className="text-center py-8 text-[#6E747D]">
                  <Icon
                    icon="material-symbols:package-2-outline"
                    width={48}
                    height={48}
                    className="mx-auto mb-2"
                  />
                  <p>No recent orders</p>
                  <p className="text-sm">Order history will appear here</p>
                </div>
              </div>
            </CardComponent>

            {/* payment summary */}
            <CardComponent height="100%">
              <Heading xs heading="Payment Summary" />
              <div className="space-y-4 text-sm">
                {paymentSummaryData.map((summary, index) => (
                  <SummaryRow
                    key={index}
                    name={summary.name}
                    amount={summary.amount}
                    icon={summary.icon}
                    color={summary.color}
                  />
                ))}
              </div>
              <div className="mt-4 text-sm">
                <h4 className="text-[#1F1F1F]">Last Updated</h4>
                <p className="text-[#6E747D]">
                  {formatDate(selectedRider.updatedAt)}
                </p>
              </div>
              {selectedRider.accountStatus === "suspended" &&
                selectedRider.suspensionInfo && (
                  <div className="mt-6 bg-[#FF4D4F15] py-2 px-4 rounded-2xl text-[#FF4D4F] w-full">
                    <h4 className="font-semibold text-base">
                      Suspension Reason
                    </h4>
                    <p className="text-sm font-normal">
                      {selectedRider.suspensionInfo?.suspensionReason}
                    </p>
                  </div>
                )}
            </CardComponent>
          </div>
        </div>
      </CardComponent>

      {/* rider approved modal */}
      <RiderApprovedModal
        isOpen={riderApprovedModal}
        onClose={() => setRiderApprovedModal(false)}
        rider={selectedRider.fullName}
        // onApprove={handleApproveRider}
        // isLoading={actionLoading}
      />

      {/* rider activated modal */}
      <RiderActivatedModal
        isOpen={riderActivatedModal}
        onClose={() => setRiderActivatedModal(false)}
        rider={selectedRider.fullName}
        // onActivate={handleActivateRider}
        // isLoading={actionLoading}
      />

      {/* rider suspended modal */}
      <RiderSuspendedModal
        isOpen={riderDeactivatedModal}
        onClose={() => setRiderDeactivatedModal(false)}
        // onSuspend={handleSuspendRider}
        // isLoading={actionLoading}
      />

      <Toaster position="top-right" />
    </>
  );
}