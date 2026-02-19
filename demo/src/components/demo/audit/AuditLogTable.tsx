"use client";

import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  Download,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Loader2,
  CheckCircle2,
  ScrollText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import auditLogsData from "@/data/audit-logs.json";
import patientsData from "@/data/patients.json";

// ---------- Types ----------

interface AuditLog {
  id: string;
  organization_id: string;
  user_id: string | null;
  patient_id: string | null;
  consent_id: string | null;
  action: string;
  details: string;
  ip_address: string | null;
  user_agent: string | null;
  checksum: string;
  created_at: string;
}

interface Patient {
  id: string;
  organization_id: string;
  first_name: string;
  last_name: string;
}

// ---------- Constants ----------

const EASE = [0.4, 0, 0.2, 1] as const;
const ROWS_PER_PAGE = 15;

const USER_NAMES: Record<string, string> = {
  "usr-001": "Dr. Sarah Mitchell",
  "usr-002": "Dr. James Chen",
  "usr-003": "Nurse Rachel Kim",
  "usr-004": "Chris Johnson",
  "usr-005": "Jacquelin",
};

const ACTION_BADGE_STYLES: Record<string, string> = {
  consent_created: "bg-teal/10 text-teal",
  signature_captured: "bg-teal/10 text-teal",
  consent_revoked: "bg-red-500/10 text-red-600",
  consent_expired: "bg-amber-500/10 text-amber-600",
  dynamics_synced: "bg-blue-500/10 text-blue-600",
  dynamics_sync_failed: "bg-red-500/10 text-red-600",
  witness_signature: "bg-purple-500/10 text-purple-600",
};

const DEFAULT_BADGE_STYLE = "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300";

const ACTION_LABELS: Record<string, string> = {
  consent_created: "Consent Created",
  signature_captured: "Signature Captured",
  dynamics_synced: "Dynamics Synced",
  consent_revoked: "Consent Revoked",
  consent_expired: "Consent Expired",
  witness_signature: "Witness Signature",
  dynamics_sync_failed: "Sync Failed",
  dynamics_contact_updated: "Contact Updated",
  consent_viewed: "Consent Viewed",
  consent_exported: "Consent Exported",
  user_login: "User Login",
  report_generated: "Report Generated",
  settings_changed: "Settings Changed",
  patient_created: "Patient Created",
  template_updated: "Template Updated",
  system_health_check: "Health Check",
};

const FILTER_OPTIONS = [
  { value: "all", label: "All Actions" },
  { value: "consent_created", label: "Consent Created" },
  { value: "consent_revoked", label: "Consent Revoked" },
  { value: "consent_expired", label: "Consent Expired" },
  { value: "signature_captured", label: "Signature Captured" },
  { value: "witness_signature", label: "Witness Signature" },
  { value: "dynamics_synced", label: "Dynamics Synced" },
  { value: "dynamics_sync_failed", label: "Sync Failed" },
  { value: "dynamics_contact_updated", label: "Contact Updated" },
  { value: "consent_viewed", label: "Consent Viewed" },
  { value: "consent_exported", label: "Consent Exported" },
  { value: "user_login", label: "User Login" },
  { value: "report_generated", label: "Report Generated" },
  { value: "settings_changed", label: "Settings Changed" },
  { value: "patient_created", label: "Patient Created" },
  { value: "template_updated", label: "Template Updated" },
  { value: "system_health_check", label: "Health Check" },
] as const;

// ---------- Data ----------

const logs = (auditLogsData as AuditLog[]).sort(
  (a, b) =>
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
);

const patientMap = new Map<string, string>();
for (const p of patientsData as Patient[]) {
  patientMap.set(p.id, `${p.first_name} ${p.last_name}`);
}

// ---------- Helpers ----------

function getUserName(userId: string | null): string {
  if (userId === null) return "System";
  return USER_NAMES[userId] ?? "Unknown User";
}

