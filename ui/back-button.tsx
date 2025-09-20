import { Icon } from "@iconify/react";

type BackButtonProps = {
  text: string;
};

export default function BackButton({ text }: BackButtonProps) {
  return (
    <button
      onClick={() => window.history.back()}
      className="flex items-center gap-3 text-[#0095DA] cursor-pointer"
    >
      <Icon icon="mdi-light:arrow-left" height={20} width={20} />
      <p>{text}</p>
    </button>
  );
}
