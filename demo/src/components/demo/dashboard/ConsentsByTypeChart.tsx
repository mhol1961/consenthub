"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import stats from "@/data/dashboard-stats.json";

interface ConsentType {
  type: string;
  count: number;
  color: string;
}

const data: ConsentType[] = stats.consents_by_type;

const total = data.reduce((sum, item) => sum + item.count, 0);

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: ConsentType;
  }>;
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;

  const item = payload[0].payload;
  const percentage = ((item.count / total) * 100).toFixed(1);

  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-lg dark:border-slate-700 dark:bg-slate-900 dark:shadow-slate-950/50">
      <p className="text-sm font-medium text-navy">{item.type}</p>
      <p className="text-sm text-slate-500 dark:text-slate-400">
        {item.count.toLocaleString()} ({percentage}%)
      </p>
    </div>
  );
}

export default function ConsentsByTypeChart() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
      {/* Header */}
      <div className="border-b border-slate-100 px-6 py-4 dark:border-slate-800">
        <h3 className="text-base font-semibold text-navy">Consents by Type</h3>
      </div>

      {/* Chart */}
      <div className="px-6 py-4">
        <div className="relative mx-auto" style={{ width: "100%", height: 220 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                dataKey="count"
                nameKey="type"
                strokeWidth={2}
                stroke="var(--card)"
              >
                {data.map((entry) => (
                  <Cell key={entry.type} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>

          {/* Center label */}
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-navy">
              {total.toLocaleString()}
            </span>
            <span className="text-xs text-slate-400 dark:text-slate-500">Total</span>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-3">
          {data.map((item) => (
            <div key={item.type} className="flex items-center gap-2">
              <span
                className="inline-block h-3 w-3 shrink-0 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="truncate text-xs text-slate-600 dark:text-slate-300">
                {item.type}
              </span>
              <span className="ml-auto text-xs font-medium text-navy">
                {item.count}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
