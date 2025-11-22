import Button from "@/ui/button";
import Modal from "@/ui/popup-modal";
import { Icon } from "@iconify/react";

type Props = {
  user: string;
  isOpen: boolean;
  onClose: () => void;
  onActivate: () => void;
  isLoading?: boolean;
};

export default function UserActivatedModal({ 
  user, 
  isOpen, 
  onClose, 
  onActivate, 
  isLoading = false 
}: Props) {
  const handleActivate = () => {
    onActivate();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col items-center justify-center gap-2">
        <div
          onClick={onClose}
          className="absolute top-5 right-5 size-[34px] rounded-full flex justify-center items-center bg-[#F8F9FA99] cursor-pointer"
        >
          <Icon icon={"mingcute:close-line"} height={16} width={16} />
        </div>
        <Icon
          icon={"material-symbols:check-circle-outline"}
          height={60}
          width={60}
          color="#0095DA"
        />
        <h4 className="text-xl font-bold text-center">Activate User</h4>
        <p className="text-center text-sm text-[#7C7979]">
          Are you sure you want to activate <strong>{user}</strong>?
        </p>
        <Button 
          content={isLoading ? "Activating..." : "Activate User"} 
          onClick={handleActivate}
          isDisabled={isLoading}
        />
      </div>
    </Modal>
  );
}