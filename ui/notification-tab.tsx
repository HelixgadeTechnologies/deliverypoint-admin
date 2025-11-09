"use client";

import { Icon } from "@iconify/react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Simple heading component
const Heading = ({ heading }: { heading: string }) => (
  <h2 className="text-lg font-semibold mb-4">{heading}</h2>
);

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
      message: "Vendor 'Mama's Kitchen' has been approved",
      time: "2 mins ago",
      status: "unread",
    },
    {
      id: 4,
      message: "Rider 'John Smith' has been approved",
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

  const unreadCount = notifs.filter(n => n.status === "unread").length;

  return (
    <div className="relative">
      <div className="relative">
        <Icon
          icon={"streamline-ultimate:alert-bell-notification-2"}
          height={32}
          width={32}
          color="#0095DA"
          onClick={handleNotifs}
          className="cursor-pointer"
        />
        {unreadCount > 0 && (
          <div className="min-w-[22px] h-[22px] px-1 bg-[#0095DA] text-white rounded-full flex justify-center items-center text-xs absolute -top-1 -right-1">
            {unreadCount}
          </div>
        )}
      </div>
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop for mobile */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/20 z-40 md:hidden"
              onClick={handleNotifs}
            />
            
            {/* Notification dropdown */}
            <motion.div
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="fixed md:absolute left-4 right-4 md:left-auto md:right-0 top-20 md:top-16 bg-white z-50 rounded-2xl border border-[#E5E5E5] shadow-lg max-h-[70vh] md:max-h-[500px] md:w-[388px] p-4 flex flex-col"
            >
              <div className="flex items-center justify-between mb-4">
                <Heading heading="Notifications" />
                {/* Close button for mobile */}
                <button
                  onClick={handleNotifs}
                  className="md:hidden p-1 hover:bg-gray-100 rounded-full"
                  aria-label="Close notifications"
                >
                  <Icon icon="mdi:close" width={24} height={24} color="#1F1F1F" />
                </button>
              </div>
              
              {notifs.length === 0 ? (
                <div className="flex justify-center items-center flex-1 py-12">
                  <h2 className="text-gray-500">No notifications yet.</h2>
                </div>
              ) : (
                <div className="space-y-3 overflow-y-auto flex-1 pr-2">
                  {notifs.map((n) => (
                    <div
                      onClick={() => markAsRead(n.id)}
                      key={n.id}
                      className={`flex justify-between items-start gap-3 rounded-[10px] px-3 md:px-4 py-3 cursor-pointer transition-colors ${
                        n.status === "unread" ? "bg-[#0095DA1A]" : "bg-[#F9F9F9]"
                      }`}
                    >
                      {/* message and time */}
                      <div className="flex-1 min-w-0">
                        <p className="text-[#1F1F1F] text-sm leading-relaxed break-words">
                          {n.message}
                        </p>
                        <p className="text-[#7C7979] text-[10px] mt-1">{n.time}</p>
                      </div>

                      {/* indicator */}
                      {n.status === "unread" && (
                        <div className="size-2 rounded-full bg-[#21C788] flex-shrink-0 mt-1.5"></div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}