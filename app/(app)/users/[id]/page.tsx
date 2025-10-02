"use client";
import { usePathname } from "next/navigation";
// import { Icon } from "@iconify/react";
import { JSX, useState } from "react";
import BackButton from "@/ui/back-button";
import Button from "@/ui/button";
import CardComponent from "@/ui/card-wrapper";
import StatusTab from "@/ui/status-tab";
import Image from "next/image";
import Heading from "@/ui/text-heading";
import SummaryRow from "@/ui/summary-row";
import { userOrderHistory, userTableData } from "@/lib/config/demo-data/users";
import Divider from "@/ui/divider";
import UserActivatedModal from "@/components/users/user-activated-modal";
import UserDeactivateModal from "@/components/users/user-deactivate-modal";
import OrderDetailsModal from "@/components/users/user-order-details-modal";
import { UserOrderDetails } from "@/types/users";

export default function UserDetails() {
  // for order details
  const [selectedOrder, setSelectedOrder] = useState<UserOrderDetails | null>(
    null
  );

  const pathname = usePathname();
  const [userActivatedModal, setUserActivatedModal] = useState(false);
  const [userDeactivatedModal, setUserDeactivatedModal] = useState(false);

  const userId = pathname.split("/").pop();
  const selectedUser = userTableData.find((user) => user.id === userId);
  if (!selectedUser) return <div>Not found.</div>;

  // for buttons - change onClick functions to api calls that in turn trigger modal later
  const statusActions: Record<string, JSX.Element> = {
    Active: (
      <Button
        content="Suspend User"
        variant="error"
        icon="mynaui:pause"
        onClick={() => setUserDeactivatedModal(true)}
      />
    ),
    Suspended: (
      <Button
        content="Activate User"
        variant="normal"
        icon="material-symbols:check-rounded"
        onClick={() => setUserActivatedModal(true)}
      />
    ),
  };

  // for card on suspended users
  const statusCard: Record<string, JSX.Element> = {
    Suspended: (
      <div className="bg-[#FF4D4F15] py-2 px-4 rounded-2xl text-[#FF4D4F] w-full">
        <h4 className="font-semibold text-base">Reason</h4>
        <p className="text-sm font-normal">
          User was involved in actions not conforming to company’s policy
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
          <BackButton text="Back to Users" />

          {/* header */}
        <div className="flex flex-col md:flex-row items-start justify-between gap-4">
            <div className="flex flex-col md:flex-row items-start md:items-center relative gap-3">
              <Image
                src={selectedUser.user.image}
                alt="Profile Picture"
                height={50}
                width={50}
                className="object-cover"
              />
              <div>
                <h4 className="text-base">{selectedUser.user.name}</h4>
                <p className="text-sm text-[#7C7979]">
                  {selectedUser.user.email}
                </p>
              </div>

              {/* status */}
              <div className="">
                <StatusTab status={selectedUser.status} />
              </div>
            </div>

            {/* action buttons */}
            <div className="w-full md:w-[200px]">
              {statusActions[selectedUser.status]}
            </div>
          </div>

          {/* details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* profile info */}
            <CardComponent height="100%">
              <Heading xs heading="Profile Information" />
              <div className="space-y-4 text-sm">
                <div>
                  <h4 className="text-[#1F1F1F]">Name</h4>
                  <p className="text-[#6E747D]">John Smith</p>
                </div>
                <div>
                  <h4 className="text-[#1F1F1F]">Contact Email</h4>
                  <p className="text-[#6E747D]">john@gmail.com</p>
                </div>
                <div>
                  <h4 className="text-[#1F1F1F]">Phone Number</h4>
                  <p className="text-[#6E747D]">09016796847</p>
                </div>
                <div>
                  <h4 className="text-[#1F1F1F]">Registration Date</h4>
                  <p className="text-[#6E747D]">15/01/2024</p>
                </div>
                <div>
                  <h4 className="text-[#1F1F1F]">Last Order</h4>
                  <p className="text-[#6E747D]">15/01/2024</p>
                </div>
              </div>
            </CardComponent>

            {/* order history */}
            <CardComponent height="100%">
              <Heading xs heading="Order History" />
              <div className="space-y-4">
                <SummaryRow
                  icon="material-symbols-light:package-2-outline"
                  name="Total Orders"
                  color="#21C788"
                  amount={selectedUser.totalOrders}
                />
                <Divider />
                <div className="space-y-4 scrollable">
                  {userOrderHistory.map((order) => (
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
                              : order.status === "Cancelled"
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
            </CardComponent>

            {/* order summary */}
            <CardComponent height="100%">
              <Heading xs heading="Order Summary" />
              <SummaryRow
                icon="mynaui:dollar"
                name="Total Order Summary"
                color="#21C788"
                amount="N 18,750.5"
              />
              <div className="mt-4 text-sm">
                <h4 className="text-[#1F1F1F]">Last Order</h4>
                <p className="text-[#6E747D]">2024-12-14</p>
              </div>
              <div className="mt-6">{statusCard[selectedUser.status]}</div>
            </CardComponent>
          </div>
        </div>
      </CardComponent>

      {/* user activated modal */}
      <UserActivatedModal
        isOpen={userActivatedModal}
        onClose={() => setUserActivatedModal(false)}
        user={selectedUser.user.name}
      />

      {/* user decativate modal */}
      <UserDeactivateModal
        isOpen={userDeactivatedModal}
        onClose={() => setUserDeactivatedModal(false)}
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
