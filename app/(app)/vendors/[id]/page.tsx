"use client";

import {
  orderHistory,
  orderSummary,
  paymentSummary,
  vendorData,
} from "@/lib/config/demo-data/vendors";
import { usePathname } from "next/navigation";
import { Icon } from "@iconify/react";
import { JSX, useState } from "react";
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
import OrderSummaryTab from "@/ui/order-summary-tab";

export default function VendorDetails() {
  const pathname = usePathname();
  const [vendorApprovedModal, setVendorApprovedModal] = useState(false);
  const [vendorActivatedModal, setVendorActivatedModal] = useState(false);
  const [vendorDeactivatedModal, setVendorDeactivatedModal] = useState(false);

  const vendorId = pathname.split("/").pop();
  const selectedVendor = vendorData.find((vendor) => vendor.id === vendorId);
  if (!selectedVendor) return <div>Not found.</div>;

  // for buttons - change onClick functions to api calls that in turn trigger modal later
  const statusActions: Record<string, JSX.Element> = {
    Active: (
      <Button
        content="Suspend Vendor"
        variant="error"
        icon="mynaui:pause"
        onClick={() => setVendorDeactivatedModal(true)}
      />
    ),
    Pending: (
      <Button
        content="Approve Vendor"
        variant="success"
        icon="material-symbols:check-rounded"
        onClick={() => setVendorApprovedModal(true)}
      />
    ),
    Suspended: (
      <Button
        content="Activate Vendor"
        variant="normal"
        icon="material-symbols:check-rounded"
        onClick={() => setVendorActivatedModal(true)}
      />
    ),
  };

  // for card on suspended vendors
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
      {/* main details */}
      <CardComponent>
        <div className="space-y-6">
          {/* back button */}
          <BackButton text="Back to Vendors" />

          {/* header */}
          <div className="flex items-start justify-between">
            <div className="flex items-start relative gap-3">
              <Image
                src={selectedVendor.vendor.image}
                alt="Profile Picture"
                height={50}
                width={50}
                className="object-cover"
              />
              <div>
                <h4 className="text-base">
                  {selectedVendor.vendor.vendorName}
                </h4>
                <p className="text-sm text-[#7C7979]">
                  {selectedVendor.vendor.vendorBusiness}
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
              <div className="absolute -top-0 -right-10">
                <StatusTab status={selectedVendor.status} />
              </div>
            </div>

            {/* action buttons */}
            <div className="w-[200px]">
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
                  <p className="text-[#6E747D]">Resturant</p>
                </div>
                <div>
                  <h4 className="text-[#1F1F1F]">Contact Email</h4>
                  <p className="text-[#6E747D]">maria@pizzapalace.com</p>
                </div>
                <div>
                  <h4 className="text-[#1F1F1F]">Phone Number</h4>
                  <p className="text-[#6E747D]">09016796847</p>
                </div>
                <div>
                  <h4 className="text-[#1F1F1F]">Business Address</h4>
                  <p className="text-[#6E747D]">
                    Some street, some road, more street
                  </p>
                </div>
                <div>
                  <h4 className="text-[#1F1F1F]">Registration Date</h4>
                  <p className="text-[#6E747D]">15/01/2024</p>
                </div>
                <div>
                  <h4 className="text-[#1F1F1F]">Opening Hours</h4>
                  <p className="text-[#6E747D]">Mon - Sat: 2:00pm - 10:00pm</p>
                  <p className="text-[#6E747D]">Sun: 2:00pm - 10:00pm</p>
                </div>

                {/* docs */}
                <div className="space-y-4">
                  <h4 className="text-[#1F1F1F]">Documents</h4>
                  <DocumentPreview
                    title="Business License/Valid ID"
                    size="1.2 MB"
                    type="PNG"
                    uploadDate="2024-04-29"
                  />
                  <DocumentPreview
                    title="Logo/Business Banner"
                    size="1.2 MB"
                    type="JPG"
                    uploadDate="2024-04-29"
                  />
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
                {/* divider */}
                <div className="h-0.5 w-full bg-[#E4E9EF]"></div>
                <div className="space-y-4">
                  {orderHistory.map(order => <OrderSummaryTab key={order.orderId} orderDetails={order} /> )}
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
                <p className="text-[#6E747D]">2024-12-14</p>
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
        vendor={selectedVendor.vendor.vendorBusiness}
      />

      {/* vendor activated modal */}
      <VendorActivatedModal
        isOpen={vendorActivatedModal}
        onClose={() => setVendorActivatedModal(false)}
        vendor={selectedVendor.vendor.vendorBusiness}
      />

      {/* vendor suspended modal */}
      <VendorSuspendedModal
        isOpen={vendorDeactivatedModal}
        onClose={() => setVendorDeactivatedModal(false)}
      />
    </>
  );
}
