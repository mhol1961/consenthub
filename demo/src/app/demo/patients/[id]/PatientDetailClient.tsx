"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import PatientInfoCard from "@/components/demo/patients/PatientInfoCard";
import ConsentTimeline from "@/components/demo/patients/ConsentTimeline";
import PatientAuditTrail from "@/components/demo/patients/PatientAuditTrail";
import patientsData from "@/data/patients.json";

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

type TabKey = "consents" | "audit" | "preferences";

const tabs: { key: TabKey; label: string }[] = [
  { key: "consents", label: "Consent History" },
  { key: "audit", label: "Audit Trail" },
  { key: "preferences", label: "Preferences" },
] as const;

/* ------------------------------------------------------------------ */
/*  PatientPreferences (inline component)                             */
/* ------------------------------------------------------------------ */

interface PreferenceRow {
  id: string;
  label: string;
  lastUpdated: string;
  defaultValue: boolean;
}

const preferenceRows: PreferenceRow[] = [
  { id: "email_marketing", label: "Email Marketing", lastUpdated: "Jan 15, 2026", defaultValue: true },
  { id: "sms_marketing", label: "SMS Marketing", lastUpdated: "Jan 15, 2026", defaultValue: true },
  { id: "phone_calls", label: "Phone Calls", lastUpdated: "Dec 3, 2025", defaultValue: false },
  { id: "direct_mail", label: "Direct Mail", lastUpdated: "Nov 20, 2025", defaultValue: false },
];

function PatientPreferencesPanel() {
  const [values, setValues] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(preferenceRows.map((r) => [r.id, r.defaultValue]))
  );
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const dismissToast = useCallback(() => setToastMessage(null), []);

  useEffect(() => {
    if (toastMessage === null) return;
    const timer = setTimeout(dismissToast, 3000);
    return () => clearTimeout(timer);
  }, [toastMessage, dismissToast]);

  function handleToggle(id: string) {
    setValues((prev) => ({ ...prev, [id]: !prev[id] }));
    setToastMessage("This is a demo \u2014 changes are not saved");
  }

  return (
    <div className="space-y-4">
      {/* Toast */}
      {toastMessage && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-400">
          {toastMessage}
        </div>
      )}

      {/* Preference rows */}
      {preferenceRows.map((pref) => (
        <div
          key={pref.id}
          className="flex items-center justify-between rounded-lg border border-slate-100 p-4 dark:border-slate-800"
        >
          {/* Label + last updated */}
          <div>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
              {pref.label}
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              Last updated {pref.lastUpdated}
            </p>
          </div>

          {/* Toggle switch */}
          <button
            type="button"
            role="switch"
            aria-checked={values[pref.id]}
            onClick={() => handleToggle(pref.id)}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors ${
              values[pref.id]
                ? "bg-teal"
                : "bg-slate-200 dark:bg-slate-700"
            }`}
          >
            <span
              className={`inline-block h-5 w-5 rounded-full bg-white shadow transition-transform ${
                values[pref.id] ? "translate-x-5" : "translate-x-0.5"
              }`}
              style={{ marginTop: "2px" }}
            />
          </button>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function PatientDetailClient() {
  const params = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<TabKey>("consents");

  const patient = (patientsData as Patient[]).find((p) => p.id === params.id);

  if (!patient) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <h2 className="font-serif text-2xl text-navy">Patient not found</h2>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          The patient record you are looking for does not exist.
        </p>
        <Link
          href="/demo/patients"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-teal px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-teal-dark"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Patients
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back button */}
      <Link
        href="/demo/patients"
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 transition-colors hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Patients
      </Link>

      {/* Page header */}
      <div>
        <h1 className="font-serif text-2xl text-navy sm:text-3xl">
          {patient.first_name} {patient.last_name}
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{patient.external_mrn}</p>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left column — Patient info */}
        <div className="lg:col-span-1">
          <PatientInfoCard patient={patient} />
        </div>

        {/* Right column — Tabs */}
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
            {/* Tab switcher */}
            <div className="flex border-b border-slate-200 dark:border-slate-700">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={`cursor-pointer px-6 py-3 text-sm transition-colors ${
                    activeTab === tab.key
                      ? "border-b-2 border-teal font-semibold text-teal"
                      : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div className="p-6">
              {activeTab === "consents" && (
                <ConsentTimeline patientId={patient.id} />
              )}
              {activeTab === "audit" && (
                <PatientAuditTrail patientId={patient.id} />
              )}
              {activeTab === "preferences" && <PatientPreferencesPanel />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
