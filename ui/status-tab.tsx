"use client";

import { Status, Status2 } from "@/types/table-data";

type StatusProps = {
  status: Status;

  // Optional custom keyword arrays to override defaults
  successKeywords?: string[];
  warningKeywords?: string[];
  errorKeywords?: string[];

  // Custom styling options
  className?: string;
  size?: "sm" | "md" | "lg";
};
type StatusProps2 = {
  status: Status2;

  // Optional custom keyword arrays to override defaults
  successKeywords?: string[];
  warningKeywords?: string[];
  errorKeywords?: string[];

  // Custom styling options
  className?: string;
  size?: "sm" | "md" | "lg";
};

const DEFAULT_SUCCESS_KEYWORDS = [
  "approved", 
  "success", 
  "resolved", 
  "completed", 
  "active", 
  "verified", 
  "confirmed"
];
const DEFAULT_SUCCESS_KEYWORDS2 = [
  "pending", "paid", "failed"
];

const DEFAULT_WARNING_KEYWORDS = [
  "pending", 
  "open", 
  "in progress", 
  "processing", 
  "review", 
  "waiting"
];

const DEFAULT_ERROR_KEYWORDS = [
  "declined", 
  "failed", 
  "rejected", 
  "cancelled", 
  "error", 
  "suspended", 
  "blocked"
];

// Status styling configurations
const statusStyles = {
  success: {
    bg: "bg-[#10B98115]", // Light green background
    text: "text-[#21C788]", // Green text
    border: "border-[#21C788]/20"
  },
  warning: {
    bg: "bg-[#FFAC331A]", // Light orange background
    text: "text-[#FFAC33]", // Orange text
    border: "border-[#FFAC33]/20"
  },
  error: {
    bg: "bg-[#EF444415]", // Light red background
    text: "text-[#EF4444]", // Red text
    border: "border-[#EF4444]/20"
  },
  default: {
    bg: "bg-[#0095DA15]", // Light blue background
    text: "text-[#0095DA]", // Blue text
    border: "border-[#0095DA]/20"
  }
};

// Size configurations
const sizeStyles = {
  sm: "h-6 px-2 text-xs min-w-[70px]",
  md: "h-[28px] px-3 text-xs w-[90px] min-w-[80px]",
  lg: "h-8 px-4 text-sm min-w-[110px]"
};

export default function StatusTab({ 
  status, 
  successKeywords = DEFAULT_SUCCESS_KEYWORDS,
  warningKeywords = DEFAULT_WARNING_KEYWORDS,
  errorKeywords = DEFAULT_ERROR_KEYWORDS,
  className = "",
  size = "md"
}: StatusProps) {
  
  // Determine status type based on keyword arrays
  const getStatusType = (): keyof typeof statusStyles => {
    if (successKeywords.includes(status)) return "success";
    if (warningKeywords.includes(status)) return "warning";  
    if (errorKeywords.includes(status)) return "error";
    return "default";
  };

  const statusType = getStatusType();
  const styles = statusStyles[statusType];
  const sizeStyle = sizeStyles[size];

  return (
    <span
      className={`
        ${sizeStyle}
        ${styles.bg} 
        ${styles.text} 
        rounded-lg 
        flex 
        justify-center 
        items-center 
        transition-all 
        duration-200
        capitalize
        ${className}
      `.replace(/\s+/g, ' ').trim()}
    >
      {status}
    </span>
  );
}
export function StatusTab2({ 
  status, 
  successKeywords = DEFAULT_SUCCESS_KEYWORDS2,
  warningKeywords = DEFAULT_WARNING_KEYWORDS,
  errorKeywords = DEFAULT_ERROR_KEYWORDS,
  className = "",
  size = "md"
}: StatusProps2) {
  
  // Determine status type based on keyword arrays
  const getStatusType = (): keyof typeof statusStyles => {
    if (successKeywords.includes(status)) return "success";
    if (warningKeywords.includes(status)) return "warning";  
    if (errorKeywords.includes(status)) return "error";
    return "default";
  };

  const statusType = getStatusType();
  const styles = statusStyles[statusType];
  const sizeStyle = sizeStyles[size];

  return (
    <span
      className={`
        ${sizeStyle}
        ${styles.bg} 
        ${styles.text} 
        rounded-lg 
        flex 
        justify-center 
        items-center 
        transition-all 
        duration-200
        capitalize
        ${className}
      `.replace(/\s+/g, ' ').trim()}
    >
      {status}
    </span>
  );
}

// Export the keyword arrays so they can be imported and extended elsewhere
export {
  DEFAULT_SUCCESS_KEYWORDS,
  DEFAULT_WARNING_KEYWORDS, 
  DEFAULT_ERROR_KEYWORDS
};