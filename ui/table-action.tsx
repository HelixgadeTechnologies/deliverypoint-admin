"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { MouseEventHandler } from "react";

type Props = {
  href?: string;
  onClick?: MouseEventHandler<HTMLDivElement>;
};

export default function ViewDetails({ href, onClick }: Props) {
  if (href) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -10, opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="absolute top-3/5 mt-2 right-10 bg-white z-30 rounded-[6px] shadow-md w-[150px] text-sm"
        >
          <Link
            href={href}
            className="cursor-pointer hover:text-blue-600 flex gap-2 p-3 items-center"
          >
            <Icon icon="fluent-mdl2:view" height={16} width={16} />
            View Details
          </Link>
        </motion.div>
      </AnimatePresence>
    );
  }

  if (onClick) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -10, opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="absolute top-3/5 mt-2 right-10 bg-white z-30 rounded-[6px] shadow-md w-[150px] text-sm"
        >
          <div
            onClick={onClick}
            className="cursor-pointer hover:text-blue-600 flex gap-2 p-3 items-center"
          >
            <Icon icon="fluent-mdl2:view" height={16} width={16} />
            View Details
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }

  // Fallback if neither is provided
  return null;
}
