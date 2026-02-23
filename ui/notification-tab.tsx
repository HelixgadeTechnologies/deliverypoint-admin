"use client";

import { Icon } from "@iconify/react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { db } from "@/app/(app)/firebase/config";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";

interface Notification {
  id: string;
  status: "read" | "unread";
}

export default function NotificationsTab() {
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch notifications from Firebase to get unread count
  useEffect(() => {
    const fetchNotificationsCount = async () => {
      try {
        const notifications: Array<{
          id: string;
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

          notifications.push({
            id: `rider-${doc.id}`,
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

          notifications.push({
            id: `order-${doc.id}`,
            timestamp: createdAt,
          });
        });

        // Get read notification IDs from localStorage
        const readIds = JSON.parse(localStorage.getItem('readNotifications') || '[]');

        // Calculate unread
        const unread = notifications.filter(n => !readIds.includes(n.id)).length;

        setUnreadCount(unread);
      } catch (error) {
        console.error("Error fetching notifications count:", error);
      }
    };

    fetchNotificationsCount();
    
    // Set up an interval to refresh count periodically
    const intervalId = setInterval(fetchNotificationsCount, 60000); // refresh every minute
    
    // Also listen for a custom event that can be triggered when notifications are marked read
    const handleStorageChange = () => fetchNotificationsCount();
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      clearInterval(intervalId);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <Link href="/dashboard/notifications" className="relative block">
      <Icon
        icon={"streamline-ultimate:alert-bell-notification-2"}
        height={32}
        width={32}
        color="#0095DA"
        className="cursor-pointer hover:opacity-80 transition-opacity"
      />
      {unreadCount > 0 && (
        <div className="min-w-[22px] h-[22px] px-1 bg-[#0095DA] text-white rounded-full flex justify-center items-center text-xs absolute -top-1 -right-1 shadow-sm font-bold">
          {unreadCount > 99 ? '99+' : unreadCount}
        </div>
      )}
    </Link>
  );
}