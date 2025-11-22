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
  variant?: 'normal' | 'success' | 'warning' | 'error';
};

export default function Button({
  content,
  href,
  onClick,
  icon,
  isSecondary,
  isDisabled,
  isLoading,
  variant = 'normal',
}: ButtonProps) {
  
  // Define variant colors and styles
  const getVariantStyles = () => {
    const variants = {
      normal: {
        primary: 'bg-[#0095DA] text-white hover:bg-[#0081c9] active:bg-[#006bb8]',
        secondary: 'bg-transparent text-[#0095DA] border border-[#0095DA] hover:bg-[#0095DA]/10 active:bg-[#0095DA]/20',
        disabled: 'bg-blue-300 text-white cursor-not-allowed'
      },
      success: {
        primary: 'bg-[#21C788] text-white hover:bg-[#1db574] active:bg-[#19a368]',
        secondary: 'bg-transparent text-[#21C788] border border-[#21C788] hover:bg-[#21C788]/10 active:bg-[#21C788]/20',
        disabled: 'bg-green-300 text-white cursor-not-allowed'
      },
      warning: {
        primary: 'bg-[#FFAC33] text-white hover:bg-[#ff9f1a] active:bg-[#e6900e]',
        secondary: 'bg-transparent text-[#FFAC33] border border-[#FFAC33] hover:bg-[#FFAC33]/10 active:bg-[#FFAC33]/20',
        disabled: 'bg-yellow-300 text-white cursor-not-allowed'
      },
      error: {
        primary: 'bg-[#FF4D4F] text-white hover:bg-[#ff3538] active:bg-[#e6292c]',
        secondary: 'bg-transparent text-[#FF4D4F] border border-[#FF4D4F] hover:bg-[#FF4D4F]/10 active:bg-[#FF4D4F]/20',
        disabled: 'bg-red-300 text-white cursor-not-allowed'
      }
    };

    if (isDisabled) {
      return variants[variant].disabled;
    }
    
    return isSecondary ? variants[variant]?.secondary : variants[variant].primary;
  };

  const classes = `${getVariantStyles()} rounded-[8px] h-[48px] w-full px-1 md:px-2 leading-6 font-medium text-sm md:text-base transition-all duration-200 ease-in-out transform ${
    icon ? "gap-2 flex items-center justify-center" : "flex items-center justify-center"
  } ${
    isDisabled ? '' : 'shadow-sm hover:shadow-md'
  }`;

  const LoadingSpinner = () => (
    <div className="flex justify-center items-center">
      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
    </div>
  );

  const ButtonContent = () => {
    if (isLoading) {
      return <LoadingSpinner />;
    }
    
    return (
      <>
        {icon && <Icon icon={icon} width={20} height={20} />}
        <span>{content}</span>
      </>
    );
  };

  if (href) {
    return (
      <Link href={href} className={isDisabled ? 'pointer-events-none' : ''}>
        <button 
          className={classes}
          disabled={isDisabled}
        >
          <ButtonContent />
        </button>
      </Link>
    );
  }

  return (
    <button 
      onClick={isDisabled ? undefined : onClick} 
      className={classes}
      disabled={isDisabled}
    >
      <ButtonContent />
    </button>
  );
}