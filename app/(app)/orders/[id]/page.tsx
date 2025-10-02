"use client";
import BackButton from "@/ui/back-button";
import CardComponent from "@/ui/card-wrapper";
import { Icon } from "@iconify/react";
import StatusTimeline from "@/ui/status-timeline";
import { usePathname } from "next/navigation";
import { orderTableData } from "@/lib/config/demo-data/orders";
import StatusTab from "@/ui/status-tab";
import Heading from "@/ui/text-heading";
import Divider from "@/ui/divider";
import Button from "@/ui/button";
import { useState } from "react";
import Modal from "@/ui/popup-modal";
import MapView from "@/ui/map";

export default function OrderDetails() {
  const [isMapOpen, setIsMapOpen] = useState(false);
  const pathname = usePathname();
  const orderId = pathname.split("/").pop();
  const selectedOrder = orderTableData.find((order) => order.id === orderId);
  if (!selectedOrder) return <div>Not found</div>;
  return (
    <>
      <CardComponent>
        <div className="space-y-6">
          {/* back button */}
          <BackButton text="Back to  Orders" />

          {/* header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center relative gap-3">
              <div className="size-11 rounded-lg flex justify-center items-center shadow-lg bg-[#0095DA]">
                <Icon
                  icon={"solar:wallet-outline"}
                  height={24}
                  width={24}
                  color="#FFF"
                />
              </div>
              <div>
                <h4 className="text-base">{selectedOrder.id}</h4>
                <p className="text-sm text-[#7C7979]">
                  {selectedOrder.customerDetails.name}
                </p>
              </div>

              {/* status */}
              <div className="">
                <StatusTab status={selectedOrder.status} />
              </div>
            </div>
            {/* track order button for pending screen */}
            {selectedOrder.status === "In Progress" && (
              <div className="w-full md:w-[150px]">
                <Button
                  content="Track Order"
                  variant="success"
                  onClick={() => setIsMapOpen(true)}
                />
              </div>
            )}
          </div>

          {/* details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* order summary (PS. for 'items', write functionality to map through items and display the first two then minus 2 from the more items) */}
            <CardComponent height="100%">
              <Heading xs heading="Order Summary" />
              <div className="space-y-4 text-sm srcollable">
                {/* order id */}
                <div>
                  <h4 className="text-[#1F1F1F]">Order ID</h4>
                  <p className="text-[#6E747D]">{selectedOrder.id}</p>
                </div>
                {/* items */}
                <div>
                  <h4 className="text-[#1F1F1F]">Items</h4>
                  <p className="text-[#6E747D] flex justify-between items-start gap-2.5">
                    <span>2x Chicken Burgers with extra cheese and bacon</span>
                    <span className="text-[#1F1F1F] whitespace-nowrap">
                      N 3,500
                    </span>
                  </p>
                </div>
                {/* customer details */}
                <div>
                  <h4 className="text-[#1F1F1F]">Customer Details</h4>
                  <p className="text-[#6E747D]">
                    {selectedOrder.customerDetails.name} <br />
                    {selectedOrder.customerDetails.phoneNumber}
                  </p>
                </div>
                {/* pickup location */}
                <div>
                  <h4 className="text-[#1F1F1F]">Pickup Location</h4>
                  <p className="text-[#6E747D]">
                    {selectedOrder.pickupLocation}
                  </p>
                </div>
                {/* drop off location */}
                <div>
                  <h4 className="text-[#1F1F1F]">Drop-off Location</h4>
                  <p className="text-[#6E747D]">
                    {selectedOrder.dropOffLocation}
                  </p>
                </div>
                {/* assigned rider */}
                <div>
                  <h4 className="text-[#1F1F1F]">Assigned Rider</h4>
                  <p className="text-[#6E747D]">{selectedOrder.riderName}</p>
                </div>
                {/* vendor */}
                <div>
                  <h4 className="text-[#1F1F1F]">Vendor</h4>
                  <p className="text-[#6E747D]">{selectedOrder.vendorName}</p>
                </div>
              </div>
            </CardComponent>
            {/* status timeline */}
            <CardComponent height="100%">
              <Heading xs heading="Status Timeline" />
              <div className="space-y-4">
                <StatusTimeline
                  status="Success"
                  title="Order Created"
                  subtitle="Order placed by customer"
                  date="22/12/2024"
                  time="11:30:00"
                />
                <StatusTimeline
                  status="Pending"
                  title="Picked Up"
                  subtitle="Pending rider confirmation"
                  date="22/12/2024"
                  time="11:30:00"
                />
                <StatusTimeline
                  status="Inactive"
                  title="Delivered"
                  subtitle="Order delivered to customer"
                  date="22/12/2024"
                  time="11:30:00"
                />
              </div>
            </CardComponent>
            {/* earnings breakdown */}
            <CardComponent height="100%">
              <Heading xs heading="Earnings Breakdown" />
              <div className="space-y-3 text-[#7C7979] text-sm">
                <p className="flex justify-between items-center">
                  <span>Platform Fee</span>
                  <span>N 350</span>
                </p>
                <p className="flex justify-between items-center">
                  <span>Rider Payout</span>
                  <span>N 350</span>
                </p>
                <p className="flex justify-between items-center">
                  <span>Vendor Payout</span>
                  <span>N 3500</span>
                </p>
                <Divider />
                <p className="flex justify-between items-center">
                  <span className="text-[#1F1F1F]">Total Order Value</span>
                  <span>N 350</span>
                </p>
              </div>
            </CardComponent>
          </div>
        </div>
      </CardComponent>

      <Modal
        isOpen={isMapOpen}
        onClose={() => setIsMapOpen(false)}
        maxWidth="700px"
      >
        <div className="flex justify-between items-start">
          <Heading heading="Track Order" />
          <div
            onClick={() => setIsMapOpen(false)}
            className="size-[34px] rounded-full bg-[#F8F9FA99] flex justify-center items-center"
          >
            <Icon icon={"mingcute:close-line"} height={16} width={16} />
          </div>
        </div>
        {/* smaller order heading */}
        <div className="flex items-center relative gap-3 mb-4">
          {/* icon */}
          <div className="size-11 rounded-lg flex justify-center items-center shadow-lg bg-[#0095DA]">
            <Icon
              icon={"solar:wallet-outline"}
              height={24}
              width={24}
              color="#FFF"
            />
          </div>
          <Heading
            sm
            heading={selectedOrder.id}
            subtitle={selectedOrder.customerDetails.name}
          />
          {/* status */}
          <div className="">
            <StatusTab status={selectedOrder.status} />
          </div>
        </div>
        <MapView
          currentLocation={{
            label: "Current Location",
            description: "Approaching GRA Junction",
            x: 10,
            y: 40,
          }}
          destination={{
            label: "Destination",
            x: 90,
            y: 50,
          }}
          showPath={true}
        />
      </Modal>
    </>
  );
}
