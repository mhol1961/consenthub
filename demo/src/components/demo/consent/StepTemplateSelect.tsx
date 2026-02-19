"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
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
  legal_text: string;
  plain_language_summary: string;
  version: number;
  expiration_days: number | null;
  requires_witness: boolean;
  is_active: boolean;
  custom_fields: { name: string; type: string; required: boolean; options?: string[] }[];
};

// ---------------------------------------------------------------------------
// Animation
// ---------------------------------------------------------------------------

const EASE: [number, number, number, number] = [0.17, 0.55, 0.55, 1];

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

/** Badge color per regulation type */
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

/** Truncate text to a target character length, breaking at the last word boundary */
function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  const trimmed = text.slice(0, max);
  const lastSpace = trimmed.lastIndexOf(" ");
  return (lastSpace > 0 ? trimmed.slice(0, lastSpace) : trimmed) + "...";
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function StepTemplateSelect({ data, onUpdate }: StepProps) {
  const activeTemplates = useMemo(
    () => (templates as Template[]).filter((t) => t.is_active),
    []
  );

  function handleSelect(id: string) {
    onUpdate({ templateId: id });
  }

  return (
    <div>
      {/* Header */}
      <h2 className="font-serif text-2xl text-navy">Select Consent Template</h2>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        Choose the consent form to capture for this patient
      </p>

      {/* Card grid */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {activeTemplates.map((t) => {
          const isSelected = data.templateId === t.id;
          const reg = regulationBadge(t.regulation_type);

          return (
            <motion.button
              key={t.id}
              type="button"
              onClick={() => handleSelect(t.id)}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.25, ease: EASE }}
              className={cn(
                "relative cursor-pointer rounded-xl border p-5 text-left transition-all duration-200",
                "hover:-translate-y-0.5 hover:shadow-md",
                isSelected
                  ? "border-teal ring-1 ring-teal bg-teal/5 dark:bg-teal/10"
                  : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
              )}
            >
              {/* Selected check indicator */}
              {isSelected && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.25, ease: EASE }}
                  className="absolute top-3 right-3"
                >
                  <CheckCircle className="h-5 w-5 text-teal" />
                </motion.div>
              )}

              {/* Template name */}
              <h3 className="pr-6 font-semibold text-navy">{t.name}</h3>

              {/* Badges row */}
              <div className="mt-2.5 flex flex-wrap items-center gap-2">
                {/* Consent type badge */}
                <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  {consentTypeLabel(t.consent_type)}
                </span>

                {/* Regulation badge */}
                <span
                  className={cn(
                    "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
                    reg.bg,
                    reg.text
                  )}
                >
                  {reg.label}
                </span>
              </div>

              {/* Description */}
              <p className="mt-3 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                {truncate(t.plain_language_summary, 80)}
              </p>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
