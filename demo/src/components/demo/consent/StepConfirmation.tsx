"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  MessageSquare,
  Phone,
  Send,
  ShieldCheck,
  FileText,
  Calendar,
  PenTool,
  User,
  Pencil,
} from "lucide-react";
import { cn } from "@/lib/utils";
import templates from "@/data/templates.json";
import type { StepProps } from "./ConsentWizard";

// ---------------------------------------------------------------------------
// Template type (mirrors the JSON shape)
// ---------------------------------------------------------------------------

type Template = {
  id: string;
  name: string;
  consent_type: string;
  regulation_type: string;
  requires_witness: boolean;
  expiration_days: number | null;
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Readable label for consent_type values */
function consentTypeLabel(type: string): string {
  const map: Record<string, string> = {
    marketing_email: "Marketing Email",
    marketing_sms: "Marketing SMS",
    treatment: "Treatment",
    data_sharing: "Data Sharing",
    research: "Research",
  };
  return map[type] ?? type;
}

/** Badge styling per regulation type */
function regulationBadge(reg: string): { bg: string; text: string; label: string } {
  switch (reg) {
    case "hipaa":
      return { bg: "bg-blue-100 dark:bg-blue-900/40", text: "text-blue-700 dark:text-blue-300", label: "HIPAA" };
    case "gdpr":
      return { bg: "bg-purple-100 dark:bg-purple-900/40", text: "text-purple-700 dark:text-purple-300", label: "GDPR" };
    case "tcpa":
      return { bg: "bg-amber-100 dark:bg-amber-900/40", text: "text-amber-700 dark:text-amber-300", label: "TCPA" };
    default:
      return { bg: "bg-slate-100 dark:bg-slate-800", text: "text-slate-700 dark:text-slate-200", label: reg.toUpperCase() };
  }
}

/** Channel metadata */
const CHANNEL_META: Record<string, { label: string; icon: typeof Mail }> = {
  email: { label: "Email", icon: Mail },
  sms: { label: "SMS", icon: MessageSquare },
  phone: { label: "Phone", icon: Phone },
  mail: { label: "Mail", icon: Send },
};

/** Format current date/time in a human-readable format */
function formatTimestamp(): string {
  return new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

// ---------------------------------------------------------------------------
// Animation config
// ---------------------------------------------------------------------------

const EASE: [number, number, number, number] = [0.17, 0.55, 0.55, 1];

const sectionVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.4, ease: EASE },
  }),
};

// ---------------------------------------------------------------------------
// Edit link sub-component
// ---------------------------------------------------------------------------

function EditLink({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex cursor-pointer items-center gap-1 text-xs font-medium text-teal hover:text-teal-dark transition-colors"
    >
      <Pencil className="h-3 w-3" />
      Edit
    </button>
  );
}

// ---------------------------------------------------------------------------
// Section header sub-component
// ---------------------------------------------------------------------------

