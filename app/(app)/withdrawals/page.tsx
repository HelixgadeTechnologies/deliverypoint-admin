import InfoAlert from "@/ui/info-alert";
import DashboardStatCard from "@/ui/stat-card";

export default function Withdrawals() {
  const stats = [
    {
      title: "Total Vendor Earnings",
      amount: "0",
      icon: "streamline-plump:store-2",
      iconBg: "#0095DA",
      currency: true,
    },
    {
      title: "Total Rider Earnings",
      amount: "0",
      icon: "clarity:bicycle-line",
      iconBg: "#21C788",
      currency: true,
    },
    {
      title: "Completed withdrawals",
      amount: "0",
      icon: "lsicon:motorcycle-outline",
      iconBg: "#FFAC33",
    },
    {
      title: "Pending Withdrawals",
      amount: "0",
      icon: "streamline:transfer-van",
      iconBg: "#FF4D4F",
    },
  ];
  return (
    <section className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <DashboardStatCard data={stats} />
      </div>
      <InfoAlert
        icon="si:warning-line"
        text="All earnings are credited to the user's wallet. Withdrawals require
                admin approval before funds are sent to their bank account."
      />
      {/* <SupportTable/> */}
    </section>
  );
}
