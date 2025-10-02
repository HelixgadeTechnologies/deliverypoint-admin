"use client";
import { UserOrderDetails } from "@/types/users";
import Button from "@/ui/button";
import Divider from "@/ui/divider";
import Modal from "@/ui/popup-modal";
import Heading from "@/ui/text-heading";
import { Icon } from "@iconify/react";
import Image from "next/image";
import { JSX } from "react";
type OrderDetailsProps = {
  isOpen: boolean;
  onClose: () => void;
  orderDetails: UserOrderDetails;
};
export default function OrderDetailsModal({
  isOpen,
  onClose,
  orderDetails,
}: OrderDetailsProps) {
  // for status dependent displays
  const statusExtras: Record<string, JSX.Element> = {
    Canceled: (
      <div className="bg-[#FFFBEB] border border-[#FFAC3333] py-[9] px-[13px] rounded-md h-[60px] w-full text-sm text-[#92400E] flex items-start gap-1">
        <Icon
          icon={"ep:warning-filled"}
          color="#FFAC33"
          height={18}
          width={18}
        />
        <div>
          <span className="font-semibold block">Reason:</span>
          <span className="block">{orderDetails.cancellationReason}</span>
        </div>
      </div>
    ),
    Completed: (
      <div className="space-y-4">
        {/* delivery address */}
        <div className="bg-[#F9FAFB] p-3 rounded-lg space-y-2 text-sm">
          <p className="text-[#1F1F1F] flex items-center gap-2">
            Delivery Address
            <Icon icon={"tdesign:location"} height={16} width={16} />
          </p>
          <p className="text-[#7C7979]">
            {orderDetails.vendorInformation.address}
          </p>
        </div>
        {/* review */}
        <div className="bg-[#FFFBEB] border border-[#FFAC3333] py-[9] px-[13px] rounded-md h-[60px] w-full text-sm">
          <div className="flex items-center gap-4">
            <Image
              src={"/stars.svg"}
              alt="Temporary Rating"
              height={20}
              width={80}
            />
            <p>{orderDetails.vendorInformation.rating?.rateCount}/5</p>
          </div>
          <p className="text-[#92400E] ml-2.5">
            {orderDetails.vendorInformation.rating?.review}
          </p>
        </div>
        <Divider />
        <div className="space-y-2.5">
          <h4 className="font-bold text-lg">Driver&apos;s Information</h4>
          <div className="flex gap-2">
            {/* image */}
            <div className="size-12 relative">
              <Image
                src={"/placeholder.svg"}
                alt="Customer Image"
                fill
                className="rounded-full object-cover"
              />
            </div>
            {/* details */}
            <Heading
              heading={orderDetails.driversInformation?.name}
              subtitle={orderDetails.driversInformation?.phoneNumber}
              xs
              spacing="0"
            />
          </div>
        </div>
      </div>
    ),
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="500px">
      <div className="space-y-3 h-[500px] overflow-y-auto scrollable-modal pr-4">
        {/* header and close icon */}
        <div className="flex justify-between items-start">
          <Heading heading="Order Details" subtitle={orderDetails.orderId} />
          <div
            onClick={onClose}
            className="size-[34px] rounded-full bg-[#F8F9FA99] flex justify-center items-center"
          >
            <Icon icon={"mingcute:close-line"} height={16} width={16} />
          </div>
        </div>
        {/* order details text and button */}
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-base">Order Details</h3>
          <div
            className={`w-20 h-7 rounded-lg text-white flex justify-center items-center text-xs ${
              orderDetails.status === "Completed"
                ? "bg-[#21C788]"
                : orderDetails.status === "Canceled"
                ? "bg-[#FF4D4F]"
                : "bg-[#FFAC33]"
            }`}
          >
            {orderDetails.status}
          </div>
        </div>
        {/* order date and time */}
        <div className="flex justify-between items-center text-sm">
          <div className="space-y-1">
            <p className="text-[#7C7979]">Order Date</p>
            <p className="text-[#1F1F1F] flex items-center gap-1">
              <Icon icon={"lucide:calendar"} height={16} width={16} />
              {orderDetails.date}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-[#7C7979]">Order Time</p>
            <p className="text-[#1F1F1F] flex items-center gap-1">
              <Icon icon={"carbon:time"} height={16} width={16} />
              {orderDetails.time}
            </p>
          </div>
        </div>
        <Divider />
        {/* order items */}
        <div className="space-y-2">
          <h3>Order Items:</h3>
          {orderDetails.items?.map((item, index) => (
            <div
              key={index}
              className="flex justify-between items-start text-sm"
            >
              <p>{item.item}</p>
              <p>₦ {item.price}</p>
            </div>
          ))}
          <Divider />
          <div className="flex justify-between items-center font-semibold">
            <p>Total</p>
            <p>7,000</p>
          </div>
          <Divider />
        </div>
        <div className="space-y-4">
          {/* customer info */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-lg">Vendor Information</h4>
            <div className="flex gap-2">
              {/* image */}
              <div className="size-12 relative">
                <Image
                  src={"/placeholder.svg"}
                  alt="Customer Image"
                  fill
                  className="rounded-full object-cover"
                />
              </div>
              {/* details */}
              <Heading
                heading={orderDetails.vendorInformation?.businessName}
                subtitle={orderDetails.vendorInformation.businessType}
                xs
                spacing="0"
              />
            </div>
          </div>

          {/* status rendered tabs */}
          {statusExtras[orderDetails.status]}
        </div>
        {/* divider and button */}
        <Divider />
        <Button content="Close" onClick={onClose} />
      </div>
    </Modal>
  );
}
