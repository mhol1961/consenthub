"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import {
  Users,
  FileCheck,
  Clock,
  ShieldCheck,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import stats from "@/data/dashboard-stats.json";

interface MetricCard {
  label: string;
  value: number;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  suffix?: string;
  decimals?: number;
  trend: string;
  trendType: "up" | "down" | "warning";
}

const metrics: MetricCard[] = [
  {
    label: "Total Patients",
    value: stats.total_patients,
    icon: Users,
    iconBg: "bg-blue-500/10",
    iconColor: "text-blue-500",
    trend: "+12% from last month",
    trendType: "up" as const,
  },
  {
    label: "Active Consents",
    value: stats.active_consents,
    icon: FileCheck,
    iconBg: "bg-teal/10",
    iconColor: "text-teal",
    trend: "+8% from last month",
    trendType: "up" as const,
  },
  {
    label: "Pending Review",
    value: stats.pending_consents,
    icon: Clock,
    iconBg: "bg-amber-500/10",
    iconColor: "text-amber-500",
    trend: "5 expiring this week",
    trendType: "warning" as const,
  },
  {
    label: "Compliance Score",
    value: stats.compliance_rate,
    icon: ShieldCheck,
    iconBg: "bg-emerald-500/10",
    iconColor: "text-emerald-500",
    suffix: "%",
    decimals: 1,
    trend: "Up 2.1% from last month",
    trendType: "up" as const,
  },
];

function AnimatedNumber({
  target,
  duration = 1500,
  suffix = "",
  decimals = 0,
}: {
  target: number;
  duration?: number;
  suffix?: string;
  decimals?: number;
}) {
  const [display, setDisplay] = useState("0");
  const startTimeRef = useRef<number | null>(null);
  const rafRef = useRef<number>(0);

  const animate = useCallback(
    (timestamp: number) => {
      if (startTimeRef.current === null) {
        startTimeRef.current = timestamp;
      }

      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);

      // Ease-out cubic for a smooth deceleration
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = eased * target;

      if (decimals > 0) {
        setDisplay(current.toFixed(decimals));
      } else {
        setDisplay(Math.round(current).toLocaleString());
      }

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    },
    [target, duration, decimals]
  );

  useEffect(() => {
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
    };
  }, [animate]);

  return (
    <>
      {display}
      {suffix}
    </>
  );
}

function SkeletonCard() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
      <div className="flex items-center justify-between">
        <div className="h-11 w-11 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-700" />
      </div>
      <div className="mt-4 h-8 w-24 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700" />
      <div className="mt-2 h-4 w-28 animate-pulse rounded bg-slate-100 dark:bg-slate-800" />
      <div className="mt-3 h-5 w-36 animate-pulse rounded-full bg-slate-100 dark:bg-slate-800" />
    </div>
  );
}

export default function MetricCards() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric) => {
        const Icon = metric.icon;

        return (
          <div
            key={metric.label}
            className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900"
          >
            {/* Top row: icon + trend badge */}
            <div className="flex items-center justify-between">
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${metric.iconBg}`}
              >
                <Icon className={`h-5 w-5 ${metric.iconColor}`} />
              </div>
            </div>

            {/* Large number */}
            <p className="mt-4 text-3xl font-bold text-slate-900 dark:text-slate-100">
              <AnimatedNumber
                target={metric.value}
                suffix={metric.suffix}
                decimals={metric.decimals}
              />
            </p>

            {/* Label */}
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {metric.label}
            </p>

            {/* Trend pill */}
            {metric.trendType === "up" && (
              <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                <TrendingUp className="h-3 w-3" />
                {metric.trend}
              </span>
            )}
            {metric.trendType === "down" && (
              <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-600 dark:bg-red-500/10 dark:text-red-400">
                <TrendingDown className="h-3 w-3" />
                {metric.trend}
              </span>
            )}
            {metric.trendType === "warning" && (
              <span className="mt-2 inline-flex animate-badge-pending items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-600 dark:bg-amber-500/10 dark:text-amber-400">
                <AlertTriangle className="h-3 w-3" />
                {metric.trend}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
