"use client";

import {
  CheckCircle,
  XCircle,
  RefreshCw,
  FileBarChart,
  LogIn,
  Eye,
  Download,
  UserPlus,
  Settings,
  Clock,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import activityData from "@/data/activity-feed.json";

type ActionType =
  | "consent_granted"
  | "consent_revoked"
  | "consent_expired"
  | "dynamics_sync"
  | "report_generated"
  | "user_login"
  | "consent_viewed"
  | "consent_exported"
  | "patient_created"
  | "settings_changed";

interface ActivityItem {
  id: string;
  action: string;
  patient_name: string | null;
  user_name: string | null;
  template_name: string | null;
  timestamp: string;
  details: string;
}

const actionColors: Record<ActionType, string> = {
  consent_granted: "text-teal bg-teal/10",
  consent_revoked: "text-red-400 bg-red-400/10",
  consent_expired: "text-amber-500 bg-amber-500/10",
  dynamics_sync: "text-blue-500 bg-blue-500/10",
  report_generated: "text-purple-500 bg-purple-500/10",
  user_login: "text-slate-400 bg-slate-400/10",
  consent_viewed: "text-slate-400 bg-slate-400/10",
  consent_exported: "text-slate-400 bg-slate-400/10",
  patient_created: "text-slate-400 bg-slate-400/10",
  settings_changed: "text-slate-400 bg-slate-400/10",
};

const actionIcons: Record<ActionType, LucideIcon> = {
  consent_granted: CheckCircle,
  consent_revoked: XCircle,
  consent_expired: Clock,
  dynamics_sync: RefreshCw,
  report_generated: FileBarChart,
  user_login: LogIn,
  consent_viewed: Eye,
  consent_exported: Download,
  patient_created: UserPlus,
  settings_changed: Settings,
};

function getRelativeTime(timestamp: string): string {
  const now = new Date();
  const then = new Date(timestamp);
  const diffMs = now.getTime() - then.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin} min ago`;
  if (diffHr < 24) return `${diffHr} hr${diffHr > 1 ? "s" : ""} ago`;
  if (diffDay === 1) return "Yesterday";
  if (diffDay < 7) return `${diffDay} days ago`;
  return then.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function formatDescription(item: ActivityItem): string {
  const action = item.action as ActionType;

  switch (action) {
    case "consent_granted":
      return `${item.user_name} captured ${item.template_name} for ${item.patient_name}`;
    case "consent_revoked":
      if (item.user_name === "System") {
        return `${item.patient_name} revoked ${item.template_name}`;
      }
      return `${item.user_name} revoked ${item.template_name} for ${item.patient_name}`;
    case "consent_expired":
      return `System: Consent expired for ${item.patient_name}`;
    case "dynamics_sync":
      return `Dynamics 365 sync: ${item.details}`;
    case "report_generated":
      return `${item.user_name} generated a report: ${item.details}`;
    case "user_login":
      return `${item.user_name} logged in via ${item.details}`;
    case "consent_viewed":
      return `${item.patient_name} viewed ${item.template_name} via portal`;
    case "consent_exported":
      return `${item.patient_name} exported consent records`;
    case "patient_created":
      return `${item.patient_name}: ${item.details}`;
    case "settings_changed":
      return `${item.user_name}: ${item.details}`;
    default:
      return item.details;
  }
}

export default function ActivityFeed() {
  const items = (activityData as ActivityItem[]).slice(0, 10);

  return (
    <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 dark:border-slate-800">
        <h3 className="text-base font-semibold text-navy">Recent Activity</h3>
      </div>

      {/* Feed items */}
      <div>
        {items.map((item, index) => {
          const action = item.action as ActionType;
          const Icon = actionIcons[action] ?? CheckCircle;
          const colorClasses = actionColors[action] ?? "text-slate-400 bg-slate-400/10";

          return (
            <div
              key={item.id}
              className={cn(
                "flex items-start gap-3 px-6 py-3.5 transition-colors duration-150 hover:bg-slate-100/50 dark:hover:bg-slate-800/50",
                index % 2 === 1 && "bg-slate-50/50 dark:bg-slate-800/30"
              )}
            >
              {/* Icon */}
              <div
                className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${colorClasses}`}
              >
                <Icon className="h-4 w-4" />
              </div>

              {/* Content */}
              <div className="min-w-0 flex-1">
                <p className="text-sm leading-snug text-slate-700 dark:text-slate-200">
                  {formatDescription(item)}
                </p>
                <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">
                  {getRelativeTime(item.timestamp)}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="border-t border-slate-100 px-6 py-3 dark:border-slate-800">
        <button
          type="button"
          className="cursor-pointer text-sm font-medium text-teal transition-colors duration-150 hover:text-teal/80"
        >
          View All
        </button>
      </div>
    </div>
  );
}
