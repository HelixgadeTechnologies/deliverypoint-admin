"use client";

import { WithdrawalRequest } from "@/types/withdrawal";
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
  withdrawal: WithdrawalRequest | null;
  onApprove: (withdrawal: WithdrawalRequest) => void;
  onDecline: (withdrawal: WithdrawalRequest) => void;
};

export default function UserDetailsModal({
  isOpen,
  onClose,
  withdrawal,
  onApprove,
  onDecline,
}: UserDetailsModalProps) {
  const [confirmApproval, setConfirmApproval] = useState(false);
  const [confirmDecline, setConfirmDecline] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!withdrawal) {
    return null;
  }

  const handleApprove = async () => {
    setIsProcessing(true);
    await onApprove(withdrawal);
    setIsProcessing(false);
    setConfirmApproval(false);
  };

  const handleDecline = async () => {
    setIsProcessing(true);
    await onDecline(withdrawal);
    setIsProcessing(false);
    setConfirmDecline(false);
  };

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
            <Heading heading="Withdrawal Information" sm />
            <StatusTab status={withdrawal.status} />
          </div>
          <div className="space-y-4 text-sm h-[350px] scrollable">
            <div>
              <h4 className="text-[#1F1F1F]">Name</h4>
              <p className="text-[#6E747D]">{withdrawal.name}</p>
            </div>
            <div>
              <h4 className="text-[#1F1F1F]">Account Name</h4>
              <p className="text-[#6E747D]">{withdrawal.accountName}</p>
            </div>
            <div>
              <h4 className="text-[#1F1F1F]">Bank Name</h4>
              <p className="text-[#6E747D]">{withdrawal.bankName}</p>
            </div>
            <div>
              <h4 className="text-[#1F1F1F]">Account Number</h4>
              <p className="text-[#6E747D]">{withdrawal.bankAccountNumber}</p>
            </div>
            <div>
              <h4 className="text-[#1F1F1F]">User Type</h4>
              <p className="text-[#6E747D]">{withdrawal.user_type}</p>
            </div>
            <div>
              <h4 className="text-[#1F1F1F]">Wallet Balance</h4>
              <p className="text-[#6E747D]">₦{withdrawal.walletBalance?.toLocaleString()}</p>
            </div>
            <div>
              <h4 className="text-[#1F1F1F]">Last Payout Date</h4>
              <p className="text-[#6E747D]">
                {withdrawal.lastPayOutDate
                  ? new Date(withdrawal.lastPayOutDate.seconds * 1000).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
            <div>
              <h4 className="text-[#1F1F1F]">No. of Withdrawals</h4>
              <p className="text-[#6E747D]">{withdrawal.NoOfWithdrawal}</p>
            </div>
            <div className="primary">
              <h4>Withdrawal Amount Requested</h4>
              <p>₦{withdrawal.withdrawalAmount?.toLocaleString()}</p>
            </div>
            <div>
              <h4 className="text-[#1F1F1F]">Request Date</h4>
              <p className="text-[#6E747D]">
                {withdrawal.createdAt
                  ? new Date(withdrawal.createdAt.seconds * 1000).toLocaleString()
                  : "N/A"}
              </p>
            </div>
          </div>
          {withdrawal.status === "Pending" && (
            <div className="flex items-center justify-end mt-2.5">
              <div className="flex flex-col md:flex-row items-center gap-2 w-[400px]">
                <Button
                  onClick={() => setConfirmDecline(true)}
                  content="Decline Request"
                  variant="error"
                  isSecondary
                />
                <Button
                  onClick={() => setConfirmApproval(true)}
                  content="Approve Withdrawal"
                  variant="success"
                />
              </div>
            </div>
          )}
        </CardComponent>
      </Modal>

      {/* Approve confirmation modal */}
      <Modal
        isOpen={confirmApproval}
        onClose={() => setConfirmApproval(false)}
        maxWidth="700px"
      >
        <div className="space-y-10 mb-4">
          <div className="flex items-center justify-between">
            <Heading
              heading="Approve Withdrawal"
              subtitle={`Are you sure you want to approve the withdrawal request for ${withdrawal.name}?`}
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
                isDisabled={isProcessing}
              />
              <Button
                onClick={handleApprove}
                content={isProcessing ? "Processing..." : "Approve"}
                variant="success"
                isDisabled={isProcessing}
              />
            </div>
          </div>
        </div>
      </Modal>

      {/* Decline confirmation modal */}
      <Modal
        isOpen={confirmDecline}
        onClose={() => setConfirmDecline(false)}
        maxWidth="700px"
      >
        <div className="space-y-10 mb-4">
          <div className="flex items-center justify-between">
            <Heading
              heading="Decline Withdrawal"
              subtitle={`Are you sure you want to decline this request? The amount (₦${withdrawal.withdrawalAmount?.toLocaleString()}) will be refunded to the user's wallet.`}
              spacing="3"
            />
            <div
              onClick={() => setConfirmDecline(false)}
              className="size-[34px] rounded-full bg-[#F8F9FA99] flex justify-center items-center cursor-pointer"
            >
              <Icon icon={"mingcute:close-line"} />
            </div>
          </div>
          <div className="flex items-center">
            <div className="flex items-center gap-2 w-[400px]">
              <Button
                onClick={() => setConfirmDecline(false)}
                content="Cancel"
                variant="error"
                isSecondary
                isDisabled={isProcessing}
              />
              <Button
                onClick={handleDecline}
                content={isProcessing ? "Processing..." : "Decline & Refund"}
                variant="error"
                isDisabled={isProcessing}
              />
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
