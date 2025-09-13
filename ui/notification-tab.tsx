"use client";

import { Icon } from "@iconify/react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Heading from "./text-heading";

export default function NotificationsTab() {
    const [isOpen, setIsOpen] = useState(false);

    const handleNotifs = () => {
        setIsOpen(!isOpen)
    }
  return (
    <div className="relative">
      <div className="relative">
        <Icon
          icon={"streamline-ultimate:alert-bell-notification-2"}
          height={32}
          width={32}
          color="#0095DA"
          onClick={handleNotifs}
        />
        <div className="size-[22px] bg-[#0095DA] text-white rounded-full flex justify-center items-center text-xs absolute -top-1 right-0 cursor-pointer">
          3
        </div>
      </div>
      {isOpen && (
        <AnimatePresence>
          <motion.div
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute right-0 top-16 bg-white z-30 rounded-2xl border border-[#E5E5E5] shadow-md h-[400px] w-[388px] p-4 space-y-2.5"
          >
            <Heading heading="Notifications" />
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
