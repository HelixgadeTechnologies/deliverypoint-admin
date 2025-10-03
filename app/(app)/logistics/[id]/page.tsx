"use client";
import { Icon } from "@iconify/react";
import BackButton from "@/ui/back-button";
import Button from "@/ui/button";
import CardComponent from "@/ui/card-wrapper";
import StatusTab from "@/ui/status-tab";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { logisticsData } from "@/lib/config/demo-data/logistics";
import Heading from "@/ui/text-heading";
import Divider from "@/ui/divider";
import StatusTimeline from "@/ui/status-timeline";
import MapView from "@/ui/map";
import Modal from "@/ui/popup-modal";

export default function LogisticsDetails() {
  const [isMapOpen, setIsMapOpen] = useState(false);
  const pathname = usePathname();
  const logisticsId = pathname.split("/").pop();
  const selectedData = logisticsData.find((order) => order.id === logisticsId);
  if (!selectedData) return <div>Not found</div>;
  return (
    <>
      <CardComponent>
        <div className="space-y-6">
          <BackButton text="Back to Logistics" />
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
                <h4 className="text-base">{selectedData.id}</h4>
                <p className="text-sm text-[#7C7979]">
                  {selectedData.sender.name}
                </p>
              </div>

              {/* status */}
              <div className="">
                <StatusTab status={selectedData.status} />
              </div>
            </div>
            <div className="w-full md:w-[150px]">
              <Button
                content="Track Delivery"
                variant="success"
                onClick={() => setIsMapOpen(true)}
              />
            </div>
          </div>

          {/* details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* parcel information */}
            <CardComponent height="100%">
              <Heading xs heading="Parcel Information" />
              <div className="space-y-4 text-sm">
                {/* order id and payment type */}
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-[#1F1F1F]">Order ID</h4>
                    <p className="text-[#6E747D]">{selectedData.id}</p>
                  </div>
                  <div
                    className={`h-[28px] px-3 text-xs w-[90px] min-w-[80px] rounded-lg flex justify-center items-center  ${
                      selectedData.paymentType === "Card"
                        ? "bg-[#FB923C1A] text-[#92400E]"
                        : selectedData.paymentType === "Cash"
                        ? "bg-[#C9D1DA66] text-[#1F1F1F]"
                        : "bg-[#0095DA1A] text-[#0095DA]"
                    }`}
                  >
                    {selectedData.paymentType}
                  </div>
                </div>
                <div>
                  <h4 className="text-[#1F1F1F]">Sender Number</h4>
                  <p className="text-[#6E747D]">
                    {selectedData.sender.phoneNumber}
                  </p>
                </div>
                <div>
                  <h4 className="text-[#1F1F1F]">Recipient Name</h4>
                  <p className="text-[#6E747D]">Favour Johnson</p>
                </div>
                <div>
                  <h4 className="text-[#1F1F1F]">Description</h4>
                  <p className="text-[#6E747D]">
                    Legal documents for client meeting
                  </p>
                </div>
                <div>
                  <h4 className="text-[#1F1F1F]">Phone Number</h4>
                  <p className="text-[#6E747D]">
                    {selectedData.sender.phoneNumber}
                  </p>
                </div>
                <div>
                  <h4 className="text-[#1F1F1F]">Pickup Location</h4>
                  <p className="text-[#6E747D]">
                    {selectedData.pickupLocation}
                  </p>
                </div>
                <div>
                  <h4 className="text-[#1F1F1F]">Assigned Rider</h4>
                  <p className="text-[#6E747D]">
                    {selectedData.riderAssigned.name}
                  </p>
                </div>
                <div>
                  <h4 className="text-[#1F1F1F]">Vehicle Type</h4>
                  <p className="text-[#6E747D]">
                    {selectedData.riderAssigned.vehicle}
                  </p>
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
              <div className="space-y-3 text-sm text-[#7C7979]">
                <p className="flex justify-between items-center">
                  <span>Platform Fee</span>
                  <span>N 350</span>
                </p>
                <p className="flex justify-between items-center">
                  <span>Rider Payout</span>
                  <span>N 350</span>
                </p>
                <Divider />
                <p className="flex justify-between items-center">
                  <span className="text-[#1F1F1F]">Total Order Value</span>
                  <span>N 4200</span>
                </p>
                <Divider />
                <p className="flex justify-between items-center">
                  <span className="text-[#1F1F1F]">Commission Status</span>
                  <StatusTab successKeywords={["Paid"]} status="Paid" />
                </p>
              </div>
            </CardComponent>
          </div>
        </div>
      </CardComponent>

      {/* track delivery modal */}
      <Modal
        isOpen={isMapOpen}
        onClose={() => setIsMapOpen(false)}
        maxWidth="700px"
      >
        <div className="flex justify-between items-start">
          <Heading heading="Track Delivery" />
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
            heading={selectedData.id}
            subtitle={selectedData.sender.name}
          />
          {/* status */}
          <div className="">
            <StatusTab status={selectedData.status} />
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
