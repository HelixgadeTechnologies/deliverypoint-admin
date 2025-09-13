"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

type LineConfig = {
  key: string;
  label?: string;
  color: string;
  strokeWidth?: number;
  showDots?: boolean;
};

type LineChartProps = {
  data: Record<string, unknown>[];
  lines: LineConfig[];
  xKey: string;
  legend?: boolean;
};

export default function LineChartComponent({
  data,
  lines,
  xKey,
  legend = true,
}: LineChartProps) {
  return (
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
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
                <span className="text-sm text-gray-700 capitalize">{value}</span>
              )}
            />
          )}
          {lines.map((line) => (
            <Line
              key={line.key}
              dataKey={line.key}
              stroke={line.color}
              strokeWidth={line.strokeWidth ?? 2}
              dot={
                line.showDots === false
                  ? false
                  : { fill: line.color, r: 4 }
              }
              activeDot={{ r: 6 }}
              type="linear"
              name={line.label ?? line.key}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
  );
}