import Button from "@/ui/button";
import TextareaInput from "@/ui/forms/textarea";
import Modal from "@/ui/popup-modal";
import { Icon } from "@iconify/react";
import { useState } from "react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function RiderSuspendedModal({ isOpen, onClose }: Props) {
  const [query, setQuery] = useState("");
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col items-center justify-center gap-4">
        <div
          onClick={onClose}
          className="absolute top-5 right-5 size-[34px] rounded-full flex justify-center items-center bg-[#F8F9FA99]"
        >
          <Icon icon={"mingcute:close-line"} height={16} width={16} />
        </div>
        <Icon icon={"ep:warning"} height={60} width={60} color="#FF4D4F" />
        <h4 className="text-xl font-bold text-center">Warning</h4>
        <p className="text-center text-sm text-[#7C7979]">
          Are you sure you want to deactivate this Rider? If yes kindly provide
          details below
        </p>
        <TextareaInput
          label="Reason"
          name="suspensionReason"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="flex gap-2 items-center w-full">
            <Button
            content="Cancel"
            onClick={onClose}
            variant="error"
            isSecondary
            />
            <Button
            content="Suspend User"
            variant="error"
            />
        </div>
      </div>
    </Modal>
  );
}
