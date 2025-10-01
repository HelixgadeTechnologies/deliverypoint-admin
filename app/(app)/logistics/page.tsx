"use client";

import { logisticsStats } from "@/lib/config/demo-data/logistics";
import DashboardStatCard from "@/ui/stat-card";

export default function Logistics() {
  return (
    <section className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <DashboardStatCard data={logisticsStats} />
      </div>
    </section>
  );
}
