"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  Mail,
  Lock,
  Loader2,
  CheckCircle2,
  LogOut,
  MessageSquare,
  Phone,
  Send,
  Download,
  FileText,
  Heart,
  ChevronRight,
} from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

import patientsData from "@/data/patients.json";
import consentsData from "@/data/consents.json";
import templatesData from "@/data/templates.json";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type PortalStep = "login" | "dashboard";

type ConsentFilter = "all" | "active" | "revoked" | "expired";

interface Patient {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  date_of_birth: string;
  preferences: { language: string; contact_method: string };
  external_mrn: string;
  created_at: string;
  updated_at: string;
}

interface Consent {
  id: string;
  patient_id: string;
  template_id: string;
  organization_id: string;
  status: string;
  consent_type: string;
  regulation_type: string;
  granted_at: string;
  expires_at: string | null;
  revoked_at: string | null;
  revocation_reason: string | null;
  dynamics_sync_status: string;
}

interface Template {
  id: string;
  name: string;
  consent_type: string;
  regulation_type: string;
  plain_language_summary: string;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const patient = (patientsData as Patient[]).find((p) => p.id === "pat-001")!;

const patientConsents = (consentsData as Consent[]).filter(
  (c) => c.patient_id === "pat-001"
);

const templateMap = new Map(
  (templatesData as Template[]).map((t) => [t.id, t])
);

// ---------------------------------------------------------------------------
// Animation variants
// ---------------------------------------------------------------------------

const fadeSlideUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -24 },
} as const;

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.08,
    },
  },
} as const;

const staggerChild = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
} as const;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "No expiration";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatConsentType(type: string): string {
  return type
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function getStatusColor(status: string): string {
  switch (status) {
    case "active":
      return "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800";
    case "revoked":
      return "bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800";
    case "expired":
      return "bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800";
    case "pending":
      return "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800";
    default:
      return "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700";
  }
}

function getSyncDot(status: string): string {
  switch (status) {
    case "synced":
      return "bg-emerald-400";
    case "pending":
      return "bg-amber-400";
    case "failed":
      return "bg-red-400";
    default:
      return "bg-slate-400";
  }
}

// ---------------------------------------------------------------------------
// Toggle Switch Component
// ---------------------------------------------------------------------------

function ToggleSwitch({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-7 w-12 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
        checked ? "bg-blue-500" : "bg-slate-200 dark:bg-slate-700"
      )}
    >
      <span
        className={cn(
          "pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition-transform duration-200 ease-in-out",
          checked ? "translate-x-5" : "translate-x-0"
        )}
      />
    </button>
  );
}

// ---------------------------------------------------------------------------
// Login Step
// ---------------------------------------------------------------------------

function LoginStep({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSendLink = useCallback(() => {
    if (!email.trim()) return;
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSent(true);
    }, 1500);
  }, [email]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center px-4 py-12">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const }}
      >
        {/* Branding */}
        <div className="text-center mb-10">
          <div className="mb-5 flex justify-center">
            <Image
              src="/consenthub/logo-light.png"
              alt="ConsentHub"
              width={200}
              height={56}
              className="h-14 w-auto dark:hidden"
            />
            <Image
              src="/consenthub/logo-dark.png"
              alt="ConsentHub"
              width={200}
              height={56}
              className="hidden h-14 w-auto dark:block"
            />
          </div>
          <p className="text-blue-500 font-medium mt-1 text-lg">
            Patient Portal
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 shadow-sm dark:shadow-slate-950/50 border border-blue-100 dark:border-slate-700 p-8">
          <AnimatePresence mode="wait">
            {!sent ? (
              <motion.div
                key="form"
                {...fadeSlideUp}
                transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] as const }}
              >
                <p className="text-slate-600 dark:text-slate-300 text-center mb-8 text-base leading-relaxed">
                  Manage your consent preferences securely
                </p>

                {/* Email input */}
                <div className="relative mb-5">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSendLink();
                    }}
                    className="w-full h-14 pl-12 pr-4 rounded-xl border border-blue-200 dark:border-slate-700 bg-blue-50/30 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                {/* Send button */}
                <button
                  onClick={handleSendLink}
                  disabled={sending || !email.trim()}
                  className={cn(
                    "w-full h-14 rounded-xl font-semibold text-base transition-all flex items-center justify-center gap-2",
                    sending
                      ? "bg-blue-400 text-white cursor-not-allowed"
                      : email.trim()
                        ? "bg-blue-500 text-white hover:bg-blue-600 active:scale-[0.98] shadow-sm shadow-blue-500/20"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed"
                  )}
                >
                  {sending ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Send Magic Link
                    </>
                  )}
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="success"
                {...fadeSlideUp}
                transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const }}
                className="text-center py-2"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/40 mb-5">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                </div>
                <h2 className="font-serif text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                  Check your email!
                </h2>
                <p className="text-slate-600 dark:text-slate-300 mb-1 text-base">
                  We&apos;ve sent a secure sign-in link to
                </p>
                <p className="text-blue-600 font-medium mb-3 text-base">
                  {email}
                </p>
                <p className="text-sm text-slate-400 dark:text-slate-500 mb-8">
                  Link expires in 15 minutes
                </p>

                <button
                  type="button"
                  onClick={onLogin}
                  className="inline-flex items-center gap-2 rounded-lg px-4 py-3 text-blue-500 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-300 font-medium transition-colors text-base group"
                >
                  Open Demo Portal
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center flex items-center justify-center gap-2 text-sm text-slate-400 dark:text-slate-500">
          <Lock className="w-3.5 h-3.5" />
          <span>Your data is protected by HIPAA and GDPR regulations</span>
        </div>
      </motion.div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Dashboard Step
