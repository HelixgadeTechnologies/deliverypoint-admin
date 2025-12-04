"use client";

import ActivityRow from "@/ui/activity-row";
import AreaChartComponent from "@/ui/area-chart";
import CardComponent from "@/ui/card-wrapper";
import LineChartComponent from "@/ui/line-chart";
import Heading from "@/ui/text-heading";
import DashboardStatCard from "@/ui/stat-card";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@/app/(app)/firebase/config";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy, limit, where } from "firebase/firestore";

export default function Dashboard() {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();

  // State for counts
  const [vendorsCount, setVendorsCount] = useState(0);
  const [ridersCount, setRidersCount] = useState(0);
  const [customersCount, setCustomersCount] = useState(0);
  const [ordersCount, setOrdersCount] = useState(0);
  const [dataLoading, setDataLoading] = useState(true);
  const [orderTrendsData, setOrderTrendsData] = useState<Array<{ name: string; value: number }>>([]);
  const [revenuePayoutData, setRevenuePayoutData] = useState<Array<{ month: string; revenue: number; payouts: number }>>([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [recentActivities, setRecentActivities] = useState<Array<{
    message: string;
    time: string;
    icon: string;
    themeColor: string;
  }>>([]);

  // Check auth on client side only
  useEffect(() => {
    const userSession = typeof window !== "undefined"
      ? sessionStorage.getItem('user')
      : null;

    if (!loading && !user && !userSession) {
      router.push("/login");
    }
  }, [user, loading, router]);

  // Fetch counts from Firestore
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        setDataLoading(true);

        const vendorsRef = collection(db, "vendors");
        const vendorsSnapshot = await getDocs(vendorsRef);
        setVendorsCount(vendorsSnapshot.size);

        const ridersRef = collection(db, "riders");
        const ridersSnapshot = await getDocs(ridersRef);
        setRidersCount(ridersSnapshot.size);

        const usersRef = collection(db, "customers");
        const usersSnapshot = await getDocs(usersRef);
        const customers = usersSnapshot.docs.filter(doc => {
          const data = doc.data();
          return data.accountType === "customer";
        });
        setCustomersCount(customers.length);

      } catch (error) {
        console.error("Error fetching counts:", error);
      } finally {
        setDataLoading(false);
      }
    };

    fetchCounts();
  }, []);

  // Fetch orders data and calculate monthly trends
  useEffect(() => {
    const fetchOrdersData = async () => {
      try {
        // Fetch from orders collection
        const ordersRef = collection(db, "orders");
        const q = query(ordersRef, orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);

        const orders: any[] = [];
        querySnapshot.forEach((doc) => {
          orders.push({
            id: doc.id,
            ...doc.data(),
          });
        });

        setOrdersCount(orders.length);

        // Group orders by month
        const monthlyOrders: Record<string, number> = {};
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        // Initialize all months with 0
        monthNames.forEach(month => {
          monthlyOrders[month] = 0;
        });

        // Count orders per month
        orders.forEach((order: any) => {
          if (order.createdAt) {
            // Handle ISO string format like "2025-11-28T17:06:48.006369"
            let date: Date;

            if (typeof order.createdAt === 'string') {
              // Parse ISO string directly
              date = new Date(order.createdAt);
            } else if (order.createdAt.seconds) {
              // Handle Firestore Timestamp format (fallback)
              date = new Date(order.createdAt.seconds * 1000);
            } else {
              return; // Skip if format is unknown
            }

            // Check if date is valid
            if (!isNaN(date.getTime())) {
              const monthName = monthNames[date.getMonth()];
              monthlyOrders[monthName] = (monthlyOrders[monthName] || 0) + 1;
            }
          }
        });

        // Convert to chart data format
        const chartData = monthNames.map(month => ({
          name: month,
          value: monthlyOrders[month]
        }));

        setOrderTrendsData(chartData);
      } catch (error) {
        console.error("Error fetching orders data:", error);
      }
    };

    fetchOrdersData();
  }, []);

  // Fetch revenue and payout data
  useEffect(() => {
    const fetchRevenuePayoutData = async () => {
      try {
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        // Initialize monthly data
        const monthlyRevenue: Record<string, number> = {};
        const monthlyPayouts: Record<string, number> = {};

        monthNames.forEach(month => {
          monthlyRevenue[month] = 0;
          monthlyPayouts[month] = 0;
        });

        // Fetch orders and calculate revenue from adminFee
        const ordersRef = collection(db, "orders");
        const q = query(
          ordersRef,
          where("deliveryStatus", "==", "delivered")
        );
        const ordersSnapshot = await getDocs(q);

        ordersSnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.createdAt && data.adminFee) {
            let date: Date;

            if (typeof data.createdAt === 'string') {
              date = new Date(data.createdAt);
            } else if (data.createdAt.seconds) {
              date = new Date(data.createdAt.seconds * 1000);
            } else {
              return;
            }

            if (!isNaN(date.getTime()) && date.getFullYear() === selectedYear) {
              const monthName = monthNames[date.getMonth()];
              monthlyRevenue[monthName] += Number(data.adminFee) || 0;
            }
          }
        });

        // Fetch withdrawal requests and calculate payouts from withdrawalAmount
        const withdrawalsRef = collection(db, "withdrawalRequest");
        const q2 = query(
          withdrawalsRef,
          where("status", "==", "Approved")
        );
        const withdrawalsSnapshot = await getDocs(q2);

        withdrawalsSnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.createdAt && data.withdrawalAmount) {
            let date: Date;

            if (typeof data.createdAt === 'string') {
              date = new Date(data.createdAt);
            } else if (data.createdAt.seconds) {
              date = new Date(data.createdAt.seconds * 1000);
            } else {
              return;
            }

            if (!isNaN(date.getTime()) && date.getFullYear() === selectedYear) {
              const monthName = monthNames[date.getMonth()];
              monthlyPayouts[monthName] += Number(data.withdrawalAmount) || 0;
            }
          }
        });

        // Convert to chart data format
        const chartData = monthNames.map(month => ({
          month: month,
          revenue: Math.round(monthlyRevenue[month]),
          payouts: Math.round(monthlyPayouts[month])
        }));

        setRevenuePayoutData(chartData);
      } catch (error) {
        console.error("Error fetching revenue/payout data:", error);
      }
    };

    fetchRevenuePayoutData();
  }, [selectedYear]);

  // Fetch recent activities
  useEffect(() => {
    const fetchRecentActivities = async () => {
      try {
        const activities: Array<{
          message: string;
          timestamp: Date;
          icon: string;
          themeColor: string;
        }> = [];

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

          activities.push({
            message: `New vendor '${data.businessName || data.name || 'Unknown'}' registered`,
            timestamp: createdAt,
            icon: "streamline-plump:store-2",
            themeColor: "#21C788",
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

          const riderName = `${data.fullName || ''}`.trim();
          activities.push({
            message: `Rider ${riderName} joined the platform`,
            timestamp: createdAt,
            icon: "heroicons:user-plus",
            themeColor: "#0095DA",
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
          const status = data.status || 'pending';

          let icon = "mdi-light:clock";
          let themeColor = "#FFAC33";
          let statusText = "is in progress";

          if (status === 'completed' || status === 'delivered') {
            icon = "cil:check-circle";
            themeColor = "#21C788";
            statusText = "completed successfully";
          } else if (status === 'cancelled') {
            icon = "mdi:close-circle-outline";
            themeColor = "#FF4D4F";
            statusText = "was cancelled";
          }

          activities.push({
            message: `Order #${orderId} ${statusText}`,
            timestamp: createdAt,
            icon: icon,
            themeColor: themeColor,
          });
        });

        // Sort all activities by timestamp (most recent first)
        activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

        // Take top 10 activities and format with relative time
        const formattedActivities = activities.slice(0, 10).map(activity => ({
          message: activity.message,
          time: getRelativeTime(activity.timestamp),
          icon: activity.icon,
          themeColor: activity.themeColor,
        }));

        setRecentActivities(formattedActivities);
      } catch (error) {
        console.error("Error fetching recent activities:", error);
      }
    };

    fetchRecentActivities();
  }, []);

  const stats = [
    {
      title: "Vendors",
      amount: dataLoading ? "..." : vendorsCount.toString(),
      percent: 0,
      icon: "streamline-plump:store-2",
      iconBg: "#0095DA",
    },
    {
      title: "Riders",
      amount: dataLoading ? "..." : ridersCount.toString(),
      percent: 0,
      icon: "fluent:vehicle-truck-profile-48-regular",
      iconBg: "#21C788",
    },
    {
      title: "Users",
      amount: dataLoading ? "..." : customersCount.toString(),
      percent: 0,
      icon: "lucide:users",
      iconBg: "#886CE4",
    },
    {
      title: "Orders",
      amount: dataLoading ? "..." : ordersCount.toString(),
      percent: 0,
      icon: "mdi:cart-outline",
      iconBg: "#FFAC33",
    },
  ];

  const lines = [{ key: "value", label: "Orders", color: "#0095DA" }];

  return (
    <section className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardStatCard data={stats} />
      </div>
      <section className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start gap-6">
          <div className="w-full md:w-[65%]">
            <CardComponent>
              <div className="flex justify-between items-start mb-4">
                <Heading
                  heading="Revenue vs Payouts"
                  subtitle="Monthly comparison of revenue and payouts"
                  icon="cil:dollar"
                  iconColor="#0095DA"
                  sm
                />
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {[2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033, 2034, 2035].map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
              <div className="h-80">
                <AreaChartComponent
                  data={revenuePayoutData}
                  xKey="month"
                  areas={[
                    { key: "revenue", label: "Revenue", color: "#3B82F6" },
                    { key: "payouts", label: "Payouts", color: "#38BDF8" },
                  ]}
                />
              </div>
            </CardComponent>
          </div>
          <div className="w-full md:w-[35%]">
            <CardComponent>
              <Heading
                heading="Order Trends"
                subtitle="Monthly order volume"
                icon="fluent-mdl2:trending-12"
                iconColor="#FFAC33"
                sm
              />
              <div className="h-80">
                <LineChartComponent
                  lines={lines}
                  data={orderTrendsData}
                  xKey="name"
                  legend={false}
                />
              </div>
            </CardComponent>
          </div>
        </div>

        <div className="bg-[#FAFAFA] rounded-2xl p-6">
          <Heading
            heading="Recent Activities"
            subtitle="Latest platform updates and events"
            sm
          />
          <div className="h-[380px] overflow-y-auto mt-10 p-4 space-y-10 scrollable">
            <ActivityRow data={recentActivities} />
          </div>
        </div>
      </section>
    </section>
  );
}