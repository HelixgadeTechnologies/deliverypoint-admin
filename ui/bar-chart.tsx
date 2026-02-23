"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

type BarConfig = {
  key: string;
  label?: string;
  color: string;
  strokeWidth?: number;
};

type BarChartProps = {
  data: Record<string, unknown>[];
  bars: BarConfig[];
  xKey: string;
  legend?: boolean;
};

export default function BarChartComponent({
  data,
  bars,
  xKey,
  legend = true,
}: BarChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid
          strokeDasharray="3 3"
          vertical={false}
          stroke="#E5E7EB"
        />
        <XAxis
          dataKey={xKey}
          tick={{ fill: "#6B7280", fontSize: 12 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: "#6B7280", fontSize: 12 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          cursor={{ fill: "transparent" }}
          contentStyle={{
            borderRadius: "8px",
            fontSize: "0.875rem",
            textTransform: "capitalize",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            border: "none"
          }}
          labelStyle={{ fontWeight: "bold", color: "#374151" }}
        />
        {legend && (
          <Legend
            verticalAlign="top"
            align="right"
            iconType="circle"
            iconSize={10}
            formatter={(value) => (
              <span className="text-sm text-gray-700 capitalize">
                {value}
              </span>
            )}
          />
        )}

        {bars.map((bar) => (
          <Bar
            key={bar.key}
            dataKey={bar.key}
            fill={bar.color}
            name={bar.label ?? bar.key}
            radius={[4, 4, 0, 0]}
            barSize={30}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}
