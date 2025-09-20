"use client";

import { usePathname } from "next/navigation";
import { Icon } from "@iconify/react";
import { supportTickets } from "@/lib/config/demo-data/support";
import CardComponent from "@/ui/card-wrapper";
import Button from "@/ui/button";
import StatusTab from "@/ui/status-tab";
import { JSX, useState } from "react";
import Modal from "@/ui/popup-modal";
import Heading from "@/ui/text-heading";
import TextareaInput from "@/ui/forms/textarea";
import BackButton from "@/ui/back-button";

export default function SupportDetails() {
  const pathname = usePathname();
  const [confirmResolve, setConfirmResolve] = useState(false);

  const ticketId = pathname.split("/").pop();
  const selectedTicket = supportTickets.find(
    (ticket) => ticket.id === ticketId
  );

  if (!selectedTicket) return <div>Not found.</div>;

  // for buttons
  const statusActions: Record<string, JSX.Element> = {
    Open: (
      <div className="gap-2 items-center flex md:w-[400px]">
        <Button content="Mark as In Progress" variant="success" isSecondary />
        <Button
          content="Mark as Resolved"
          variant="success"
          onClick={() => setConfirmResolve(true)}
        />
      </div>
    ),
    "In Progress": (
      <div className="w-[200px]">
        <Button
          content="Mark as Resolved"
          variant="success"
          onClick={() => setConfirmResolve(true)}
        />
      </div>
    ),
  };

  // for card on resolved tickets
  const statusCard: Record<string, JSX.Element> = {
    Resolved: (
      <div className="bg-[#0095DA15] py-2 px-4 rounded-2xl primary w-[360px]">
        <h4 className="font-semibold text-base">Internal Note</h4>
        <p className="text-sm font-normal">Customer contacted twice. Need to investigate with rider.</p>
      </div>
    )
  }

  return (
    <>
      <CardComponent>
        <div className="space-y-6">
          {/* back button */}
          <BackButton text="Back to Support" />

          {/* header */}
          <div className="flex justify-between items-center">
            <div className="flex gap-2 items-start">
              <div className="size-11 flex justify-center items-center bg-[#0095DA] rounded-lg">
                <Icon
                  icon="cuida:ticket-outline"
                  height={24}
                  width={24}
                  color="#fff"
                />
              </div>
              <div className="mr-5">
                <h4 className="text-base truncate">
                  {selectedTicket.ticketID}
                </h4>
                <p className="text-sm truncate text-[#7C7979]">
                  {selectedTicket.submittedBy}
                </p>
              </div>
              <StatusTab status={selectedTicket.status} />
            </div>

            {/* status-based actions */}
            {statusActions[selectedTicket.status]}
          </div>
          {/* body */}
          <div className="flex gap-6 items-center">
            <CardComponent maxWidth="60%">
              <div className="space-y-4">
                <h4 className="text-base font-bold text-[#1F1F1F]">
                  Ticket Information
                </h4>
                {/* subject */}
                <div className="text-sm">
                  <p>Subject</p>
                  <p className="text-[#6E747D]">
                    {selectedTicket.subject.title}
                  </p>
                </div>
                {/* description */}
                <div className="text-sm">
                  <p>Ticket Description</p>
                  <p className="text-[#6E747D]">
                    {selectedTicket.subject.description}
                  </p>
                </div>
                {/* related order */}
                <div className="text-sm">
                  <p>Related Order</p>
                  <p className="text-[#6E747D]">
                    {selectedTicket.ticketID}
                  </p>
                </div>
                {/* status based card */}
                {statusCard[selectedTicket.status]}
              </div>
            </CardComponent>
            <CardComponent maxWidth="40%">
              <div className="space-y-4">
                <h4 className="text-base font-bold text-[#1F1F1F]">
                  Contact Information
                </h4>
                {/* subject */}
                <div className="text-sm">
                  <p>Name</p>
                  <p className="text-[#6E747D]">
                    {selectedTicket.submittedBy}
                  </p>
                </div>
                {/* description */}
                <div className="text-sm">
                  <p>User type</p>
                  <p className="text-[#6E747D]">
                    {selectedTicket.userType}
                  </p>
                </div>
                {/* related order */}
                <div className="text-sm">
                  <p>Contact Info</p>
                  <p className="text-[#6E747D]">
                    {selectedTicket.email}
                  </p>
                </div>
              </div>
            </CardComponent>
          </div>
        </div>
      </CardComponent>

      <Modal
        isOpen={confirmResolve}
        onClose={() => setConfirmResolve(false)}
        maxWidth="700px"
      >
        <div className="space-y-6">
          <Heading
            heading="Mark as Resolved"
            subtitle="Are you sure you want to resolve this complaint?"
          />
          <TextareaInput
            label="Internal Notes"
            value=""
            placeholder="Add Internal notes on resolution"
            name="internalNotes"
            onChange={() => {}}
          />
          <div className="gap-2 items-center flex md:w-[400px]">
            <Button
              content="Cancel"
              variant="success"
              isSecondary
              onClick={() => setConfirmResolve(false)}
            />
            <Button content="Mark as Resolved" variant="success" />
          </div>
        </div>
      </Modal>
    </>
  );
}
