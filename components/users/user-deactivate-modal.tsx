import Button from "@/ui/button";
import TextareaInput from "@/ui/forms/textarea";
import Modal from "@/ui/popup-modal";
import { Icon } from "@iconify/react";
import { useState } from "react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSuspend: (reason: string) => void;
  isLoading?: boolean;
};

export default function UserDeactivateModal({ 
  isOpen, 
  onClose, 
  onSuspend, 
  isLoading = false 
}: Props) {
  const [reason, setReason] = useState("");

  const handleSuspend = () => {
    if (reason.trim()) {
      onSuspend(reason.trim());
    }
  };

  const handleClose = () => {
    setReason(""); // Clear the reason when closing
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div className="flex flex-col items-center justify-center gap-2">
        <div
          onClick={handleClose}
          className="absolute top-5 right-5 size-[34px] rounded-full flex justify-center items-center bg-[#F8F9FA99] cursor-pointer"
        >
          <Icon icon={"mingcute:close-line"} height={16} width={16} />
        </div>
        <Icon icon={"ep:warning"} height={60} width={60} color="#FF4D4F" />
        <h4 className="text-xl font-bold text-center">Warning</h4>
        <p className="text-center text-sm text-[#7C7979]">
          Are you sure you want to deactivate this user? If yes kindly provide
          details below
        </p>
        <TextareaInput
          label="Reason"
          name="suspensionReason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Enter reason for suspension..."
        />
        <div className="flex gap-2 items-center w-full">
          <Button
            content="Cancel"
            onClick={handleClose}
            variant="error"
            isSecondary
            isDisabled={isLoading}
          />
          <Button
            content={isLoading ? "Suspending..." : "Suspend User"}
            variant="error"
            onClick={handleSuspend}
            isDisabled={isLoading || !reason.trim()}
          />
        </div>
      </div>
    </Modal>
  );
}