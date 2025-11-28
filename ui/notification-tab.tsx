"use client";

import { Icon } from "@iconify/react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "@/app/(app)/firebase/config";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";

// Simple heading component
const Heading = ({ heading }: { heading: string }) => (
  <h2 className="text-lg font-semibold mb-4">{heading}</h2>
);

interface Notification {
  id: string;
  message: string;
  time: string;
  status: "read" | "unread";
  timestamp: number;
}

export default function NotificationsTab() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifs, setNotifs] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const handleNotifs = () => {
    setIsOpen(!isOpen);
  };

  // Helper function to calculate relative time
  const getRelativeTime = (date: Date): string => {
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / 60000);
    const diffInHours = Math.floor(diffInMs / 3600000);
    const diffInDays = Math.floor(diffInMs / 86400000);

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  };

  // Fetch notifications from Firebase
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const notifications: Array<{
          id: string;
          message: string;
          timestamp: Date;
        }> = [];

        // Fetch latest vendors (limit to 5)
        const vendorsRef = collection(db, "vendors");
        const vendorsQuery = query(vendorsRef, orderBy("createdAt", "desc"), limit(5));
        const vendorsSnapshot = await getDocs(vendorsQuery);

        vendorsSnapshot.forEach((doc) => {
          const data = doc.data();
          let createdAt: Date;

          if (typeof data.createdAt === 'string') {
            createdAt = new Date(data.createdAt);
          } else if (data.createdAt?.seconds) {
            createdAt = new Date(data.createdAt.seconds * 1000);
          } else {
            return;
          }

          notifications.push({
            id: `vendor-${doc.id}`,
            message: `New vendor '${data.businessName || data.name || 'Unknown'}' registered`,
            timestamp: createdAt,
          });
        });

        // Fetch latest riders (limit to 5)
        const ridersRef = collection(db, "riders");
        const ridersQuery = query(ridersRef, orderBy("createdAt", "desc"), limit(5));
        const ridersSnapshot = await getDocs(ridersQuery);

        ridersSnapshot.forEach((doc) => {
          const data = doc.data();
          let createdAt: Date;

          if (typeof data.createdAt === 'string') {
            createdAt = new Date(data.createdAt);
          } else if (data.createdAt?.seconds) {
            createdAt = new Date(data.createdAt.seconds * 1000);
          } else {
            return;
          }

          const riderName = data.fullName || 'Unknown Rider';
          notifications.push({
            id: `rider-${doc.id}`,
            message: `Rider ${riderName} joined the platform`,
            timestamp: createdAt,
          });
        });

        // Fetch latest orders (limit to 5)
        const ordersRef = collection(db, "orders");
        const ordersQuery = query(ordersRef, orderBy("createdAt", "desc"), limit(5));
        const ordersSnapshot = await getDocs(ordersQuery);

        ordersSnapshot.forEach((doc) => {
          const data = doc.data();
          let createdAt: Date;

          if (typeof data.createdAt === 'string') {
            createdAt = new Date(data.createdAt);
          } else if (data.createdAt?.seconds) {
            createdAt = new Date(data.createdAt.seconds * 1000);
          } else {
            return;
          }

          const orderId = data.orderId || doc.id.substring(0, 8);
          notifications.push({
            id: `order-${doc.id}`,
            message: `New order #${orderId} placed`,
            timestamp: createdAt,
          });
        });

        // Sort all notifications by timestamp (most recent first)
        notifications.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

        // Get read notification IDs from localStorage
        const readIds = JSON.parse(localStorage.getItem('readNotifications') || '[]');

        // Take top 10 notifications and format with relative time and read status
        const formattedNotifications: Notification[] = notifications.slice(0, 10).map(notif => ({
          id: notif.id,
          message: notif.message,
          time: getRelativeTime(notif.timestamp),
          status: readIds.includes(notif.id) ? 'read' : 'unread',
          timestamp: notif.timestamp.getTime(),
        }));

        setNotifs(formattedNotifications);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const markAsRead = (id: string) => {
    setNotifs((prev) =>
      prev.map((n) => (n.id === id ? { ...n, status: "read" as const } : n))
    );

    // Save to localStorage
    const readIds = JSON.parse(localStorage.getItem('readNotifications') || '[]');
    if (!readIds.includes(id)) {
      readIds.push(id);
      localStorage.setItem('readNotifications', JSON.stringify(readIds));
    }
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

              {loading ? (
                <div className="flex justify-center items-center flex-1 py-12">
                  <h2 className="text-gray-500">Loading notifications...</h2>
                </div>
              ) : notifs.length === 0 ? (
                <div className="flex justify-center items-center flex-1 py-12">
                  <h2 className="text-gray-500">No notifications yet.</h2>
                </div>
              ) : (
                <div className="space-y-3 overflow-y-auto flex-1 pr-2">
                  {notifs.map((n) => (
                    <div
                      onClick={() => markAsRead(n.id)}
                      key={n.id}
                      className={`flex justify-between items-start gap-3 rounded-[10px] px-3 md:px-4 py-3 cursor-pointer transition-colors ${n.status === "unread" ? "bg-[#0095DA1A]" : "bg-[#F9F9F9]"
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