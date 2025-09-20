"use client";

import { vendorData } from "@/lib/config/demo-data/vendors";
import BackButton from "@/ui/back-button";
import Button from "@/ui/button";
import CardComponent from "@/ui/card-wrapper";
import StatusTab from "@/ui/status-tab";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Icon } from "@iconify/react";
import { JSX, useState } from "react";
import Modal from "@/ui/popup-modal";
import Heading from "@/ui/text-heading";

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
        </div>
      </CardComponent>

      {/* vendor approved modal */}
      <Modal 
      isOpen={vendorApprovedModal} 
      onClose={() => setVendorApprovedModal(false)}
      >
        <div className="flex flex-col items-center justify-center gap-2">
            <Icon icon={"material-symbols:check-circle-outline"} height={60} width={60} color="#0095DA" />
            <Heading heading="Vendor Approved" subtitle={`The vendor "${selectedVendor.vendor.vendorBusiness}" registration request has been approved and they will be notified via email to Sign in.`} className="text-center" />
            <div className="mt-16 w-full">
                <Button content="Close" />
            </div>
        </div>
      </Modal>
    </>
  );
}
