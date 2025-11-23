"use client";

import { Withdrawal } from "@/types/table-data";
import Button from "@/ui/button";
import CardComponent from "@/ui/card-wrapper";
import Modal from "@/ui/popup-modal";
import StatusTab from "@/ui/status-tab";
import Heading from "@/ui/text-heading";
import { Icon } from "@iconify/react";
import { useState } from "react";

type UserDetailsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  user: Withdrawal | null;
};

export default function UserDetailsModal({
  isOpen,
  onClose,
  user,
}: UserDetailsModalProps) {
  const [confirmApproval, setConfirmApproval] = useState(false);

  if (!user) {
    return null;
  }
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} maxWidth="700px">
        <div className="flex items-center justify-between">
          <Heading heading="View Details" />
          <div
            onClick={onClose}
            className="size-[34px] rounded-full bg-[#F8F9FA99] flex justify-center items-center cursor-pointer"
          >
            <Icon icon={"mingcute:close-line"} />
          </div>
        </div>
        <CardComponent>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center -gap-3">
            <Heading heading="User Information" sm />
            <StatusTab status={user.status} />
          </div>
          <div className="space-y-4 text-sm h-[350px] scrollable">
            <div>
              <h4 className="text-[#1F1F1F]">Name</h4>
              <p className="text-[#6E747D]">{user.name.fullName}</p>
            </div>
            {user.userType === "Vendor" && (
              <div>
                <h4 className="text-[#1F1F1F]">Business Name</h4>
                <p className="text-[#6E747D]">Mama&apos;s Kitchen</p>
              </div>
            )}
            <div>
              <h4 className="text-[#1F1F1F]">Phone Number</h4>
              <p className="text-[#6E747D]">{user.name.phoneNumber}</p>
            </div>
            <div>
              <h4 className="text-[#1F1F1F]">User Type</h4>
              <p className="text-[#6E747D]">{user.userType}</p>
            </div>
            <div>
              <h4 className="text-[#1F1F1F]">Wallet Balance</h4>
              <p className="text-[#6E747D]">{user.walletBalance}</p>
            </div>
            <div>
              <h4 className="text-[#1F1F1F]">Last Payout Date</h4>
              <p className="text-[#6E747D]">{user.lastPayoutDate}</p>
            </div>
            <div>
              <h4 className="text-[#1F1F1F]">No. of Withdrawal</h4>
              <p className="text-[#6E747D]">{user.withdrawal}</p>
            </div>
            <div className="primary">
              <h4>Withdrawal Amount Requested</h4>
              <p>N 3, 000</p>
            </div>
          </div>
          {user.status === "pending" && (
            <div className="flex items-center justify-end mt-2.5">
              <div className="flex flex-col md:flex-row items-center gap-2 w-[400px]">
                <Button
                  onClick={onClose}
                  content="Cancel"
                  variant="success"
                  isSecondary
                />
                <Button
                  onClick={() => {
                    setConfirmApproval(true);
                    onClose();
                  }}
                  content="Approve Withdrawal"
                  variant="success"
                />
              </div>
            </div>
          )}
        </CardComponent>
      </Modal>

      {/* confirm modal */}
      <Modal
        isOpen={confirmApproval}
        onClose={() => setConfirmApproval(false)}
        maxWidth="700px"
      >
        <div className="space-y-10 mb-4">
          <div className="flex items-center justify-between">
            <Heading
              heading="Approve Withdrawal"
              subtitle={`Are you sure you want to mark the payout for ${user.name.fullName} as paid?`}
              spacing="3"
            />
            <div
              onClick={() => setConfirmApproval(false)}
              className="size-[34px] rounded-full bg-[#F8F9FA99] flex justify-center items-center cursor-pointer"
            >
              <Icon icon={"mingcute:close-line"} />
            </div>
          </div>
          <div className="flex items-center">
            <div className="flex items-center gap-2 w-[400px]">
              <Button
                onClick={() => setConfirmApproval(false)}
                content="Cancel"
                variant="success"
                isSecondary
              />
              <Button content="Approve" variant="success" />
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
