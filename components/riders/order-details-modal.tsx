"use client";
import { RiderOrderDetails } from "@/types/riders";
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
  orderDetails: RiderOrderDetails;
};
export default function OrderDetailsModal({
  isOpen,
  onClose,
  orderDetails,
}: OrderDetailsProps) {
  // for status dependent displays
  const statusExtras: Record<string, JSX.Element> = {
    Rejected: (
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
        <div className="bg-[#FFAC330D] rounded-lg space-y-1 p-2 h-[53px] flex items-start gap-1">
          <Icon
            icon={"mdi-light:clock"}
            height={16}
            width={16}
            color="#92400E"
          />
          <div>
            <p className="text-[#92400E] text-sm">Delivery Duration</p>
            <p className="text-xs text-[#1F1F1F]">
              {orderDetails.deliveryInfo?.distance}{" "}
              {orderDetails.deliveryInfo?.time}
            </p>
          </div>
        </div>
        <div className="bg-[#FFFBEB] border border-[#FFAC3333] py-[9] px-[13px] rounded-md h-[60px] w-full text-sm">
          <div className="flex items-center gap-4">
            <Image
              src={"/stars.svg"}
              alt="Temporary Rating"
              height={20}
              width={80}
            />
            <p>{orderDetails.deliveryInfo?.rateCount}/5</p>
          </div>
          <p className="text-[#92400E] ml-2.5">
            {orderDetails.deliveryInfo?.review}
          </p>
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
          <h3 className="font-semibold text-base">Order Status</h3>
          <div
            className={`w-20 h-7 rounded-lg text-white flex justify-center items-center text-xs ${
              orderDetails.status === "Completed"
                ? "bg-[#21C788]"
                : orderDetails.status === "Rejected"
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
        {/* pickup */}
        <div className="space-y-2 text-sm">
          <p className="text-[#7C7979] flex items-center gap-1">
            <Icon icon={"mynaui:location"} height={16} width={16} /> Pickup
          </p>
          <p className="ml-5">{orderDetails.pickupAddress}</p>
        </div>
        <Divider />
        {/* order details */}
        <div className="space-y-1.5">
          {/* user */}
          <div className="space-y-2 text-sm">
            <p className="flex items-center gap-1">
              <Icon icon={"lets-icons:user"} height={16} width={16} color="#7C7979" />{" "}
              {orderDetails.details.customer}
            </p>
            <ul className="list-disc ml-5">
                {orderDetails.details.items.map((item, index) => <p key={index}>{item}</p>)}
            </ul>
          </div>
          {/* delivery */}
          <div className="space-y-2 text-sm">
            <p className="text-[#7C7979] flex items-center gap-1">
              <Icon icon={"mynaui:location"} height={16} width={16} /> Delivery
            </p>
            <p className="ml-5">{orderDetails.deliveryAddress}</p>
          </div>
        </div>

        {/* delivery fee */}
        <Divider />
        <div className="flex justify-between items-center">
          <h4 className="font-bold text-base">Delivery Fee</h4>
          <h4 className="font-bold text-base">
            <s>N</s>
            {orderDetails.deliveryFee}
          </h4>
        </div>
        <Divider />
        <div className="space-y-4">
          {/* status rendered tabs */}
          {statusExtras[orderDetails.status]}
        </div>
        <Button content="Close" onClick={onClose} />
      </div>
    </Modal>
  );
}
