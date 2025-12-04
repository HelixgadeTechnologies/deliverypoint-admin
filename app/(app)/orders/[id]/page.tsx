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
import { useState, useEffect } from "react";
import Modal from "@/ui/popup-modal";
import MapView from "@/ui/map";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/app/(app)/firebase/config";
import { Order } from "@/types/order";

export default function OrderDetails() {
  const [isMapOpen, setIsMapOpen] = useState(false);
  const pathname = usePathname();
  const orderId = pathname.split("/").pop();
  const [order, setOrder] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) return;
      try {
        setLoading(true);
        const docRef = doc(db, "orders", orderId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const d = docSnap.data() as Order;
          // Use vendorName directly from the order
          let vendorName = d.vendorName || "Unknown";
          let totalItems = d.items ? Object.keys(d.items).length : 0;
          if (totalItems > 1) {
            vendorName = "Multiple Vendors";
          }

          setOrder({
            id: docSnap.id,
            orderId: d.orderId || docSnap.id,
            customerDetails: {
              name: d.customerName || "Unknown",
              phoneNumber: "", // Not in data
            },
            pickupLocation: d.vendorAddress || "",
            dropOffLocation: d.deliveryAddress || "",
            riderName: d.riderName || "Searching for rider",
            vendorName: vendorName,
            status: d.status || "pending",
            earnings: {
              main: d.totalAmount ?? 0,
              platform: d.adminFee ?? 0,
            },
            items: d.items || {},
            createdAt: d.createdAt,
            raw: d,
          });
        } else {
          console.log("No such document!");
        }
      } catch (err) {
        console.error("Error fetching order:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (!order) {
    return <div className="p-6">Order not found</div>;
  }

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
                <h4 className="text-base">{order.orderId}</h4>
                <p className="text-sm text-[#7C7979]">
                  {order.customerDetails.name}
                </p>
              </div>

              {/* status */}
              <div className="">
                <StatusTab status={order.status} />
              </div>
            </div>
            {/* track order button for pending screen */}
            {order.status === "in progress" && (
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
            {/* order summary */}
            <CardComponent height="100%">
              <Heading xs heading="Order Summary" />
              <div className="space-y-4 text-sm srcollable">
                {/* order id */}
                <div>
                  <h4 className="text-[#1F1F1F]">Order ID</h4>
                  <p className="text-[#6E747D]">{order.orderId}</p>
                </div>
                {/* items */}
                <div>
                  <h4 className="text-[#1F1F1F]">Items</h4>
                  <div className="text-[#6E747D] space-y-2">
                    {Object.values(order.items || {}).map((item: any, index: number) => (
                      <p key={index} className="flex justify-between items-start gap-2.5">
                        <span>{item.quantity}x {item.name}</span>
                        <span className="text-[#1F1F1F] whitespace-nowrap">
                          N {item.price}
                        </span>
                      </p>
                    ))}
                  </div>
                </div>
                {/* customer details */}
                <div>
                  <h4 className="text-[#1F1F1F]">Customer Details</h4>
                  <p className="text-[#6E747D]">
                    {order.customerDetails.name} <br />
                    {order.customerDetails.phoneNumber}
                  </p>
                </div>
                {/* pickup location */}
                <div>
                  <h4 className="text-[#1F1F1F]">Pickup Location</h4>
                  <p className="text-[#6E747D]">
                    {order.pickupLocation}
                  </p>
                </div>
                {/* drop off location */}
                <div>
                  <h4 className="text-[#1F1F1F]">Drop-off Location</h4>
                  <p className="text-[#6E747D]">
                    {order.dropOffLocation}
                  </p>
                </div>
                {/* assigned rider */}
                <div>
                  <h4 className="text-[#1F1F1F]">Assigned Rider</h4>
                  <p className="text-[#6E747D]">{order.riderName}</p>
                </div>
                {/* vendor */}
                <div>
                  <h4 className="text-[#1F1F1F]">Vendor</h4>
                  <p className="text-[#6E747D]">{order.vendorName}</p>
                </div>
              </div>
            </CardComponent>
            {/* status timeline */}
            <CardComponent height="100%">
              <Heading xs heading="Status Timeline" />
              <div className="space-y-4">
                {/* Order Created - Always shown */}
                <StatusTimeline
                  status="Success"
                  title="Order Created"
                  subtitle="Order placed by customer"
                  date={order.raw?.createdAt ? new Date(order.raw.createdAt).toLocaleDateString() : ""}
                  time={order.raw?.createdAt ? new Date(order.raw.createdAt).toLocaleTimeString() : ""}
                />

                {/* Order Accepted by Vendor */}
                <StatusTimeline
                  status={order.raw?.status === "accepted" || order.raw?.status === "completed" || order.raw?.deliveryStatus ? "Success" : order.raw?.status === "cancelled" ? "Inactive" : "Pending"}
                  title="Order Accepted"
                  subtitle={order.raw?.status === "accepted" || order.raw?.status === "completed" || order.raw?.deliveryStatus ? "Vendor accepted the order" : "Waiting for vendor acceptance"}
                  date={order.raw?.vendorAcceptedAt ? new Date(order.raw.vendorAcceptedAt).toLocaleDateString() : ""}
                  time={order.raw?.vendorAcceptedAt ? new Date(order.raw.vendorAcceptedAt).toLocaleTimeString() : ""}
                />

                {/* Check if order was cancelled */}
                {order.raw?.status === "cancelled" ? (
                  <StatusTimeline
                    status="Failed"
                    title="Order Cancelled"
                    subtitle="Order was cancelled"
                    date={order.raw?.updatedAt ? new Date(order.raw.updatedAt).toLocaleDateString() : ""}
                    time={order.raw?.updatedAt ? new Date(order.raw.updatedAt).toLocaleTimeString() : ""}
                  />
                ) : (
                  <>
                    {/* Order Completed (Given to Rider) */}
                    <StatusTimeline
                      status={order.raw?.status === "completed" || order.raw?.deliveryStatus ? "Success" : "Inactive"}
                      title="Order Ready"
                      subtitle={order.raw?.status === "completed" ? "Order given to rider" : "Order being prepared"}
                      date={order.raw?.completedAt ? new Date(order.raw.completedAt).toLocaleDateString() : ""}
                      time={order.raw?.completedAt ? new Date(order.raw.completedAt).toLocaleTimeString() : ""}
                    />

                    {/* Picked Up by Rider */}
                    <StatusTimeline
                      status={order.raw?.deliveryStatus === "picked_up" || order.raw?.deliveryStatus === "in_transit" || order.raw?.deliveryStatus === "delivered" ? "Success" : "Inactive"}
                      title="Picked Up"
                      subtitle={order.raw?.deliveryStatus === "picked_up" || order.raw?.deliveryStatus === "in_transit" || order.raw?.deliveryStatus === "delivered" ? "Rider picked up the order" : "Waiting for rider pickup"}
                      date={order.raw?.pickedUpAt ? new Date(order.raw.pickedUpAt).toLocaleDateString() : ""}
                      time={order.raw?.pickedUpAt ? new Date(order.raw.pickedUpAt).toLocaleTimeString() : ""}
                    />

                    {/* In Transit */}
                    <StatusTimeline
                      status={order.raw?.deliveryStatus === "in_transit" || order.raw?.deliveryStatus === "delivered" ? "Success" : "Inactive"}
                      title="In Transit"
                      subtitle={order.raw?.deliveryStatus === "in_transit" || order.raw?.deliveryStatus === "delivered" ? "Order is on the way" : "Order not yet in transit"}
                      date={order.raw?.inTransitAt ? new Date(order.raw.inTransitAt).toLocaleDateString() : ""}
                      time={order.raw?.inTransitAt ? new Date(order.raw.inTransitAt).toLocaleTimeString() : ""}
                    />

                    {/* Order Delivered */}
                    <StatusTimeline
                      status={order.raw?.deliveryStatus === "delivered" ? "Success" : "Inactive"}
                      title="Order Delivered"
                      subtitle={order.raw?.deliveryStatus === "delivered" ? "Order delivered to customer" : "Awaiting delivery"}
                      date={order.raw?.deliveredAt ? new Date(order.raw.deliveredAt).toLocaleDateString() : ""}
                      time={order.raw?.deliveredAt ? new Date(order.raw.deliveredAt).toLocaleTimeString() : ""}
                    />
                  </>
                )}
              </div>
            </CardComponent>
            {/* earnings breakdown */}
            <CardComponent height="100%">
              <Heading xs heading="Earnings Breakdown" />
              <div className="space-y-3 text-[#7C7979] text-sm">
                <p className="flex justify-between items-center">
                  <span>Platform Fee</span>
                  <span>₦{order.raw?.adminFee?.toLocaleString() || 0}</span>
                </p>
                {/* conditional earning breakdown */}
                {order.status === "cancelled" ? (
                  <div className="space-y-3">
                    <p className="flex justify-between items-center">
                      <span>Rider Payout</span>
                      <span>₦0</span>
                    </p>
                    <Divider />
                    <p className="flex justify-between items-center">
                      <span className="text-[#1F1F1F]">Total Order Value</span>
                      <span>₦{order.earnings.main?.toLocaleString()}</span>
                    </p>
                    <Divider />
                    <p className="flex justify-between items-center">
                      <span className="text-[#1F1F1F]">Commission Status</span>
                      <StatusTab successKeywords={["paid"]} status="cancelled" />
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="flex justify-between items-center">
                      <span>Rider Payout</span>
                      <span>₦{order.raw?.riderCharge?.toLocaleString() || 0}</span>
                    </p>
                    <p className="flex justify-between items-center">
                      <span>Vendor Payout</span>
                      <span>₦{order.raw?.vendorCharge?.toLocaleString() || 0}</span>
                    </p>
                    <Divider />
                    <p className="flex justify-between items-center">
                      <span className="text-[#1F1F1F]">Total Order Value</span>
                      <span>₦{order.earnings.main?.toLocaleString()}</span>
                    </p>
                  </div>
                )}
              </div>
            </CardComponent>
          </div>
        </div>
      </CardComponent>

      {/* track order modal */}
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
            heading={order.orderId}
            subtitle={order.customerDetails.name}
          />
          {/* status */}
          <div className="">
            <StatusTab status={order.status} />
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
