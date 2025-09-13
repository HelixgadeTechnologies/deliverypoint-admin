import DashboardComponent from "@/components/dashboard/dashboard-component";
import DashboardStatCard from "@/ui/stat-card";

export const metadata = {
  title: "Dashboard - Delivery Point | Admin",
};

export default function Dashboard() {
  const stats = [
    {
      user: "Vendors",
      amount: "1,247",
      percent: 12,
      icon: "streamline-plump:store-2",
      iconBg: "#0095DA",
    },
    {
      user: "Riders",
      amount: "892",
      percent: 8,
      icon: "fluent:vehicle-truck-profile-48-regular",
      iconBg: "#21C788",
    },
    {
      user: "Users",
      amount: "15,432",
      percent: 24,
      icon: "mdi:account-multiple-outline",
      iconBg: "#886CE4",
    },
    {
      user: "Orders",
      amount: "3,891",
      percent: 18,
      icon: "mdi:cart-outline",
      iconBg: "#FFAC33",
    },
  ];

  return (
    <section className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <DashboardStatCard data={stats} />
        </div>
        <DashboardComponent/>
    </section>
  )
}
