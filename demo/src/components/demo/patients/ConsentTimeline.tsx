"use client";

import { FileX } from "lucide-react";
import consentsData from "@/data/consents.json";
import templatesData from "@/data/templates.json";

interface Consent {
  id: string;
  patient_id: string;
  template_id: string;
  organization_id: string;
  captured_by_user_id: string;
  status: string;
  consent_type: string;
  regulation_type: string;
  granted_at: string;
  expires_at: string | null;
  revoked_at: string | null;
  revoked_by_user_id: string | null;
  revocation_reason: string | null;
  dynamics_record_id: string;
  dynamics_sync_status: string;
  dynamics_synced_at: string | null;
  created_at: string;
  updated_at: string;
}

interface Template {
  id: string;
  organization_id: string;
  name: string;
  consent_type: string;
  regulation_type: string;
}

interface ConsentTimelineProps {
  patientId: string;
}

type ConsentStatus = "active" | "revoked" | "expired" | "pending";
type SyncStatus = "synced" | "pending" | "failed";

const statusColors: Record<ConsentStatus, string> = {
  active: "bg-teal/10 text-teal",
  revoked: "bg-red-500/10 text-red-500",
  expired: "bg-amber-500/10 text-amber-500",
  pending: "bg-blue-500/10 text-blue-500",
};

const statusDotColors: Record<ConsentStatus, string> = {
  active: "bg-teal",
  revoked: "bg-red-500",
  expired: "bg-amber-500",
  pending: "bg-blue-500",
};

const syncDotColors: Record<SyncStatus, string> = {
  synced: "bg-emerald-500",
  pending: "bg-yellow-500",
  failed: "bg-red-500",
};

const syncLabels: Record<SyncStatus, string> = {
  synced: "Synced",
  pending: "Sync Pending",
  failed: "Sync Failed",
};

const consentTypeLabels: Record<string, string> = {
  treatment: "Treatment",
  marketing_email: "Marketing (Email)",
  marketing_sms: "Marketing (SMS)",
  data_sharing: "Data Sharing",
  research: "Research",
};

const regulationTypeLabels: Record<string, string> = {
  hipaa: "HIPAA",
  gdpr: "GDPR",
  tcpa: "TCPA",
};

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getTemplateName(templateId: string): string {
  const template = (templatesData as Template[]).find(
    (t) => t.id === templateId
  );
  return template?.name ?? "Unknown Template";
}

export default function ConsentTimeline({ patientId }: ConsentTimelineProps) {
  const patientConsents = (consentsData as Consent[])
    .filter((c) => c.patient_id === patientId)
    .sort(
      (a, b) =>
        new Date(b.granted_at).getTime() - new Date(a.granted_at).getTime()
    );

  return (
    <div>
      <h3 className="font-serif text-lg text-navy">Consent History</h3>

      {patientConsents.length === 0 ? (
        <div className="mt-8 flex flex-col items-center justify-center py-12 text-slate-400 dark:text-slate-500">
          <FileX className="h-12 w-12" />
          <p className="mt-3 text-sm">No consents recorded</p>
        </div>
      ) : (
        <div className="relative mt-6 ml-4 border-l-2 border-slate-200 pl-6 dark:border-slate-700">
          {patientConsents.map((consent) => {
            const status = consent.status as ConsentStatus;
            const syncStatus =
              consent.dynamics_sync_status as SyncStatus;

            return (
              <div key={consent.id} className="relative pb-8 last:pb-0">
                {/* Timeline dot */}
                <div
                  className={`absolute -left-[calc(1.5rem+5px)] top-1 h-2.5 w-2.5 rounded-full ring-2 ring-white dark:ring-slate-900 ${statusDotColors[status]}`}
                />

                {/* Content */}
                <div className="space-y-2">
                  {/* Status badge and template name */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${statusColors[status]}`}
                    >
                      {status}
                    </span>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                      {getTemplateName(consent.template_id)}
                    </span>
                  </div>

                  {/* Consent type and regulation */}
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <span>
                      {consentTypeLabels[consent.consent_type] ??
                        consent.consent_type}
                    </span>
                    <span className="text-slate-300 dark:text-slate-600">|</span>
                    <span>
                      {regulationTypeLabels[consent.regulation_type] ??
                        consent.regulation_type}
                    </span>
                  </div>

                  {/* Dates */}
                  <div className="space-y-0.5 text-xs text-slate-500 dark:text-slate-400">
                    <p>Granted: {formatDate(consent.granted_at)}</p>
                    {consent.expires_at && (
                      <p>Expires: {formatDate(consent.expires_at)}</p>
                    )}
                  </div>

                  {/* Revocation reason */}
                  {consent.status === "revoked" &&
                    consent.revocation_reason && (
                      <p className="text-xs italic text-red-500/80">
                        {consent.revocation_reason}
                      </p>
                    )}

                  {/* Dynamics sync status */}
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`inline-block h-2 w-2 rounded-full ${syncDotColors[syncStatus] ?? "bg-slate-300"}`}
                    />
                    <span className="text-xs text-slate-400 dark:text-slate-500">
                      Dynamics:{" "}
                      {syncLabels[syncStatus] ?? syncStatus}
                    </span>
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
