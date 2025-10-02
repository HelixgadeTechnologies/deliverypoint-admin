import { Icon } from "@iconify/react";

type Props = {
    icon: string;
    amount: string;
    name: string;
    color: string;
};

export default function SummaryRow({
    icon,
    amount,
    name,
    color,
}: Props) {
  return (
    <div className="flex justify-between items-center text-sm">
      <div className="flex gap-2 items-center">
        <Icon icon={icon} color={color} height={20} width={20} />
        <p className="text-[#1F1F1F]">{name}</p>
      </div>
      <p className="text-[#6E747D]">{amount}</p>
    </div>
  );
}
