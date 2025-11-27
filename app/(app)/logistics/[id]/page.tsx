"use client";
import { Icon } from "@iconify/react";
import BackButton from "@/ui/back-button";
import Button from "@/ui/button";
import CardComponent from "@/ui/card-wrapper";
import StatusTab, { StatusTab2 } from "@/ui/status-tab";
import { fetchLogisticsById } from "@/lib/services/logisticsservice";
import { FirebaseLogistics } from "@/types/logistics.types";
import { useEffect, useState } from "react";
import Heading from "@/ui/text-heading";
import Divider from "@/ui/divider";
import StatusTimeline from "@/ui/status-timeline";
import MapView from "@/ui/map";
import Modal from "@/ui/popup-modal";
import { usePathname } from "next/navigation";

export default function LogisticsDetails() {
  const [isMapOpen, setIsMapOpen] = useState(false);
  const pathname = usePathname();
  const logisticsId = pathname.split("/").pop();
  const [selectedData, setSelectedData] = useState<FirebaseLogistics | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      if (!logisticsId) return;
      try {
        setLoading(true);
        const data = await fetchLogisticsById(logisticsId);
        setSelectedData(data);
      } catch (err) {
        console.error("Failed to load logistics details", err);
        setError("Failed to load logistics details");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [logisticsId]);

  if (loading) {
    return <div className="p-6 text-center">Loading details...</div>;
  }

  if (error || !selectedData) {
    return <div className="p-6 text-center text-red-500">{error || "Not found"}</div>;
  }

  // Calculate earnings
  const platformFee = (selectedData.totalAmount * 0.1).toFixed(2);
  const mainEarnings = (selectedData.totalAmount - parseFloat(platformFee)).toFixed(2);

  // Map payment method to display format
  const paymentTypeMap: Record<string, string> = {
    card: "Card",
    wallet: "Wallet",
    cash: "Cash",
  };
  const paymentTypeDisplay = paymentTypeMap[selectedData.paymentMethod] || "Wallet";

  // Map vehicle type to display format
  const vehicleTypeDisplay = selectedData.deliveryType
    ? selectedData.deliveryType.charAt(0).toUpperCase() + selectedData.deliveryType.slice(1)
    : "Vehicle";

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
                  {selectedData.pickupContactName}
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
                    className={`h-[28px] px-3 text-xs w-[90px] min-w-[80px] rounded-lg flex justify-center items-center  ${paymentTypeDisplay === "Card"
                      ? "bg-[#FB923C1A] text-[#92400E]"
                      : paymentTypeDisplay === "Cash"
                        ? "bg-[#C9D1DA66] text-[#1F1F1F]"
                        : "bg-[#0095DA1A] text-[#0095DA]"
                      }`}
                  >
                    {paymentTypeDisplay}
                  </div>
                </div>
                <div>
                  <h4 className="text-[#1F1F1F]">Sender Number</h4>
                  <p className="text-[#6E747D]">
                    {selectedData.pickupContactPhone}
                  </p>
                </div>
                <div>
                  <h4 className="text-[#1F1F1F]">Recipient Name</h4>
                  <p className="text-[#6E747D]">{selectedData.deliveryContactName}</p>
                </div>
                <div>
                  <h4 className="text-[#1F1F1F]">Description</h4>
                  <p className="text-[#6E747D]">
                    {selectedData.parcelDescription}
                  </p>
                </div>
                <div>
                  <h4 className="text-[#1F1F1F]">Phone Number</h4>
                  <p className="text-[#6E747D]">
                    {selectedData.deliveryContactPhone}
                  </p>
                </div>
                <div>
                  <h4 className="text-[#1F1F1F]">Pickup Location</h4>
                  <p className="text-[#6E747D]">
                    {selectedData.pickupAddress}, {selectedData.pickupCity}, {selectedData.pickupState}
                  </p>
                </div>
                <div>
                  <h4 className="text-[#1F1F1F]">Assigned Rider</h4>
                  <p className="text-[#6E747D]">
                    {selectedData.riderId || "Not Assigned"}
                  </p>
                </div>
                <div>
                  <h4 className="text-[#1F1F1F]">Vehicle Type</h4>
                  <p className="text-[#6E747D]">
                    {vehicleTypeDisplay}
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
                  date={selectedData.createdAt ? new Date(selectedData.createdAt.seconds * 1000).toLocaleDateString() : "N/A"}
                  time={selectedData.createdAt ? new Date(selectedData.createdAt.seconds * 1000).toLocaleTimeString() : "N/A"}
                />
                {/* Add more timeline items based on status if needed */}
              </div>
            </CardComponent>
            {/* earnings breakdown */}
            <CardComponent height="100%">
              <Heading xs heading="Earnings Breakdown" />
              <div className="space-y-3 text-sm text-[#7C7979]">
                <p className="flex justify-between items-center">
                  <span>Platform Fee</span>
                  <span>N {platformFee}</span>
                </p>
                <p className="flex justify-between items-center">
                  <span>Rider Payout</span>
                  <span>N {mainEarnings}</span>
                </p>
                <Divider />
                <p className="flex justify-between items-center">
                  <span className="text-[#1F1F1F]">Total Order Value</span>
                  <span>N {selectedData.totalAmount}</span>
                </p>
                <Divider />
                <p className="flex justify-between items-center">
                  <span className="text-[#1F1F1F]">Commission Status</span>
                  <StatusTab2 successKeywords={["completed"]} status={selectedData.paymentStatus} />
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
            heading={selectedData.id || ""}
            subtitle={selectedData.pickupContactName}
          />
          {/* status */}
          <div className="">
            <StatusTab status={selectedData.status} />
          </div>
        </div>
        <MapView
          currentLocation={{
            label: "Pickup Location",
            description: selectedData.pickupAddress,
            x: selectedData.pickupLng,
            y: selectedData.pickupLat,
          }}
          destination={{
            label: "Destination",
            x: selectedData.deliveryLng,
            y: selectedData.deliveryLat,
          }}
          showPath={true}
        />
      </Modal>
    </>
  );
}