function SectionHeader({
  label,
  onEdit,
}: {
  label: string;
  onEdit?: () => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
        {label}
      </p>
      {onEdit && <EditLink onClick={onEdit} />}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function StepConfirmation({ data, goToStep }: StepProps) {
  const template = useMemo<Template | null>(
    () => (templates as Template[]).find((t) => t.id === data.templateId) ?? null,
    [data.templateId],
  );

  const activeChannels = useMemo(
    () =>
      Object.entries(data.channels)
        .filter(([, active]) => active)
        .map(([key]) => key),
    [data.channels],
  );

  const reg = template ? regulationBadge(template.regulation_type) : null;
  const timestamp = useMemo(formatTimestamp, []);

  return (
    <div>
      {/* Heading */}
      <h2 className="font-serif text-2xl text-navy">Review &amp; Confirm</h2>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        Please review the details below before submitting
      </p>

      {/* Summary card */}
      <div className="mt-6 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6">
        {/* ── 1. Patient section ──────────────────────────────────────── */}
        <motion.div
          custom={0}
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          className="pb-5"
        >
          <SectionHeader label="Patient" />

          <div className="mt-3 flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-teal/10 dark:bg-teal/20">
              <User className="h-5 w-5 text-teal" />
            </div>
            <div className="min-w-0">
              <p className="text-base font-semibold text-navy">
                Sarah Mitchell
              </p>
              <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
                DOB: Mar 15, 1985 &middot; MRN: MRN-2024-1247
              </p>
            </div>
          </div>
        </motion.div>

        <div className="border-b border-slate-100 dark:border-slate-800" />

        {/* ── 2. Consent Template section ─────────────────────────────── */}
        <motion.div
          custom={1}
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          className="py-5"
        >
          <SectionHeader
            label="Consent Template"
            onEdit={goToStep ? () => goToStep(1) : undefined}
          />

          <div className="mt-3 flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-teal/10 dark:bg-teal/20">
              <FileText className="h-5 w-5 text-teal" />
            </div>
            <div className="min-w-0">
              <p className="text-base font-semibold text-navy">
                {template?.name ?? "No template selected"}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                {reg && (
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold",
                      reg.bg,
                      reg.text,
                    )}
                  >
                    <ShieldCheck className="h-3 w-3" />
                    {reg.label}
                  </span>
                )}
                {template && (
                  <span className="inline-flex items-center rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 text-xs font-semibold text-slate-600 dark:text-slate-300">
                    {consentTypeLabel(template.consent_type)}
                  </span>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        <div className="border-b border-slate-100 dark:border-slate-800" />

        {/* ── 3. Communication Channels section ──────────────────────── */}
        <motion.div
          custom={2}
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          className="py-5"
        >
          <SectionHeader
            label="Communication Channels"
            onEdit={goToStep ? () => goToStep(3) : undefined}
          />

          <div className="mt-3 flex flex-wrap gap-2">
            {activeChannels.length > 0 ? (
              activeChannels.map((key) => {
                const meta = CHANNEL_META[key];
                if (!meta) return null;
                const Icon = meta.icon;
                return (
                  <span
                    key={key}
                    className="inline-flex items-center gap-1.5 rounded-full bg-teal px-3 py-1 text-xs font-semibold text-white"
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {meta.label}
                  </span>
                );
              })
            ) : (
              <span className="text-sm text-slate-400 dark:text-slate-500">
                No channels selected
              </span>
            )}
          </div>
        </motion.div>

        <div className="border-b border-slate-100 dark:border-slate-800" />

        {/* ── 4. Signature section ────────────────────────────────────── */}
        <motion.div
          custom={3}
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          className="py-5"
        >
          <SectionHeader
            label="Signature"
            onEdit={goToStep ? () => goToStep(4) : undefined}
          />

          <div className="mt-3 flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800">
              <PenTool className="h-5 w-5 text-slate-500 dark:text-slate-400" />
            </div>

            {data.signatureMode === "draw" && data.signatureDataUrl ? (
              <div className="overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={data.signatureDataUrl}
                  alt="Patient signature"
                  className="max-h-[80px] w-auto"
                />
              </div>
            ) : data.signatureMode === "type" && data.typedSignature.trim() !== "" ? (
              <p
                className="text-slate-700 dark:text-slate-200"
                style={{
                  fontFamily: "'Brush Script MT', 'Segoe Script', cursive",
                  fontSize: "1.5rem",
                }}
              >
                {data.typedSignature}
              </p>
            ) : (
              <span className="text-sm text-slate-400 dark:text-slate-500">
                No signature provided
              </span>
            )}
          </div>
        </motion.div>

        <div className="border-b border-slate-100 dark:border-slate-800" />

        {/* ── 5. Capture Details section ──────────────────────────────── */}
        <motion.div
          custom={4}
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          className="pt-5"
        >
          <SectionHeader label="Capture Details" />

          <div className="mt-3 flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800">
              <Calendar className="h-5 w-5 text-slate-500 dark:text-slate-400" />
            </div>
            <div className="min-w-0">
              <p className="text-base font-medium text-slate-700 dark:text-slate-200">
                {timestamp}
              </p>
              <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
                Captured by: Dr. Sarah Mitchell
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Disclaimer */}
      <p className="mt-4 text-center text-xs text-slate-400 dark:text-slate-500">
        By submitting, you confirm that the patient has provided informed consent as
        required by applicable regulations.
      </p>
    </div>
  );
}
