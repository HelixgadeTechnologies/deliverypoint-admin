"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

type AreaConfig = {
  key: string;
  label?: string;
  color: string; // base color
  strokeWidth?: number;
};

type AreaChartProps = {
  data: Record<string, unknown>[];
  areas: AreaConfig[];
  xKey: string;
  legend?: boolean;
};

export default function AreaChartComponent({
  data,
  areas,
  xKey,
  legend = true,
}: AreaChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data}>
        <defs>
          {areas.map((area) => (
            <linearGradient
              key={area.key}
              id={`gradient-${area.key}`}
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop
                offset="5%"
                stopColor={area.color}
                stopOpacity={0.4}
              />
              <stop
                offset="95%"
                stopColor={area.color}
                stopOpacity={0}
              />
            </linearGradient>
          ))}
        </defs>

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
          contentStyle={{
            borderRadius: "8px",
            fontSize: "0.875rem",
            textTransform: "capitalize",
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

        {areas.map((area) => (
          <Area
            key={area.key}
            type="monotone"
            dataKey={area.key}
            stroke={area.color}
            strokeWidth={area.strokeWidth ?? 2}
            fillOpacity={1}
            fill={`url(#gradient-${area.key})`}
            name={area.label ?? area.key}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
}
