"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  TooltipProps,
} from "recharts";

interface OverviewProps {
  data: { name: string; total: number }[];
}

const GlassmorphismTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<number, string>) => {
  if (active && payload && payload.length && payload[0]?.value !== undefined) {
    return (
      <div
        className="p-3 rounded-xl shadow-xl border border-white/20"
        style={{
          background: "rgba(255, 255, 255, 0.15)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
        }}
      >
        <p className="font-medium text-gray-800 dark:text-gray-300 mb-1">{`${label}`}</p>
        <p className="text-[#60A8FB] dark:text-[#60A8FB] font-semibold">
          {`Total: ${payload[0].value.toLocaleString()}`}
        </p>
      </div>
    );
  }
  return null;
};

export const Overview: React.FC<OverviewProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="#e0e0e0"
          strokeOpacity={0.3}
          horizontal={true}
          vertical={false}
        />
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value}`}
        />
        <Tooltip
          content={<GlassmorphismTooltip />}
          cursor={{
            fill: "rgba(168, 193, 247, 0.1)",
            stroke: "rgba(168, 193, 247, 0.3)",
            strokeWidth: 1,
          }}
          position={{ x: undefined, y: undefined }}
          allowEscapeViewBox={{ x: false, y: true }}
        />
        <Bar
          dataKey="total"
          fill="#60A8FB"
          radius={[4, 4, 0, 0]}
          maxBarSize={80}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};
