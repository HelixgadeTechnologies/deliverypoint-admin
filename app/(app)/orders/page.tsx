"use client";

import { orderStats } from "@/lib/config/demo-data/orders";
import DashboardStatCard from "@/ui/stat-card";

export default function Orders() {
  return (
    <section className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <DashboardStatCard data={orderStats} />
      </div>
    </section>
  );
}
