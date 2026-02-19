"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import stats from "@/data/dashboard-stats.json";

interface MonthlyData {
  month: string;
  consents: number;
  revocations: number;
  expired: number;
}

const data: MonthlyData[] = stats.monthly_trend;

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    color: string;
    name: string;
    value: number;
  }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-lg dark:border-slate-700 dark:bg-slate-900 dark:shadow-slate-950/50">
      <p className="mb-1 text-sm font-medium text-navy">{label}</p>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center gap-2 text-sm">
          <span
            className="inline-block h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-slate-500 dark:text-slate-400">{entry.name}:</span>
          <span className="font-medium text-navy">{entry.value}</span>
        </div>
      ))}
    </div>
  );
}

interface CustomLegendProps {
  payload?: Array<{
    color: string;
    value: string;
  }>;
}

function CustomLegend({ payload }: CustomLegendProps) {
  if (!payload) return null;

  return (
    <div className="flex items-center justify-center gap-6 pt-2">
      {payload.map((entry) => (
        <div key={entry.value} className="flex items-center gap-2">
          <span
            className="inline-block h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-xs text-slate-500 dark:text-slate-400">{entry.value}</span>
        </div>
      ))}
    </div>
  );
}

export default function MonthlyTrendChart() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
      {/* Header */}
      <div className="border-b border-slate-100 px-6 py-4 dark:border-slate-800">
        <h3 className="text-base font-semibold text-navy">Monthly Trend</h3>
      </div>

      {/* Chart */}
      <div className="px-6 py-4">
        <ResponsiveContainer width="100%" height={280}>
          <LineChart
            data={data}
            margin={{ top: 5, right: 10, left: -10, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="4 4"
              stroke="#E2E8F0"
              vertical={false}
            />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 12, fill: "#94A3B8" }}
              tickLine={false}
              axisLine={{ stroke: "#E2E8F0" }}
              tickFormatter={(value: string) => {
                return value.split(" ")[0].substring(0, 3);
              }}
            />
            <YAxis
              tick={{ fontSize: 12, fill: "#94A3B8" }}
              tickLine={false}
              axisLine={false}
              width={40}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend content={<CustomLegend />} />
            <Line
              type="monotone"
              dataKey="consents"
              name="Consents"
              stroke="#0D9488"
              strokeWidth={2.5}
              dot={{ r: 4, fill: "#0D9488", strokeWidth: 2, stroke: "#fff" }}
              activeDot={{ r: 6, fill: "#0D9488", strokeWidth: 2, stroke: "#fff" }}
            />
            <Line
              type="monotone"
              dataKey="revocations"
              name="Revocations"
              stroke="#EF4444"
              strokeWidth={2.5}
              dot={{ r: 4, fill: "#EF4444", strokeWidth: 2, stroke: "#fff" }}
              activeDot={{ r: 6, fill: "#EF4444", strokeWidth: 2, stroke: "#fff" }}
            />
            <Line
              type="monotone"
              dataKey="expired"
              name="Expired"
              stroke="#F59E0B"
              strokeWidth={2}
              strokeDasharray="6 3"
              dot={{ r: 4, fill: "#F59E0B", strokeWidth: 2, stroke: "#fff" }}
              activeDot={{ r: 6, fill: "#F59E0B", strokeWidth: 2, stroke: "#fff" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
