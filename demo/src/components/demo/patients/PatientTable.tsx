"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, ChevronRight, Users, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import patientsData from "@/data/patients.json";
import consentsData from "@/data/consents.json";

// ---------- Types ----------

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

interface Consent {
  id: string;
  patient_id: string;
  template_id: string;
  organization_id: string;
  captured_by_user_id: string;
  status: "active" | "revoked" | "expired" | "pending";
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

type StatusFilter = "all" | "active" | "expired" | "none";
type ConsentTypeFilter = "all" | "hipaa" | "gdpr" | "research";
type TimeRangeFilter = "all" | "30" | "60" | "90";

// ---------- Helpers ----------

const patients = patientsData as Patient[];
const consents = consentsData as Consent[];

const ITEMS_PER_PAGE = 10;

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// ---------- Pre-compute consent maps ----------

interface PatientConsentInfo {
  activeCount: number;
  expiredCount: number;
  totalCount: number;
  hasActive: boolean;
  hasExpired: boolean;
  lastGrantedAt: string | null;
  regulationTypes: Set<string>;
  consentTypes: Set<string>;
}

function buildConsentMap(): Map<string, PatientConsentInfo> {
  const map = new Map<string, PatientConsentInfo>();

  for (const consent of consents) {
    const existing = map.get(consent.patient_id) ?? {
      activeCount: 0,
      expiredCount: 0,
      totalCount: 0,
      hasActive: false,
      hasExpired: false,
      lastGrantedAt: null,
      regulationTypes: new Set<string>(),
      consentTypes: new Set<string>(),
    };

    existing.totalCount += 1;

    if (consent.status === "active") {
      existing.activeCount += 1;
      existing.hasActive = true;
    }

    if (consent.status === "expired") {
      existing.expiredCount += 1;
      existing.hasExpired = true;
    }

    existing.regulationTypes.add(consent.regulation_type);
    existing.consentTypes.add(consent.consent_type);

    if (
      !existing.lastGrantedAt ||
      new Date(consent.granted_at) > new Date(existing.lastGrantedAt)
    ) {
      existing.lastGrantedAt = consent.granted_at;
    }

    map.set(consent.patient_id, existing);
  }

  return map;
}

const consentMap = buildConsentMap();

// ---------- Status badge ----------

function getPatientStatus(patientId: string): "active" | "expired" | "none" {
  const info = consentMap.get(patientId);
  if (!info || info.totalCount === 0) return "none";
  if (info.hasActive) return "active";
  if (info.hasExpired) return "expired";
  return "none";
}

function StatusBadge({ status }: { status: "active" | "expired" | "none" }) {
  const badgeBase = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium";

  switch (status) {
    case "active":
      return (
        <span className={cn(badgeBase, "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400")}>
          Active
        </span>
      );
    case "expired":
      return (
        <span className={cn(badgeBase, "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400")}>
          Expired
        </span>
      );
    case "none":
      return (
        <span className={cn(badgeBase, "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400")}>
          None
        </span>
      );
  }
}

// ---------- Skeleton ----------

function SkeletonRow() {
  return (
    <tr>
      <td className="whitespace-nowrap px-6 py-4"><div className="h-4 w-32 animate-pulse rounded bg-slate-200 dark:bg-slate-700" /></td>
      <td className="whitespace-nowrap px-6 py-4"><div className="h-4 w-40 animate-pulse rounded bg-slate-100 dark:bg-slate-800" /></td>
      <td className="whitespace-nowrap px-6 py-4"><div className="h-4 w-24 animate-pulse rounded bg-slate-100 dark:bg-slate-800" /></td>
      <td className="whitespace-nowrap px-6 py-4"><div className="h-5 w-16 animate-pulse rounded-full bg-slate-100 dark:bg-slate-800" /></td>
      <td className="whitespace-nowrap px-6 py-4"><div className="h-4 w-28 animate-pulse rounded bg-slate-100 dark:bg-slate-800" /></td>
      <td className="whitespace-nowrap px-4 py-4"><div className="h-4 w-4 animate-pulse rounded bg-slate-100 dark:bg-slate-800" /></td>
    </tr>
  );
}

function SkeletonMobileCard() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
      <div className="flex items-start justify-between">
        <div>
          <div className="h-4 w-32 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
          <div className="mt-1.5 h-3 w-24 animate-pulse rounded bg-slate-100 dark:bg-slate-800" />
        </div>
        <div className="h-5 w-16 animate-pulse rounded-full bg-slate-100 dark:bg-slate-800" />
      </div>
      <div className="mt-2 space-y-1.5">
        <div className="h-4 w-44 animate-pulse rounded bg-slate-100 dark:bg-slate-800" />
        <div className="h-3 w-32 animate-pulse rounded bg-slate-100 dark:bg-slate-800" />
      </div>
    </div>
  );
}

