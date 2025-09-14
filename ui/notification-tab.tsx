"use client";

import { Icon } from "@iconify/react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Heading from "./text-heading";

export default function NotificationsTab() {
  const [isOpen, setIsOpen] = useState(false);

  const handleNotifs = () => {
    setIsOpen(!isOpen);
  };

  const notifications = [
    {
      id: 1,
      message: "New vendor registration pending approval",
      time: "2 mins ago",
      status: "unread",
    },
    {
      id: 2,
      message: "New rider registration pending approval",
      time: "4:00 PM",
      status: "unread",
    },
    {
      id: 3,
      message: "Vendor “Mama’s Kitchen” has been approved",
      time: "2 mins ago",
      status: "unread",
    },
    {
      id: 4,
      message: "Rider “John Smith” has been approved”",
      time: "2 mins ago",
      status: "unread",
    },
  ];

  const [notifs, setNotifs] = useState(notifications);

  const markAsRead = (id: number) => {
    setNotifs((prev) =>
      prev.map((n) => (n.id === id ? { ...n, status: "read" } : n))
    );
  };


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
            className="absolute right-0 top-16 bg-white z-30 rounded-2xl border border-[#E5E5E5] shadow-md h-[400px] w-[388px] p-4"
          >
            <Heading heading="Notifications" />
            {notifications.length === 0 ? (
              <div className="flex justify-center items-center h-[50vh]">
                <h2>No notifications yet.</h2>
              </div>
            ) : (
              <div className="space-y-4 h-full scrollable pr-2.5">
                {notifs.map((n, index) => (
                  <div
                    onClick={() => markAsRead(n.id)}
                    key={index}
                    className={`flex justify-between items-center rounded-[10px] px-4 py-2 cursor-pointer ${
                      n.status === "unread" ? "bg-[#0095DA1A]" : "bg-[#F9F9F9]"
                    }`}
                  >
                    {/* message and time */}
                    <div>
                      <p className="text-[#1F1F1F] text-sm">{n.message}</p>
                      <p className="text-[#7C7979] text-[10px]">{n.time}</p>
                    </div>

                    {/* indicator */}
                    {n.status === "unread" && (
                      <div className="size-2 rounded-full bg-[#21C788]"></div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
