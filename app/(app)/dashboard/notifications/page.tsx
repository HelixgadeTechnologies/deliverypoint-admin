"use client";

import { useState, useEffect } from "react";
import { db } from "@/app/(app)/firebase/config";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import Heading from "@/ui/text-heading";
import CardComponent from "@/ui/card-wrapper";

interface Notification {
  id: string;
  message: string;
  time: string;
  status: "read" | "unread";
  timestamp: number;
}

export default function NotificationsPage() {
  const [notifs, setNotifs] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const notifications: Array<{
          id: string;
          message: string;
          timestamp: Date;
        }> = [];

        // Fetch latest vendors (limit to 20)
        const vendorsRef = collection(db, "vendors");
        const vendorsQuery = query(vendorsRef, orderBy("createdAt", "desc"), limit(20));
        const vendorsSnapshot = await getDocs(vendorsQuery);

        vendorsSnapshot.forEach((doc: any) => {
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

        // Fetch latest riders (limit to 20)
        const ridersRef = collection(db, "riders");
        const ridersQuery = query(ridersRef, orderBy("createdAt", "desc"), limit(20));
        const ridersSnapshot = await getDocs(ridersQuery);

        ridersSnapshot.forEach((doc: any) => {
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

        // Fetch latest orders (limit to 20)
        const ordersRef = collection(db, "orders");
        const ordersQuery = query(ordersRef, orderBy("createdAt", "desc"), limit(20));
        const ordersSnapshot = await getDocs(ordersQuery);

        ordersSnapshot.forEach((doc: any) => {
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

        // Take top 50 notifications and format with relative time and read status
        const formattedNotifications: Notification[] = notifications.slice(0, 50).map(notif => ({
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
    setNotifs((prev: any) =>
      prev.map((n: any) => (n.id === id ? { ...n, status: "read" as const } : n))
    );

    const readIds = JSON.parse(localStorage.getItem('readNotifications') || '[]');
    if (!readIds.includes(id)) {
      readIds.push(id);
      localStorage.setItem('readNotifications', JSON.stringify(readIds));
      window.dispatchEvent(new Event('storage'));
    }
  };

  const markAllAsRead = () => {
    const newReadIds = notifs.map(n => n.id);
    const existingReadIds = JSON.parse(localStorage.getItem('readNotifications') || '[]');
    const combinedIds = Array.from(new Set([...existingReadIds, ...newReadIds]));
    
    localStorage.setItem('readNotifications', JSON.stringify(combinedIds));
    window.dispatchEvent(new Event('storage'));
    
    setNotifs((prev: any) => prev.map((n: any) => ({ ...n, status: "read" as const })));
  };

  return (
    <section className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <Heading
          heading="Notifications"
          subtitle="View all your recent alerts and activities"
        />
        {notifs.some(n => n.status === "unread") && (
          <button
            onClick={markAllAsRead}
            className="text-sm text-[#0095DA] hover:underline font-medium"
          >
            Mark all as read
          </button>
        )}
      </div>

      <CardComponent>
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0095DA]"></div>
          </div>
        ) : notifs.length === 0 ? (
          <div className="flex flex-col justify-center items-center py-20 text-gray-500">
            <h3 className="text-lg font-medium mb-2">No notifications found</h3>
            <p className="text-sm">You're all caught up!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifs.map((n) => (
              <div
                onClick={() => markAsRead(n.id)}
                key={n.id}
                className={`flex justify-between items-start gap-4 rounded-xl px-5 py-4 cursor-pointer transition-all border ${
                  n.status === "unread" 
                    ? "bg-[#0095DA]/5 border-[#0095DA]/20 shadow-sm" 
                    : "bg-white border-gray-100 hover:bg-gray-50"
                }`}
              >
                <div className="flex-1 min-w-0">
                  <p className={`text-base leading-relaxed break-words ${
                    n.status === "unread" ? "text-gray-900 font-medium" : "text-gray-600"
                  }`}>
                    {n.message}
                  </p>
                  <p className="text-gray-400 text-xs mt-1.5 font-medium">{n.time}</p>
                </div>

                {n.status === "unread" && (
                  <div className="size-2.5 rounded-full bg-[#0095DA] flex-shrink-0 mt-2 shadow-sm"></div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardComponent>
    </section>
  );
}
