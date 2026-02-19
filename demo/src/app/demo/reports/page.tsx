"use client";

import {
  BarChart3,
  Download,
  Calendar,
  FileBarChart,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import { toast } from "@/lib/toast";

const reports = [
  {
    title: "Compliance Summary",
    description:
      "Overview of consent compliance rates across all patients and regulation types",
    icon: ShieldCheck,
    color: "bg-teal/10 text-teal",
    lastGenerated: "Feb 15, 2026",
  },
  {
    title: "Consent Activity Report",
    description:
      "Detailed breakdown of consent captures, revocations, and expirations",
    icon: FileBarChart,
    color: "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400",
    lastGenerated: "Feb 12, 2026",
  },
  {
    title: "Dynamics Sync Report",
    description:
      "Status of bi-directional sync operations with Microsoft Dynamics 365",
    icon: TrendingUp,
    color: "bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400",
    lastGenerated: "Feb 18, 2026",
  },
  {
    title: "Expiring Consents Report",
    description:
      "List of all consents expiring within the next 30, 60, and 90 days",
    icon: Calendar,
    color: "bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400",
    lastGenerated: "Feb 10, 2026",
  },
];

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <p className="text-sm text-slate-500 dark:text-slate-400">
        Generate and download compliance reports
      </p>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {reports.map((report) => {
          const Icon = report.icon;
          return (
            <div
              key={report.title}
              className="rounded-xl border border-slate-200 bg-white p-6 transition-shadow hover:shadow-md dark:border-slate-700 dark:bg-slate-900 dark:hover:shadow-slate-950/50"
            >
              <div className="mb-4 flex items-start justify-between">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-lg ${report.color}`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <button
                  type="button"
                  onClick={() => toast(`${report.title} exported`)}
                  className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  <Download className="h-3.5 w-3.5" />
                  Export
                </button>
              </div>

              <h3 className="mb-1 font-serif text-lg text-navy">
                {report.title}
              </h3>
              <p className="mb-3 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                {report.description}
              </p>

              <div className="flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500">
                <BarChart3 className="h-3.5 w-3.5" />
                Last generated: {report.lastGenerated}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
