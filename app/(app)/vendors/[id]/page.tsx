"use client";
import {
  vendorOderHistory,
  orderSummary,
  paymentSummary,
} from "@/lib/config/demo-data/vendors";
import { usePathname, useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import { JSX, useState, useEffect } from "react";
import BackButton from "@/ui/back-button";
import Button from "@/ui/button";
import CardComponent from "@/ui/card-wrapper";
import StatusTab from "@/ui/status-tab";
import Image from "next/image";
import VendorApprovedModal from "@/components/vendors/vendor-approved-modal";
import VendorActivatedModal from "@/components/vendors/vendor-activated-modal";
import VendorSuspendedModal from "@/components/vendors/vendor-suspended-modal";
import Heading from "@/ui/text-heading";
import DocumentPreview from "@/ui/document-preview-modal";
import SummaryRow from "@/ui/summary-row";
import OrderDetailsModal from "@/components/vendors/vendor-order-details-modal";
import { VendorData, VendorOrderDetails } from "@/types/vendors";
import Divider from "@/ui/divider";
// import { useRoleStore } from "@/store/role-store";
import { doc, getDoc, collection, getDocs, updateDoc } from "firebase/firestore";
import { db } from "@/app/(app)/firebase/config";
import { toast, Toaster } from "react-hot-toast";
import Loading from "@/app/loading";
import { formatDateTime, timeAgo } from "@/utils/date-utility";
import { Status } from "@/types/table-data";

export default function VendorDetails() {
  // for order details
  const [selectedOrder, setSelectedOrder] = useState<VendorOrderDetails | null>(
    null
  );
  const pathname = usePathname();
  const router = useRouter();
  const [vendorApprovedModal, setVendorApprovedModal] = useState(false);
  const [vendorActivatedModal, setVendorActivatedModal] = useState(false);
  const [vendorDeactivatedModal, setVendorDeactivatedModal] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<VendorData | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const vendorId = pathname.split("/").pop();

  // Fetch vendor data from Firestore
  useEffect(() => {
    const fetchVendorData = async () => {
      if (!vendorId) {
        toast.error("Vendor ID not found");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const vendorRef = doc(db, "vendors", vendorId);
        const vendorSnapshot = await getDoc(vendorRef);

        if (vendorSnapshot.exists()) {
          const vendorData = vendorSnapshot.data();

          // Transform Firestore data to match component structure
          const transformedVendor: VendorData = {
            id: vendorSnapshot.id,
            vendor: {
              vendorName:
                vendorData.businessName || vendorData.vendorName || "N/A",
              vendorBusiness:
                vendorData.businessDescription ||
                vendorData.businessCategory ||
                "N/A",
              image: vendorData.logoUrl || "/placeholder.svg",
              email: vendorData.email,
              phoneNumber: vendorData.phoneNumber,
              businessAddress: vendorData.businessAddress,
              businessCategory: vendorData.businessCategory,
              createdAt:
                vendorData.createdAt,
              operatingHours: vendorData.operatingHours,
            },
            status: vendorData.status || "active",
            businessLicenseMetadata: vendorData.businessLicenseMetadata,
            address: vendorData.address,
            city: vendorData.city,
            state: vendorData.state,
            fullAddress: vendorData.fullAddress,
            businessDescription: vendorData.businessDescription,
            businessCategory: vendorData.businessCategory,
          };

          setSelectedVendor(transformedVendor);
        } else {
          toast.error("Vendor not found");
        }
      } catch (error) {
        console.error("Error fetching vendor data:", error);
        toast.error("Failed to load vendor data");
      } finally {
        setLoading(false);
      }
    };

    fetchVendorData();
  }, [vendorId]);

  // Fetch vendor's foods collection for additional data
  const [vendorFoods, setVendorFoods] = useState<any[]>([]);
  console.log(vendorFoods);

  useEffect(() => {
    const fetchVendorFoods = async () => {
      if (!vendorId) return;

      try {
        const foodsRef = collection(db, "vendors", vendorId, "foods");
        const foodsSnapshot = await getDocs(foodsRef);
        const foodsData = foodsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setVendorFoods(foodsData);
      } catch (error) {
        console.error("Error fetching vendor foods:", error);
      }
    };

    if (vendorId) {
      fetchVendorFoods();
    }
  }, [vendorId]);

  // Function to update vendor status
    const updateVendorStatus = async (newStatus: Status, suspensionReason?: string) => {
      if (!selectedVendor || !vendorId) return;
  
      setActionLoading(true);
      try {
        const vendorRef = doc(db, "vendors", vendorId);
  
        const updateData: any = {
          status: newStatus,
          updatedAt: new Date(),
        };
  
        if (suspensionReason) {
          updateData.suspensionReason = suspensionReason;
        }
  
        await updateDoc(vendorRef, updateData);
  
        // Update local state
        setSelectedVendor((prev) =>
          prev
            ? ({
                ...prev,
                status: newStatus,
                ...(suspensionReason ? { suspensionReason } : {}),
              } as VendorData)
            : null
        );
  
        toast.success(`Vendor ${getStatusActionMessage(newStatus)} successfully!`);
  
        // Close modal
        if (newStatus === "active") {
          setVendorActivatedModal(false);
        } else if (newStatus === "suspended") {
          setVendorDeactivatedModal(false);
        } else if (newStatus === "approved") {
          setVendorApprovedModal(false);
        }
  
        // Refresh the page after a short delay
        setTimeout(() => {
          router.refresh();
        }, 1000);
      } catch (error) {
        console.error("Error updating vendor status:", error);
        toast.error("Failed to update vendor status");
      } finally {
        setActionLoading(false);
      }
    };
  
    // Helper function for status messages
    const getStatusActionMessage = (status: Status) => {
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
  const handleApproveVendor = async () => {
    await updateVendorStatus("active");
  };

  const handleActivateVendor = async () => {
    await updateVendorStatus("active");
  };

  const handleSuspendVendor = async (reason: string) => {
    await updateVendorStatus("suspended", reason);
  };

  if (loading) {
    return <Loading />;
  }

  if (!selectedVendor) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-red-500">Vendor not found.</div>
      </div>
    );
  }

  console.log(selectedVendor);

  // for buttons - change onClick functions to api calls that in turn trigger modal later
  const statusActions: Record<string, JSX.Element> = {
    active: (
      <Button
        content="Suspend Vendor"
        variant="error"
        icon="mynaui:pause"
        onClick={() => setVendorDeactivatedModal(true)}
        isDisabled={actionLoading}
      />
    ),
    pending: (
      <Button
        content="Approve Vendor"
        variant="success"
        icon="material-symbols:check-rounded"
        onClick={() => setVendorApprovedModal(true)}
        isDisabled={actionLoading}
      />
    ),
    suspended: (
      <Button
        content="Activate Vendor"
        variant="normal"
        icon="material-symbols:check-rounded"
        onClick={() => setVendorActivatedModal(true)}
        isDisabled={actionLoading}
      />
    ),
  };

  // for card on suspended vendors
  const statusCard: Record<string, JSX.Element> = {
    Suspended: (
      <div className="bg-[#FF4D4F15] py-2 px-4 rounded-2xl text-[#FF4D4F] w-full">
        <h4 className="font-semibold text-base">Reason</h4>
        <p className="text-sm font-normal">
          Vendor was involved in actions not conforming to company&apos;s policy.
        </p>
      </div>
    ),
  };

  return (
    <>
      <Toaster position="top-right" />

      {/* main details */}
      <CardComponent>
        <div className="space-y-6">
          {/* back button */}
          <BackButton text="Back to Vendors" />

          {/* header */}
          <div className="flex flex-col md:flex-row items-start justify-between gap-4">
            <div className="flex flex-col md:flex-row items-start md:items-center relative gap-3">
              <div className="relative size-[50px]">
                <Image
                  src={selectedVendor.vendor.image}
                  alt="Profile Picture"
                  fill
                  className="object-cover rounded-full"
                />
              </div>
              <div>
                <h4 className="text-base">
                  {selectedVendor.vendor.vendorName}
                </h4>
                <p className="text-sm text-[#7C7979] truncate">
                  {selectedVendor.vendor.vendorBusiness.substring(0, 40) + "..."}
                </p>
                <div className="flex items-center gap-2 text-sm">
                  <Icon
                    icon={"pepicons-pencil:star-filled"}
                    height={18}
                    width={18}
                    color="#EFB100"
                  />
                  <span>4.8 ratings (230 Reviews)</span>
                </div>
              </div>

              
              <div className="">
                <StatusTab status={selectedVendor.status} />
              </div>
            </div>

            <div className="w-full md:w-[200px]">
              {statusActions[selectedVendor.status]}
            </div>
          </div>

          {/* details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* profile info */}
            <CardComponent height="100%">
              <Heading xs heading="Profile Information" />
              <div className="space-y-4 text-sm">
                <div>
                  <h4 className="text-[#1F1F1F]">Business Category</h4>
                  <p className="text-[#6E747D]">
                    {selectedVendor.businessCategory || "Restaurant"}
                  </p>
                </div>
                <div>
                  <h4 className="text-[#1F1F1F]">Contact Email</h4>
                  <p className="text-[#6E747D]">
                    {selectedVendor.vendor.email || "maria@pizzapalace.com"}
                  </p>
                </div>
                <div>
                  <h4 className="text-[#1F1F1F]">Phone Number</h4>
                  <p className="text-[#6E747D]">
                    {selectedVendor.vendor.phoneNumber || "N/A"}
                  </p>
                </div>
                <div>
                  <h4 className="text-[#1F1F1F]">Business Address</h4>
                  <p className="text-[#6E747D]">
                    {selectedVendor.vendor.businessAddress?.fullAddress ||
                      "N/A"}
                  </p>
                </div>
                <div>
                  <h4 className="text-[#1F1F1F]">Registration Date</h4>
                  <p className="text-[#6E747D]">
                    {formatDateTime(selectedVendor.vendor.createdAt || "")}
                  </p>
                </div>
                <div>
                  <h4 className="text-[#1F1F1F]">Vendor Business Description</h4>
                  <p className="text-[#6E747D]">
                    {selectedVendor.vendor.vendorBusiness || ""}
                  </p>
                </div>
                <div>
                  <h4 className="text-[#1F1F1F]">Opening Hours</h4>
                  <div className="text-[#6E747D]">
                    {selectedVendor.vendor.operatingHours ?
                      Object.entries(selectedVendor.vendor.operatingHours).map(([day, hours]) => (
                        <div key={day} className="flex justify-between my-1">
                          <span className="capitalize">{day}</span>
                          {hours.isOpen ? (
                            <span>
                              {hours.open} - {hours.close}
                            </span>
                          ) : (
                            <span>Closed</span>
                          )}
                        </div>
                      )) : <p className="text-[#6E747D]">This vendor hasn&apos;t put up opening hours yet.</p>}
                  </div>
                </div>

                {/* docs */}
                <div className="space-y-4">
                  <h4 className="text-[#1F1F1F]">Documents</h4>
                  {selectedVendor.businessLicenseMetadata ? (
                    <DocumentPreview
                      title={selectedVendor.businessLicenseMetadata.fileName}
                      size={selectedVendor.businessLicenseMetadata.fileSize}
                      type={
                        selectedVendor.businessLicenseMetadata.fileExtension ||
                        "N/A"
                      }
                      uploadDate={timeAgo(selectedVendor.businessLicenseMetadata.uploadedAt)}
                      docLink={selectedVendor.businessLicenseMetadata.url}
                    />
                  ) : <p className="text-[#6E747D] -mt-4">No Documents available.</p>}
                </div>
              </div>
            </CardComponent>

            {/* order summary */}
            <CardComponent height="100%">
              <Heading xs heading="Order Summary" />
              <div className="space-y-4">
                {/* icons and text */}
                <div className="space-y-4 text-sm">
                  {orderSummary.map((summary, index) => (
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
                <div className="space-y-4 scrollable">
                  {vendorOderHistory.map((order) => (
                    <div
                      key={order.id}
                      className="h-[85px] w-full bg-white p-4 shadow rounded flex justify-between items-center">
                      <div className="text-sm">
                        <h4 className="text-[#1F1F1F]">{order.id}</h4>
                        <p className="text-[#6E747D]">{order.date}</p>
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
                          ₦ {order.total}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardComponent>

            {/* payment summary */}
            <CardComponent height="100%">
              <Heading xs heading="Payment Summary" />
              <div className="space-y-4 text-sm">
                {paymentSummary.map((summary, index) => (
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
                <h4 className="text-[#1F1F1F]">Last Withdrawal</h4>
                <p className="text-[#6E747D]">N/A</p>
              </div>
              <div className="mt-6">{statusCard[selectedVendor.status]}</div>
            </CardComponent>
          </div>
        </div>
      </CardComponent>

      {/* vendor approved modal */}
      <VendorApprovedModal
        isOpen={vendorApprovedModal}
        onClose={() => setVendorApprovedModal(false)}
        vendor={selectedVendor.vendor.vendorName}
        onApprove={handleApproveVendor}
        isLoading={actionLoading}
      />

      {/* vendor activated modal */}
      <VendorActivatedModal
        isOpen={vendorActivatedModal}
        onClose={() => setVendorActivatedModal(false)}
        vendor={selectedVendor.vendor.vendorName}
        onActivate={handleActivateVendor}
        isLoading={actionLoading}
      />

      {/* vendor suspended modal */}
      <VendorSuspendedModal
        isOpen={vendorDeactivatedModal}
        onClose={() => setVendorDeactivatedModal(false)}
        onSuspend={handleSuspendVendor}
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
    </>
  );
}