// ---------- Main component ----------

export default function PatientTable() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [consentTypeFilter, setConsentTypeFilter] = useState<ConsentTypeFilter>("all");
  const [timeRangeFilter, setTimeRangeFilter] = useState<TimeRangeFilter>("all");
  const [currentPage, setCurrentPage] = useState(1);

  // Simulate initial data load
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  // Reset to page 1 when search/filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, consentTypeFilter, timeRangeFilter]);

  const filteredPatients = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();

    return patients.filter((patient) => {
      // Text search filter
      if (query) {
        const searchableFields = [
          patient.first_name,
          patient.last_name,
          `${patient.first_name} ${patient.last_name}`,
          patient.email,
          patient.external_mrn,
        ];
        const matches = searchableFields.some((field) =>
          field.toLowerCase().includes(query)
        );
        if (!matches) return false;
      }

      // Status filter
      if (statusFilter !== "all") {
        const patientStatus = getPatientStatus(patient.id);
        switch (statusFilter) {
          case "active":
            if (patientStatus !== "active") return false;
            break;
          case "expired":
            if (patientStatus !== "expired") return false;
            break;
          case "none":
            if (patientStatus !== "none") return false;
            break;
        }
      }

      // Consent type filter
      if (consentTypeFilter !== "all") {
        const info = consentMap.get(patient.id);
        if (!info) return false;

        switch (consentTypeFilter) {
          case "hipaa":
            if (!info.regulationTypes.has("hipaa")) return false;
            break;
          case "gdpr":
            if (!info.regulationTypes.has("gdpr")) return false;
            break;
          case "research":
            if (!info.consentTypes.has("research")) return false;
            break;
        }
      }

      // Time range filter
      if (timeRangeFilter !== "all") {
        const days = parseInt(timeRangeFilter, 10);
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - days);
        const updatedAt = new Date(patient.updated_at);
        if (updatedAt < cutoff) return false;
      }

      return true;
    });
  }, [searchQuery, statusFilter, consentTypeFilter, timeRangeFilter]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredPatients.length / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, filteredPatients.length);
  const paginatedPatients = filteredPatients.slice(startIndex, endIndex);

  const selectClasses =
    "rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 focus:border-teal focus:ring-1 focus:ring-teal focus:outline-none";

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
          Patients
        </h1>
        <button
          type="button"
          className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-teal px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-teal/90"
        >
          <Plus className="h-4 w-4" />
          Add Patient
        </button>
      </div>

      {/* Search bar */}
      <div className="relative w-full sm:max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
        <input
          type="text"
          placeholder="Search by name, MRN, or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 pl-10 text-sm text-slate-700 placeholder:text-slate-400 focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:placeholder:text-slate-500"
        />
      </div>

      {/* Filter row */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
          className={selectClasses}
        >
          <option value="all">All Patients</option>
          <option value="active">Active Consent</option>
          <option value="expired">Expired</option>
          <option value="none">No Consent</option>
        </select>

        <select
          value={consentTypeFilter}
          onChange={(e) => setConsentTypeFilter(e.target.value as ConsentTypeFilter)}
          className={selectClasses}
        >
          <option value="all">All Consent Types</option>
          <option value="hipaa">HIPAA</option>
          <option value="gdpr">GDPR</option>
          <option value="research">Research</option>
        </select>

        <select
          value={timeRangeFilter}
          onChange={(e) => setTimeRangeFilter(e.target.value as TimeRangeFilter)}
          className={selectClasses}
        >
          <option value="all">All Time</option>
          <option value="30">Last 30 Days</option>
          <option value="60">Last 60 Days</option>
          <option value="90">Last 90 Days</option>
        </select>
      </div>

      {/* Table card */}
      <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
        {loading ? (
          <>
            {/* Desktop skeleton */}
            <div className="overflow-x-auto">
              <table className="hidden w-full sm:table">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800">
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">MRN</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Last Consent Date</th>
                    <th className="px-4 py-3"><span className="sr-only">Actions</span></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <SkeletonRow key={i} />
                  ))}
                </tbody>
              </table>
            </div>
            {/* Mobile skeleton */}
            <div className="sm:hidden space-y-3 p-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <SkeletonMobileCard key={i} />
              ))}
            </div>
          </>
        ) : filteredPatients.length > 0 ? (
          <>
            {/* Desktop table */}
            <div className="overflow-x-auto">
              <table className="hidden w-full sm:table">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800">
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      MRN
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Last Consent Date
                    </th>
                    <th className="px-4 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                  {paginatedPatients.map((patient, index) => {
                    const info = consentMap.get(patient.id);
                    const status = getPatientStatus(patient.id);
                    const lastGrantedAt = info?.lastGrantedAt;
                    const href = `/demo/patients/${patient.id}`;

                    return (
                      <tr
                        key={patient.id}
                        onClick={() => router.push(href)}
                        className={cn(
                          "group cursor-pointer row-hover-sweep",
                          index % 2 === 1 && "bg-slate-50/50 dark:bg-slate-800/20"
                        )}
                      >
                        <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-navy">
                          <Link href={href} className="hover:underline">
                            {patient.first_name} {patient.last_name}
                          </Link>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                          {patient.email}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                          {patient.external_mrn}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm">
                          <StatusBadge status={status} />
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                          {lastGrantedAt ? formatDate(lastGrantedAt) : "\u2014"}
                        </td>
                        <td className="whitespace-nowrap px-4 py-4">
                          <ChevronRight className="h-4 w-4 text-slate-300 transition-colors group-hover:text-slate-500 dark:text-slate-600 dark:group-hover:text-slate-400" />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile card layout */}
            <div className="sm:hidden space-y-3 p-4">
              {paginatedPatients.map((patient) => {
                const info = consentMap.get(patient.id);
                const status = getPatientStatus(patient.id);
                const lastGrantedAt = info?.lastGrantedAt;
                const href = `/demo/patients/${patient.id}`;

                return (
                  <div
                    key={patient.id}
                    onClick={() => router.push(href)}
                    className="cursor-pointer rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-slate-900 dark:text-slate-100">
                          {patient.first_name} {patient.last_name}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {patient.external_mrn}
                        </p>
                      </div>
                      <StatusBadge status={status} />
                    </div>
                    <div className="mt-2 space-y-1">
                      <p className="text-sm text-slate-600 dark:text-slate-300">
                        {patient.email}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Last consent: {lastGrantedAt ? formatDate(lastGrantedAt) : "\u2014"}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between border-t border-slate-100 px-6 py-3 dark:border-slate-800">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Showing {startIndex + 1} to {endIndex} of {filteredPatients.length} patients
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className={cn(
                    "rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium dark:border-slate-700",
                    currentPage === 1
                      ? "opacity-50 cursor-not-allowed"
                      : "cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800"
                  )}
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className={cn(
                    "rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium dark:border-slate-700",
                    currentPage === totalPages
                      ? "opacity-50 cursor-not-allowed"
                      : "cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800"
                  )}
                >
                  Next
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center px-6 py-16">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
              <Users className="h-6 w-6 text-slate-400 dark:text-slate-500" />
            </div>
            <p className="mt-4 text-sm font-medium text-slate-700 dark:text-slate-200">
              No patients found
            </p>
            <p className="mt-1 text-sm text-slate-400 dark:text-slate-500">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
