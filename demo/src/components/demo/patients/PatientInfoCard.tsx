"use client";

import Link from "next/link";
import {
  Mail,
  Phone,
  Calendar,
  Hash,
  Globe,
  MessageSquare,
  FileSignature,
  Link2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface PatientPreferences {
  language: string;
  contact_method: string;
}

interface Patient {
  id: string;
  organization_id: string;
  dynamics_contact_id: string;
  email: string;
  phone: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  external_mrn: string;
  preferences: PatientPreferences;
  created_at: string;
  updated_at: string;
}

interface PatientInfoCardProps {
  patient: Patient;
}

const languageNames: Record<string, string> = {
  en: "English",
  es: "Spanish",
  fr: "French",
  de: "German",
  pt: "Portuguese",
  zh: "Chinese",
  ja: "Japanese",
  ko: "Korean",
};

const contactMethodLabels: Record<string, string> = {
  email: "Email",
  phone: "Phone",
  sms: "SMS",
  mail: "Mail",
};

function formatDateOfBirth(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

interface InfoItemProps {
  icon: LucideIcon;
  label: string;
  value: string;
  muted?: boolean;
}

function InfoItem({ icon: Icon, label, value, muted }: InfoItemProps) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">
        {label}
      </p>
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 shrink-0 text-slate-400 dark:text-slate-500" />
        <p
          className={
            muted
              ? "text-xs text-slate-400 dark:text-slate-500"
              : "text-sm text-slate-700 dark:text-slate-200"
          }
        >
          {value}
        </p>
      </div>
    </div>
  );
}

export default function PatientInfoCard({ patient }: PatientInfoCardProps) {
  const languageDisplay =
    languageNames[patient.preferences.language] ??
    patient.preferences.language;

  const contactMethodDisplay =
    contactMethodLabels[patient.preferences.contact_method] ??
    patient.preferences.contact_method;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
      {/* Avatar */}
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-teal text-xl font-semibold text-white">
        {patient.first_name[0]}
        {patient.last_name[0]}
      </div>

      {/* Patient name */}
      <h2 className="mt-4 font-serif text-2xl text-navy">
        {patient.first_name} {patient.last_name}
      </h2>

      {/* Info grid */}
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <InfoItem icon={Mail} label="Email" value={patient.email} />
        <InfoItem icon={Phone} label="Phone" value={patient.phone} />
        <InfoItem
          icon={Calendar}
          label="Date of Birth"
          value={formatDateOfBirth(patient.date_of_birth)}
        />
        <InfoItem icon={Hash} label="MRN" value={patient.external_mrn} />
        <InfoItem
          icon={Link2}
          label="Dynamics Contact ID"
          value={patient.dynamics_contact_id}
          muted
        />
        <InfoItem icon={Globe} label="Language" value={languageDisplay} />
        <InfoItem
          icon={MessageSquare}
          label="Preferred Contact"
          value={contactMethodDisplay}
        />
      </div>

      {/* Request Consent button */}
      <div className="mt-6">
        <Link
          href="/demo/consent"
          className="inline-flex items-center gap-2 rounded-lg bg-teal px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-teal-dark"
        >
          <FileSignature className="h-4 w-4" />
          Request Consent
        </Link>
      </div>
    </div>
  );
}