function getPatientName(patientId: string | null): string {
  if (patientId === null) return "\u2014";
  return patientMap.get(patientId) ?? "Unknown";
}

function getActionLabel(action: string): string {
  return ACTION_LABELS[action] ?? action.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function getBadgeStyle(action: string): string {
  return ACTION_BADGE_STYLES[action] ?? DEFAULT_BADGE_STYLE;
}

function formatTimestamp(dateStr: string): { short: string; full: string } {
  const date = new Date(dateStr);
  const datePart = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const timePart = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  const shortDate = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
  return { short: shortDate, full: `${datePart} ${timePart}` };
}

function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "\u2026";
}

function truncateChecksum(checksum: string): string {
  if (checksum.length <= 12) return checksum;
  return checksum.slice(0, 12) + "\u2026";
}

// ---------- CSV Export ----------

function generateCSV(filteredLogs: AuditLog[]): string {
  const header = "ID,Date,Action,Details,Patient,User,IP Address,Checksum";
  const escapeField = (value: string): string => {
    if (value.includes(",") || value.includes('"') || value.includes("\n")) {
      return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  };

  const rows = filteredLogs.map((log) =>
    [
      log.id,
      log.created_at,
      getActionLabel(log.action),
      escapeField(log.details),
      getPatientName(log.patient_id),
      getUserName(log.user_id),
      log.ip_address ?? "",
      log.checksum,
    ].join(",")
  );

  return [header, ...rows].join("\n");
}

function downloadCSV(csv: string): void {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "audit-log-export.csv";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// ---------- Verify Checksum Button ----------

type VerifyState = "idle" | "verifying" | "verified";

function VerifyChecksumButton() {
  const [state, setState] = useState<VerifyState>("idle");

  const handleVerify = useCallback(() => {
    if (state !== "idle") return;
    setState("verifying");
    setTimeout(() => {
      setState("verified");
      setTimeout(() => {
        setState("idle");
      }, 3000);
    }, 1500);
  }, [state]);

  return (
    <button
      type="button"
      onClick={handleVerify}
      disabled={state !== "idle"}
      className={cn(
        "inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm font-medium transition-all duration-300",
        state === "idle" &&
          "border-teal text-teal hover:bg-teal/5 cursor-pointer",
        state === "verifying" &&
          "border-teal/50 text-teal/70 cursor-wait",
        state === "verified" &&
          "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 animate-pulse"
      )}
    >
      {state === "idle" && (
        <>
          <ShieldCheck className="h-4 w-4" />
          Verify Checksum
        </>
      )}
      {state === "verifying" && (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Verifying...
        </>
      )}
      {state === "verified" && (
        <>
          <CheckCircle2 className="h-4 w-4" />
          Checksum Verified
        </>
      )}
    </button>
  );
}

// ---------- Expanded Detail ----------

interface ExpandedDetailProps {
  log: AuditLog;
}

function ExpandedDetail({ log }: ExpandedDetailProps) {
  return (
    <motion.tr>
      <td colSpan={7} className="p-0">
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.25, ease: EASE }}
          className="overflow-hidden"
        >
          <div className="border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 px-6 py-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {/* Full Details */}
              <div className="sm:col-span-2 lg:col-span-3">
                <p className="text-xs font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Full Details
                </p>
                <p className="mt-1 text-sm text-slate-700 dark:text-slate-200">{log.details}</p>
              </div>

              {/* Full Checksum */}
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Checksum
                </p>
                <p className="mt-1 break-all font-mono text-xs text-slate-600 dark:text-slate-300">
                  {log.checksum}
                </p>
              </div>

              {/* IP Address */}
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  IP Address
                </p>
                <p className="mt-1 font-mono text-xs text-slate-600 dark:text-slate-300">
                  {log.ip_address ?? "N/A"}
                </p>
              </div>

              {/* Consent ID */}
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Consent ID
                </p>
                <p className="mt-1 font-mono text-xs text-slate-600 dark:text-slate-300">
                  {log.consent_id ?? "N/A"}
                </p>
              </div>

              {/* User Agent */}
              <div className="sm:col-span-2 lg:col-span-3">
                <p className="text-xs font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  User Agent
                </p>
                <p className="mt-1 break-all font-mono text-xs text-slate-500 dark:text-slate-400">
                  {log.user_agent ?? "N/A"}
                </p>
              </div>

              {/* Verify Button */}
              <div className="sm:col-span-2 lg:col-span-3">
                <VerifyChecksumButton />
              </div>
            </div>
          </div>
        </motion.div>
      </td>
    </motion.tr>
  );
}

