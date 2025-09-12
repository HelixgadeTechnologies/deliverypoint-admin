"use client";

import Link from "next/link";
import { Icon } from "@iconify/react";

type ButtonProps = {
  content: string;
  href?: string;
  onClick?: () => void;
  isSecondary?: boolean;
  icon?: string;
  isDisabled?: boolean;
  isLoading?: boolean;
};

export default function Button({
  content,
  href,
  onClick,
  icon,
  isSecondary,
  isDisabled,
  isLoading,
}: ButtonProps) {
  const classes = `${
    isDisabled
      ? "cursor-not-allowed bg-blue-400 text-white"
      : isSecondary
      ? "cursor-pointer bg-transparent text-[#0095DA] border border-[#0095DA] hover:bg-blue-100"
      : "cursor-pointer bg-[#0095DA] text-white hover:bg-blue-500"
  } rounded-[8px] h-[48px] w-full px-1 md:px-2 leading-6 font-medium text-sm md:text-base block transition-colors duration-300 ${
    icon && "gap-2 flex items-center justify-center z-10"
  }`;

  if (href) {
    return (
      <Link href={href}>
        <button className={classes}>
          {isLoading ? (
            <div className="flex justify-center items-center">
              <div className="dots-white">
                <div></div>
                <div></div>
                <div></div>
              </div>
            </div>
          ) : (
            <>
              {icon && <Icon icon={icon} width={20} height={20} />}
              {content}
            </>
          )}
        </button>
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={classes}>
      {isLoading ? (
        <div className="flex justify-center items-center">
          <div className="dots-white">
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      ) : (
        <>
          {icon && <Icon icon={icon} width={20} height={20} />}
          {content}
        </>
      )}
    </button>
  );
}