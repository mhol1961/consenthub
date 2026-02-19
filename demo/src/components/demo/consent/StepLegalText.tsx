"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, FileText, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import templates from "@/data/templates.json";
import type { StepProps } from "./ConsentWizard";

// ---------------------------------------------------------------------------
// Template type
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

function regulationLabel(reg: string): { bg: string; text: string; label: string } {
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

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function StepLegalText({ data, onUpdate }: StepProps) {
  const [plainLanguage, setPlainLanguage] = useState(false);


  const template = useMemo<Template | null>(
    () => (templates as Template[]).find((t) => t.id === data.templateId) ?? null,
    [data.templateId]
  );

  if (!template) {
    return (
      <div className="text-center text-slate-500 dark:text-slate-400">
        No template selected. Please go back and select one.
      </div>
    );
  }

  const reg = regulationLabel(template.regulation_type);

  return (
    <div>
      {/* Header row */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl text-navy">Review Consent Terms</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{template.name}</p>
        </div>

        {/* Plain Language toggle */}
        <div className="flex shrink-0 items-center gap-2.5">
          <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Plain Language</span>
          <button
            type="button"
            role="switch"
            aria-checked={plainLanguage}
            onClick={() => setPlainLanguage((v) => !v)}
            className={cn(
              "relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal/40 focus-visible:ring-offset-2",
              plainLanguage ? "bg-teal" : "bg-slate-300 dark:bg-slate-600"
            )}
          >
            <motion.span
              className="pointer-events-none inline-block h-4.5 w-4.5 rounded-full bg-white shadow-sm"
              initial={false}
              animate={{ x: plainLanguage ? 22 : 2 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          </button>
        </div>
      </div>

      {/* Content area */}
      <div className="mt-6 max-h-[400px] overflow-y-auto rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={plainLanguage ? "plain" : "legal"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: EASE }}
          >
            {plainLanguage ? (
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-teal/10 dark:bg-teal/20">
                  <FileText className="h-4 w-4 text-teal" />
                </div>
                <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-200 lg:text-base">
                  {template.plain_language_summary}
                </p>
              </div>
            ) : (
              <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-200 lg:text-base">
                {template.legal_text}
              </p>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Regulation badge + version */}
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold",
            reg.bg,
            reg.text
          )}
        >
          <ShieldCheck className="h-3 w-3" />
          {reg.label}
        </span>
        <span className="text-xs text-slate-400 dark:text-slate-500">
          Version {template.version}
        </span>
      </div>

      {/* Review acknowledgement checkbox */}
      <div className="mt-4 flex items-center gap-3">
        <button
          type="button"
          role="checkbox"
          aria-checked={data.reviewedLegalText}
          onClick={() => onUpdate({ reviewedLegalText: !data.reviewedLegalText })}
          className={cn(
            "flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center rounded transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal/40 focus-visible:ring-offset-2",
            data.reviewedLegalText
              ? "bg-teal border-teal"
              : "border-2 border-slate-300 dark:border-slate-600"
          )}
        >
          {data.reviewedLegalText && (
            <motion.span
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.2, ease: EASE }}
            >
              <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />
            </motion.span>
          )}
        </button>
        <label
          onClick={() => onUpdate({ reviewedLegalText: !data.reviewedLegalText })}
          className="cursor-pointer text-sm font-medium text-slate-700 dark:text-slate-200"
        >
          I have reviewed and understand this consent document
        </label>
      </div>
    </div>
  );
}
