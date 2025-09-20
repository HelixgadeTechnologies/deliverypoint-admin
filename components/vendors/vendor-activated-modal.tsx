import Button from "@/ui/button";
import Modal from "@/ui/popup-modal";
import { Icon } from "@iconify/react"

type Props = {
    vendor:  string;
    isOpen: boolean;
    onClose: () => void;
}

export default function VendorActivatedModal({ vendor, isOpen, onClose, }: Props) {
    return (
        <Modal
        isOpen={isOpen}
        onClose={onClose}
      >
        <div className="flex flex-col items-center justify-center gap-4">
          <div
            onClick={onClose}
            className="absolute top-5 right-5 size-[34px] rounded-full flex justify-center items-center bg-[#F8F9FA99]"
          >
            <Icon icon={"mingcute:close-line"} height={16} width={16} />
          </div>
          <Icon
            icon={"material-symbols:check-circle-outline"}
            height={60}
            width={60}
            color="#0095DA"
          />
          <h4 className="text-xl font-bold text-center">Vendor Activated</h4>
          <p className="text-center text-sm text-[#7C7979]">
            The vendor <strong>{vendor}</strong>{" "}
            registration request has been activated and they will be notified via
            email to Sign in.
          </p>
          <Button content="Close" onClick={onClose} />
        </div>
      </Modal>
    )
}