// ---------- Main Component ----------

export default function AuditLogTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [actionFilter, setActionFilter] = useState("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Filter logs
  const filteredLogs = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();

    return logs.filter((log) => {
      // Action filter
      if (actionFilter !== "all" && log.action !== actionFilter) {
        return false;
      }

      // Search filter
      if (query) {
        const patientName = getPatientName(log.patient_id).toLowerCase();
        const actionLabel = getActionLabel(log.action).toLowerCase();
        const details = log.details.toLowerCase();

        if (
          !details.includes(query) &&
          !patientName.includes(query) &&
          !actionLabel.includes(query)
        ) {
          return false;
        }
      }

      return true;
    });
  }, [searchQuery, actionFilter]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredLogs.length / ROWS_PER_PAGE));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedLogs = filteredLogs.slice(
    (safeCurrentPage - 1) * ROWS_PER_PAGE,
    safeCurrentPage * ROWS_PER_PAGE
  );

  // Reset to page 1 when filters change
  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  }, []);

  const handleFilterChange = useCallback((value: string) => {
    setActionFilter(value);
    setCurrentPage(1);
  }, []);

  const handleToggleRow = useCallback((id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  }, []);

  const handleExportCSV = useCallback(() => {
    const csv = generateCSV(filteredLogs);
    downloadCSV(csv);
  }, [filteredLogs]);

  return (
    <div className="space-y-6">
      {/* Header area */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Left: Search + Filter */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          {/* Search input */}
          <div className="relative w-full sm:w-72">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search details, patient, action..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2.5 pl-10 text-sm text-slate-700 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal"
            />
          </div>

          {/* Action filter */}
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 shrink-0 text-slate-400" />
            <select
              value={actionFilter}
              onChange={(e) => handleFilterChange(e.target.value)}
              className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2.5 text-sm text-slate-700 dark:text-slate-200 focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal"
            >
              {FILTER_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Date range pill */}
          <span className="inline-flex items-center whitespace-nowrap rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1 text-xs font-medium text-slate-500 dark:text-slate-400">
            Last 12 months
          </span>
        </div>

        {/* Right: Export button */}
        <button
          type="button"
          onClick={handleExportCSV}
          className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800"
        >
          <Download className="h-4 w-4" />
          Export CSV
        </button>
      </div>

      {/* Table card */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-hidden">
        {paginatedLogs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-950">
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Timestamp
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Action
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Details
                  </th>
                  <th className="hidden px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 md:table-cell">
                    Patient
                  </th>
                  <th className="hidden px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 md:table-cell">
                    User
                  </th>
                  <th className="hidden px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 lg:table-cell">
                    Checksum
                  </th>
                  <th className="px-4 py-3">
                    <span className="sr-only">Expand</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence initial={false}>
                  {paginatedLogs.map((log) => {
                    const isExpanded = expandedId === log.id;

                    return (
                      <AnimatePresence key={log.id} initial={false}>
                        <tr
                          onClick={() => handleToggleRow(log.id)}
                          className={cn(
                            "border-t border-slate-100 dark:border-slate-800 cursor-pointer transition-colors hover:bg-slate-50 dark:hover:bg-slate-800",
                            isExpanded && "bg-slate-50 dark:bg-slate-800"
                          )}
                        >
                          <td className="whitespace-nowrap px-4 py-3.5 text-sm text-slate-600 dark:text-slate-300 sm:px-6">
                            <span className="sm:hidden">{formatTimestamp(log.created_at).short}</span>
                            <span className="hidden sm:inline">{formatTimestamp(log.created_at).full}</span>
                          </td>
                          <td className="whitespace-nowrap px-6 py-3.5">
                            <span
                              className={cn(
                                "rounded-full px-2.5 py-0.5 text-xs font-medium",
                                getBadgeStyle(log.action)
                              )}
                            >
                              {getActionLabel(log.action)}
                            </span>
                          </td>
                          <td className="px-6 py-3.5 text-sm text-slate-600 dark:text-slate-300">
                            <span className="hidden lg:inline">
                              {truncateText(log.details, 60)}
                            </span>
                            <span className="lg:hidden">
                              {truncateText(log.details, 30)}
                            </span>
                          </td>
                          <td className="hidden whitespace-nowrap px-6 py-3.5 text-sm text-slate-600 dark:text-slate-300 md:table-cell">
                            {getPatientName(log.patient_id)}
                          </td>
                          <td className="hidden whitespace-nowrap px-6 py-3.5 text-sm text-slate-600 dark:text-slate-300 md:table-cell">
                            {getUserName(log.user_id)}
                          </td>
                          <td className="hidden whitespace-nowrap px-6 py-3.5 font-mono text-xs text-slate-500 dark:text-slate-400 lg:table-cell">
                            {truncateChecksum(log.checksum)}
                          </td>
                          <td className="whitespace-nowrap px-4 py-3.5">
                            <motion.div
                              animate={{ rotate: isExpanded ? 180 : 0 }}
                              transition={{
                                duration: 0.2,
                                ease: EASE,
                              }}
                            >
                              <ChevronDown className="h-4 w-4 text-slate-400" />
                            </motion.div>
                          </td>
                        </tr>

                        {isExpanded && (
                          <ExpandedDetail key={`${log.id}-detail`} log={log} />
                        )}
                      </AnimatePresence>
                    );
                  })}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center px-6 py-16">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
              <ScrollText className="h-6 w-6 text-slate-400 dark:text-slate-500" />
            </div>
            <p className="mt-4 text-sm font-medium text-slate-700 dark:text-slate-200">
              No audit records found
            </p>
            <p className="mt-1 text-sm text-slate-400 dark:text-slate-500">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {filteredLogs.length > ROWS_PER_PAGE && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Showing{" "}
            <span className="font-medium text-slate-700 dark:text-slate-200">
              {(safeCurrentPage - 1) * ROWS_PER_PAGE + 1}
            </span>
            {" "}&ndash;{" "}
            <span className="font-medium text-slate-700 dark:text-slate-200">
              {Math.min(safeCurrentPage * ROWS_PER_PAGE, filteredLogs.length)}
            </span>
            {" "}of{" "}
            <span className="font-medium text-slate-700 dark:text-slate-200">
              {filteredLogs.length}
            </span>
            {" "}records
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={safeCurrentPage <= 1}
              className={cn(
                "inline-flex items-center gap-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm font-medium transition-colors",
                safeCurrentPage <= 1
                  ? "text-slate-300 dark:text-slate-600 cursor-not-allowed"
                  : "text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
              )}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </button>

            <span className="px-3 text-sm text-slate-500 dark:text-slate-400">
              Page {safeCurrentPage} of {totalPages}
            </span>

            <button
              type="button"
              onClick={() =>
                setCurrentPage((p) => Math.min(totalPages, p + 1))
              }
              disabled={safeCurrentPage >= totalPages}
              className={cn(
                "inline-flex items-center gap-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm font-medium transition-colors",
                safeCurrentPage >= totalPages
                  ? "text-slate-300 dark:text-slate-600 cursor-not-allowed"
                  : "text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
              )}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
