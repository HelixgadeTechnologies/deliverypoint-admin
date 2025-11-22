"use client";

import { recentActivities } from "@/lib/config/demo-data/recent-activities";
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
import { collection, getDocs } from "firebase/firestore";

export default function Dashboard() {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();

  // State for counts
  const [vendorsCount, setVendorsCount] = useState(0);
  const [ridersCount, setRidersCount] = useState(0);
  const [customersCount, setCustomersCount] = useState(0);
  const [dataLoading, setDataLoading] = useState(true);

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
      amount: "0",
      percent: 0,
      icon: "mdi:cart-outline",
      iconBg: "#FFAC33",
    },
  ];

  const lines = [{ key: "value", label: "Month", color: "#0095DA" }];

  const orderTrendsData = [
    { name: "Jan", value: 1200 },
    { name: "Feb", value: 1500 },
    { name: "Mar", value: 1400 },
    { name: "Apr", value: 1800 },
    { name: "May", value: 1500 },
    { name: "Jun", value: 1900 },
  ];

  const revenuePayoutData = [
    { month: "Jan", revenue: 40000, payouts: 25000 },
    { month: "Feb", revenue: 50000, payouts: 30000 },
    { month: "Mar", revenue: 48000, payouts: 28000 },
    { month: "Apr", revenue: 60000, payouts: 35000 },
    { month: "May", revenue: 58000, payouts: 36000 },
    { month: "Jun", revenue: 70000, payouts: 42000 },
  ];

  return (
    <section className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardStatCard data={stats} />
      </div>
      <section className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start gap-6">
          <div className="w-full md:w-[65%]">
            <CardComponent>
              <Heading
                heading="Revenue vs Payouts"
                subtitle="Monthly comparison of revenue and payouts"
                icon="cil:dollar"
                iconColor="#0095DA"
                sm
              />
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