// ---------------------------------------------------------------------------

function DashboardStep({ onLogout }: { onLogout: () => void }) {
  const [preferences, setPreferences] = useState({
    email: true,
    sms: true,
    phone: false,
    mail: false,
  });
  const [prefsSaved, setPrefsSaved] = useState(false);
  const [filter, setFilter] = useState<ConsentFilter>("all");
  const [exportState, setExportState] = useState<
    "idle" | "preparing" | "ready"
  >("idle");
  const [dashboardReady, setDashboardReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setDashboardReady(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleSavePreferences = useCallback(() => {
    setPrefsSaved(true);
    setTimeout(() => setPrefsSaved(false), 2500);
  }, []);

  const handleExport = useCallback(() => {
    setExportState("preparing");
    setTimeout(() => setExportState("ready"), 2000);
    setTimeout(() => setExportState("idle"), 5000);
  }, []);

  const filteredConsents = useMemo(() => {
    if (filter === "all") return patientConsents;
    return patientConsents.filter((c) => c.status === filter);
  }, [filter]);

  const prefOptions = [
    {
      key: "email" as const,
      icon: Mail,
      label: "Email Communications",
      description: "Receive appointment reminders and health updates via email",
    },
    {
      key: "sms" as const,
      icon: MessageSquare,
      label: "SMS Messages",
      description: "Get text message notifications for appointments and alerts",
    },
    {
      key: "phone" as const,
      icon: Phone,
      label: "Phone Calls",
      description: "Allow phone calls for appointment confirmations",
    },
    {
      key: "mail" as const,
      icon: Send,
      label: "Postal Mail",
      description: "Receive physical letters and printed communications",
    },
  ];

  const filterOptions: { key: ConsentFilter; label: string }[] = [
    { key: "all", label: "All" },
    { key: "active", label: "Active" },
    { key: "revoked", label: "Revoked" },
    { key: "expired", label: "Expired" },
  ];

  if (!dashboardReady) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/60 via-white to-blue-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Header */}
      <motion.header
        className="bg-white dark:bg-slate-900 border-b border-blue-100 dark:border-slate-700 sticky top-0 z-30"
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] as const }}
      >
        <div className="max-w-2xl mx-auto px-5 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <Image
              src="/consenthub/logo-light.png"
              alt="ConsentHub"
              width={140}
              height={32}
              className="h-8 w-auto dark:hidden"
            />
            <Image
              src="/consenthub/logo-dark.png"
              alt="ConsentHub"
              width={140}
              height={32}
              className="hidden h-8 w-auto dark:block"
            />
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-600 dark:text-slate-300 hidden sm:block">
              {patient.first_name} {patient.last_name}
            </span>
            <div className="w-9 h-9 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-semibold">
              MS
            </div>
            <button
              onClick={onLogout}
              className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors p-1"
              aria-label="Sign out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </motion.header>

      {/* Content */}
      <motion.div
        className="max-w-2xl mx-auto px-5 py-8 space-y-8"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        {/* Welcome */}
        <motion.section
          variants={staggerChild}
          transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const }}
        >
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Welcome back, {patient.first_name}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-base leading-relaxed">
            Manage your consent preferences and view your consent history
          </p>
        </motion.section>

        {/* Communication Preferences */}
        <motion.section
          variants={staggerChild}
          transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const }}
        >
          <div className="rounded-2xl bg-white dark:bg-slate-900 shadow-sm dark:shadow-slate-950/50 border border-blue-100 dark:border-slate-700 p-6 sm:p-7">
            <div className="mb-6">
              <h2 className="font-serif text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Heart className="w-5 h-5 text-blue-500" />
                Communication Preferences
              </h2>
              <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
                Choose how you&apos;d like to be contacted
              </p>
            </div>

            <div className="space-y-1">
              {prefOptions.map((opt, i) => {
                const Icon = opt.icon;
                return (
                  <motion.div
                    key={opt.key}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.3,
                      delay: 0.1 + i * 0.06,
                      ease: [0.25, 0.46, 0.45, 0.94] as const,
                    }}
                    className="flex items-center justify-between py-4 px-3 rounded-xl hover:bg-blue-50/50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5 text-blue-500" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-slate-900 dark:text-slate-100 text-sm">
                          {opt.label}
                        </p>
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 leading-relaxed">
                          {opt.description}
                        </p>
                      </div>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      <ToggleSwitch
                        checked={preferences[opt.key]}
                        onChange={(val) =>
                          setPreferences((prev) => ({
                            ...prev,
                            [opt.key]: val,
                          }))
                        }
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <div className="mt-6 flex items-center gap-3">
              <button
                onClick={handleSavePreferences}
                className="h-12 px-8 rounded-xl bg-blue-500 text-white font-semibold text-sm hover:bg-blue-600 active:scale-[0.98] transition-all shadow-sm shadow-blue-500/20"
              >
                Save Preferences
              </button>
              <AnimatePresence>
                {prefsSaved && (
                  <motion.span
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] as const }}
                    className="text-emerald-600 text-sm font-medium flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Preferences updated
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.section>

        {/* Consent History */}
        <motion.section
          variants={staggerChild}
          transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const }}
        >
          <div className="mb-5">
            <h2 className="font-serif text-xl font-bold text-slate-900 dark:text-slate-100">
              Your Consents
            </h2>
          </div>

          {/* Filter pills */}
          <div className="flex gap-2 mb-5 flex-wrap">
            {filterOptions.map((opt) => (
              <button
                key={opt.key}
                onClick={() => setFilter(opt.key)}
                className={cn(
                  "h-9 px-4 rounded-full text-sm font-medium transition-all",
                  filter === opt.key
                    ? "bg-blue-500 text-white shadow-sm shadow-blue-500/20"
                    : "bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border border-blue-100 dark:border-slate-700 hover:border-blue-200 dark:hover:border-slate-600 hover:text-slate-700 dark:hover:text-slate-200"
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Consent cards */}
          <AnimatePresence mode="wait">
            <motion.div
              key={filter}
              className="space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] as const }}
            >
              {filteredConsents.length === 0 ? (
                <div className="rounded-2xl bg-white dark:bg-slate-900 shadow-sm dark:shadow-slate-950/50 border border-blue-100 dark:border-slate-700 p-8 text-center">
                  <FileText className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-500 dark:text-slate-400 text-sm">
                    No consents found for this filter.
                  </p>
                </div>
              ) : (
                filteredConsents.map((consent, i) => {
                  const template = templateMap.get(consent.template_id);
                  return (
                    <motion.div
                      key={consent.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.3,
                        delay: i * 0.06,
                        ease: [0.25, 0.46, 0.45, 0.94] as const,
                      }}
                      className="rounded-2xl bg-white dark:bg-slate-900 shadow-sm dark:shadow-slate-950/50 border border-blue-100 dark:border-slate-700 p-5"
                    >
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-base leading-snug">
                          {template?.name ?? "Unknown Template"}
                        </h3>
                        <span
                          className={cn(
                            "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border flex-shrink-0 capitalize",
                            getStatusColor(consent.status)
                          )}
                        >
                          {consent.status}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500 dark:text-slate-400 mb-3">
                        <span>{formatConsentType(consent.consent_type)}</span>
                        <span className="text-slate-300 dark:text-slate-600">|</span>
                        <span className="uppercase text-xs font-medium tracking-wide text-slate-400 dark:text-slate-500">
                          {consent.regulation_type}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-slate-500 dark:text-slate-400">
                        <div>
                          <span className="text-slate-400 dark:text-slate-500">Granted: </span>
                          <span className="text-slate-600 dark:text-slate-300">
                            {formatDate(consent.granted_at)}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 dark:text-slate-500">Expires: </span>
                          <span className="text-slate-600 dark:text-slate-300">
                            {formatDate(consent.expires_at)}
                          </span>
                        </div>
                      </div>

                      {consent.status === "revoked" &&
                        consent.revocation_reason && (
                          <div className="mt-3 p-3 rounded-xl bg-red-50/60 dark:bg-red-900/20 border border-red-100 dark:border-red-800">
                            <p className="text-sm text-red-600">
                              <span className="font-medium">
                                Revocation reason:{" "}
                              </span>
                              {consent.revocation_reason}
                            </p>
                            {consent.revoked_at && (
                              <p className="text-xs text-red-400 mt-1">
                                Revoked on {formatDate(consent.revoked_at)}
                              </p>
                            )}
                          </div>
                        )}

                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500">
                          <span
                            className={cn(
                              "w-2 h-2 rounded-full",
                              getSyncDot(consent.dynamics_sync_status)
                            )}
                          />
                          <span className="capitalize">
                            {consent.dynamics_sync_status === "synced"
                              ? "Synced with Dynamics 365"
                              : consent.dynamics_sync_status === "pending"
                                ? "Sync pending"
                                : "Sync failed"}
                          </span>
                        </div>
                        {consent.status === "active" && (
                          <button type="button" className="rounded-lg px-3 py-2 text-xs text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-300 font-medium transition-colors">
                            Revoke Consent
                          </button>
                        )}
                      </div>
                    </motion.div>
                  );
                })
              )}
            </motion.div>
          </AnimatePresence>
        </motion.section>

        {/* Data Export */}
        <motion.section
          variants={staggerChild}
          transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const }}
        >
          <div className="rounded-2xl bg-white dark:bg-slate-900 shadow-sm dark:shadow-slate-950/50 border border-blue-100 dark:border-slate-700 p-6 sm:p-7">
            <h2 className="font-serif text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 mb-2">
              <Download className="w-5 h-5 text-blue-500" />
              Your Data
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-5 leading-relaxed">
              Export all your consent records as required by GDPR Article 20
            </p>

            <button
              onClick={handleExport}
              disabled={exportState !== "idle"}
              className={cn(
                "h-12 px-6 rounded-xl font-semibold text-sm transition-all flex items-center gap-2",
                exportState === "idle"
                  ? "bg-blue-500 text-white hover:bg-blue-600 active:scale-[0.98] shadow-sm shadow-blue-500/20"
                  : exportState === "preparing"
                    ? "bg-blue-400 text-white cursor-not-allowed"
                    : "bg-emerald-500 text-white cursor-default"
              )}
            >
              {exportState === "idle" && (
                <>
                  <Download className="w-4 h-4" />
                  Download My Data
                </>
              )}
              {exportState === "preparing" && (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Preparing export...
                </>
              )}
              {exportState === "ready" && (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Download ready
                </>
              )}
            </button>
          </div>
        </motion.section>

        {/* Footer */}
        <motion.footer
          variants={staggerChild}
          transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const }}
          className="text-center py-8 space-y-3"
        >
          <div className="flex items-center justify-center gap-2 text-sm text-slate-400 dark:text-slate-500">
            <Lock className="w-3.5 h-3.5" />
            <span>Protected by ConsentHub | HIPAA &amp; GDPR Compliant</span>
          </div>
          <div className="flex items-center justify-center gap-4 text-xs text-slate-400 dark:text-slate-500">
            <button className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
              Privacy Policy
            </button>
            <span className="text-slate-200 dark:text-slate-700">|</span>
            <button className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
              Terms of Service
            </button>
          </div>
        </motion.footer>
      </motion.div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Portal Page
// ---------------------------------------------------------------------------

export default function PortalPage() {
  const [step, setStep] = useState<PortalStep>("login");

  return (
    <AnimatePresence mode="wait">
      {step === "login" ? (
        <motion.div
          key="login"
          {...fadeSlideUp}
          transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const }}
        >
          <LoginStep onLogin={() => setStep("dashboard")} />
        </motion.div>
      ) : (
        <motion.div
          key="dashboard"
          {...fadeSlideUp}
          transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const }}
        >
          <DashboardStep onLogout={() => setStep("login")} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
