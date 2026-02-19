"use client";

import {
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  UserCheck,
  Eye,
  Download,
  AlertTriangle,
  ScrollText,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import auditLogsData from "@/data/audit-logs.json";

interface AuditLog {
  id: string;
  organization_id: string;
  user_id: string | null;
  patient_id: string | null;
  consent_id: string | null;
  action: string;
  details: string;
  ip_address: string | null;
  user_agent: string;
  checksum: string;
  created_at: string;
}

interface PatientAuditTrailProps {
  patientId: string;
}

type AuditAction =
  | "consent_created"
  | "consent_revoked"
  | "consent_expired"
  | "dynamics_synced"
  | "witness_signature"
  | "consent_viewed"
  | "consent_exported"
  | "dynamics_sync_failed"
  | "dynamics_contact_updated"
  | "signature_captured";

const actionIcons: Record<AuditAction, LucideIcon> = {
  consent_created: CheckCircle,
  consent_revoked: XCircle,
  consent_expired: Clock,
  dynamics_synced: RefreshCw,
  witness_signature: UserCheck,
  consent_viewed: Eye,
  consent_exported: Download,
  dynamics_sync_failed: AlertTriangle,
  dynamics_contact_updated: RefreshCw,
  signature_captured: CheckCircle,
};

const actionColors: Record<AuditAction, string> = {
  consent_created: "text-teal bg-teal/10",
  consent_revoked: "text-red-500 bg-red-500/10",
  consent_expired: "text-amber-500 bg-amber-500/10",
  dynamics_synced: "text-blue-500 bg-blue-500/10",
  witness_signature: "text-purple-500 bg-purple-500/10",
  consent_viewed: "text-slate-500 bg-slate-500/10",
  consent_exported: "text-slate-500 bg-slate-500/10",
  dynamics_sync_failed: "text-red-500 bg-red-500/10",
  dynamics_contact_updated: "text-blue-500 bg-blue-500/10",
  signature_captured: "text-teal bg-teal/10",
};

const userNames: Record<string, string> = {
  "usr-001": "Dr. Sarah Mitchell",
  "usr-002": "Dr. James Chen",
  "usr-003": "Nurse Rachel Kim",
  "usr-004": "Chris Johnson",
  "usr-005": "Jacquelin",
};

function formatTimestamp(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }) +
    " at " +
    date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
}

function getUserName(userId: string | null): string {
  if (userId === null) return "System";
  return userNames[userId] ?? "Unknown User";
}

export default function PatientAuditTrail({
  patientId,
}: PatientAuditTrailProps) {
  const patientLogs = (auditLogsData as AuditLog[])
    .filter((log) => log.patient_id === patientId)
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

  return (
    <div>
      <h3 className="font-serif text-lg text-navy">Audit Trail</h3>

      {patientLogs.length === 0 ? (
        <div className="mt-8 flex flex-col items-center justify-center py-12 text-slate-400 dark:text-slate-500">
          <ScrollText className="h-12 w-12" />
          <p className="mt-3 text-sm">No audit records</p>
        </div>
      ) : (
        <div className="mt-6 space-y-1">
          {patientLogs.map((log) => {
            const action = log.action as AuditAction;
            const Icon = actionIcons[action] ?? CheckCircle;
            const colorClasses =
              actionColors[action] ?? "text-slate-400 bg-slate-400/10";

            return (
              <div
                key={log.id}
                className="flex items-start gap-3 rounded-lg px-3 py-3 transition-colors duration-150 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                {/* Action icon */}
                <div
                  className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${colorClasses}`}
                >
                  <Icon className="h-4 w-4" />
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <p className="text-sm leading-snug text-slate-700 dark:text-slate-200">
                    {log.details}
                  </p>
                  <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5">
                    <p className="text-xs text-slate-400 dark:text-slate-500">
                      {formatTimestamp(log.created_at)}
                    </p>
                    <p className="text-xs text-slate-400 dark:text-slate-500">
                      {getUserName(log.user_id)}
                    </p>
                    {log.ip_address && (
                      <p className="text-xs text-slate-300 dark:text-slate-600">
                        {log.ip_address}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
