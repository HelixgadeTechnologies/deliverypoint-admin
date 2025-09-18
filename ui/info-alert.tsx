import { Icon } from "@iconify/react";

type InfoProps = {
  icon: string;
  text: string;
};

export default function InfoAlert({ icon, text }: InfoProps) {
  return (
    <div className="h-10 w-full bg-[#0095DA1A] rounded py-2 px-4 gap-2.5 flex items-center">
      <Icon icon={icon} height={24} width={24} color="#0095DA" />
      <p className="text-[#0095DA] text-base font-normal whitespace-nowrap">
        {text}
      </p>
    </div>
  );
}
