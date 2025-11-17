"use client";
import { useState } from "react";
import {
  deliverySummary,
  riderOrderHistory,
  riderTableData,
} from "@/lib/config/demo-data/riders";
import BackButton from "@/ui/back-button";
import CardComponent from "@/ui/card-wrapper";
import { usePathname } from "next/navigation";
import { Icon } from "@iconify/react";
import Image from "next/image";
import StatusTab from "@/ui/status-tab";
import Button from "@/ui/button";
import { JSX } from "react";
import Heading from "@/ui/text-heading";
import DocumentPreview from "@/ui/document-preview-modal";
import SummaryRow from "@/ui/summary-row";
import { paymentSummary } from "@/lib/config/demo-data/vendors";
import RiderApprovedModal from "@/components/riders/rider-approved-modal";
import RiderActivatedModal from "@/components/riders/rider-activated-modal";
import RiderSuspendedModal from "@/components/riders/rider-suspended-modal";
import { RiderOrderDetails } from "@/types/riders";
import OrderDetailsModal from "@/components/riders/rider-order-details-modal";
import Divider from "@/ui/divider";
import { useRoleStore } from "@/store/role-store";

export default function RiderDetails() {
  // for order details
  const [selectedOrder, setSelectedOrder] = useState<RiderOrderDetails | null>(
    null
  );

  const { role } = useRoleStore();

  // for action modals
  const [riderApprovedModal, setRiderApprovedModal] = useState(false);
  const [riderActivatedModal, setRiderActivatedModal] = useState(false);
  const [riderDeactivatedModal, setRiderDeactivatedModal] = useState(false);

  const pathname = usePathname();
  const riderId = pathname.split("/").pop();
  const selectedRider = riderTableData.find((rider) => rider.id === riderId);
  if (!selectedRider) return <div>Not found.</div>;

  // for buttons - change onClick functions to api calls that in turn trigger modal later
  const statusActions: Record<string, JSX.Element> = {
    Active: (
      <Button
        content="Suspend Rider"
        variant="error"
        icon="mynaui:pause"
        onClick={() => setRiderDeactivatedModal(true)}
      />
    ),
    Pending: (
      <Button
        content="Approve Rider"
        variant="success"
        icon="material-symbols:check-rounded"
        onClick={() => setRiderApprovedModal(true)}
      />
    ),
    Suspended: (
      <Button
        content="Activate Rider"
        variant="normal"
        icon="material-symbols:check-rounded"
        onClick={() => setRiderActivatedModal(true)}
      />
    ),
  };

  // for card on suspended riders
  const statusCard: Record<string, JSX.Element> = {
    Suspended: (
      <div className="bg-[#FF4D4F15] py-2 px-4 rounded-2xl text-[#FF4D4F] w-full">
        <h4 className="font-semibold text-base">Reason</h4>
        <p className="text-sm font-normal">
          Rider was involved in actions not conforming to company’s policy.
        </p>
      </div>
    ),
  };
  return (
    <>
      <CardComponent>
        <div className="space-y-6">
          <BackButton text="Back to Riders" />
          {/* header */}
          <div className="flex flex-col md:flex-row items-start justify-between gap-4">
            <div className="flex flex-col md:flex-row items-start md:items-center relative gap-3">
              <Image
                src={selectedRider.rider.image}
                alt="Profile Picture"
                height={50}
                width={50}
                className="object-cover"
              />
              <div>
                <h4 className="text-base">{selectedRider.rider.name}</h4>
                <p className="text-sm text-[#7C7979]">
                  {selectedRider.rider.email}
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

              {/* status */}
              <div className="">
                <StatusTab status={selectedRider.deliveryStatus} />
              </div>
            </div>

            {/* action buttons */}
            <div className="w-full md:w-[200px]">
              {statusActions[selectedRider.deliveryStatus]}
            </div>
          </div>

          {/* details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* profile info */}
            <CardComponent height="100%">
              <div className="flex justify-between items-start">
                <Heading xs heading="Profile Information" />
                {/* status tab */}
                <div
                  className={`h-[28px] w-[84px] rounded-lg text-xs flex justify-center items-center ${
                    selectedRider.riderStatus === "Online"
                      ? "bg-[#0095DA15] text-[#0095DA]"
                      : "bg-[#C9D1DA66] text-[#1F1F1F]"
                  }`}
                >
                  {selectedRider.riderStatus}
                </div>
              </div>
              <div className="space-y-4 text-sm">
                <div>
                  <h4 className="text-[#1F1F1F]">Phone Number</h4>
                  <p className="text-[#6E747D]">+1 (555) 123-4567</p>
                </div>
                <div>
                  <h4 className="text-[#1F1F1F]">Vehicle Type</h4>
                  <p className="text-[#6E747D]">{selectedRider.vehicleType}</p>
                </div>
                <div>
                  <h4 className="text-[#1F1F1F]">Address</h4>
                  <p className="text-[#6E747D]">
                    Jason jacks street, olufemi drive , Lagos
                  </p>
                </div>
                <div>
                  <h4 className="text-[#1F1F1F]">Registration Date</h4>
                  <p className="text-[#6E747D]">15/01/2025</p>
                </div>

                {/* docs */}
                <div className="space-y-4">
                  <h4 className="text-[#1F1F1F]">Documents</h4>
                  <DocumentPreview
                    title="Driver's License"
                    size="1.2 MB"
                    type="JPG"
                    uploadDate="2024-04-29"
                  />
                  <DocumentPreview
                    title="Government ID"
                    size="1.2 MB"
                    type="JPG"
                    uploadDate="2024-04-29"
                  />
                </div>
              </div>
            </CardComponent>

            {/* delivery summary */}
            {role === "super-admin" && <CardComponent height="100%">
              <Heading xs heading="Delivery Summary" />
              <div className="space-y-4">
                {/* icons and text */}
                <div className="space-y-4 text-sm">
                  {deliverySummary.map((summary, index) => (
                    <SummaryRow
                      key={index}
                      name={summary.name}
                      amount={summary.amount}
                      icon={summary.icon}
                      color={summary.color}
                    />
                  ))}
                </div>
                <Divider/>
                <div className="space-y-4 scrollable">
                  {riderOrderHistory.map((order) => (
                    <div
                      key={order.orderId}
                      className="h-[85px] w-full bg-white p-4 shadow rounded flex justify-between items-center"
                    >
                      <div className="text-sm">
                        <h4 className="text-[#1F1F1F]">{order.orderId}</h4>
                        <p className="text-[#6E747D]">{order.date}</p>
                      </div>
                      <div className="space-y-1">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className={`w-20 h-7 rounded-lg text-white flex justify-center items-center text-xs cursor-pointer ${
                            order.status === "Completed"
                              ? "bg-[#21C788]"
                              : order.status === "Rejected"
                              ? "bg-[#FF4D4F]"
                              : "bg-[#FFAC33]"
                          }`}
                        >
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
            </CardComponent>}

            {/* payment summary */}
            {role === "super-admin" && <CardComponent height="100%">
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
                <p className="text-[#6E747D]">2024-12-14</p>
              </div>
              <div className="mt-6">
                {statusCard[selectedRider.deliveryStatus]}
              </div>
            </CardComponent>}
          </div>
        </div>
      </CardComponent>

      {/* rider approved modal */}
      <RiderApprovedModal
        isOpen={riderApprovedModal}
        onClose={() => setRiderApprovedModal(false)}
        rider={selectedRider.rider.name}
      />

      {/* rider activated modal */}
      <RiderActivatedModal
        isOpen={riderActivatedModal}
        onClose={() => setRiderActivatedModal(false)}
        rider={selectedRider.rider.name}
      />

      {/* rider suspended modal */}
      <RiderSuspendedModal
        isOpen={riderDeactivatedModal}
        onClose={() => setRiderDeactivatedModal(false)}
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
