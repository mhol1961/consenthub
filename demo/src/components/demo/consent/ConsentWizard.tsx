"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/lib/toast";
import StepTemplateSelect from "./StepTemplateSelect";
import StepLegalText from "./StepLegalText";
import StepChannels from "./StepChannels";
import StepSignature from "./StepSignature";
import StepConfirmation from "./StepConfirmation";
import StepSuccess from "./StepSuccess";

// ---------------------------------------------------------------------------
// Shared types — exported for use by step components
// ---------------------------------------------------------------------------

export type WizardData = {
  templateId: string | null;
  reviewedLegalText: boolean;
  channels: { email: boolean; sms: boolean; phone: boolean; mail: boolean };
  signatureMode: "draw" | "type";
  signatureDataUrl: string | null;
  typedSignature: string;
};

export type StepProps = {
  data: WizardData;
  onUpdate: (updates: Partial<WizardData>) => void;
  goToStep?: (step: number) => void;
  onReset?: () => void;
};

// ---------------------------------------------------------------------------
// Step metadata
// ---------------------------------------------------------------------------

const STEPS = [
  { number: 1, label: "Template" },
  { number: 2, label: "Review" },
  { number: 3, label: "Channels" },
  { number: 4, label: "Signature" },
  { number: 5, label: "Confirm" },
  { number: 6, label: "Complete" },
] as const;

// ---------------------------------------------------------------------------
// Initial wizard state
// ---------------------------------------------------------------------------

const INITIAL_DATA: WizardData = {
  templateId: null,
  reviewedLegalText: false,
  channels: { email: false, sms: false, phone: false, mail: false },
  signatureMode: "draw",
  signatureDataUrl: null,
  typedSignature: "",
};

// ---------------------------------------------------------------------------
// Animation helpers
// ---------------------------------------------------------------------------

const EASE = [0.17, 0.55, 0.55, 1] as const;

function slideVariants(direction: number) {
  return {
    initial: { x: direction * 80, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: direction * -80, opacity: 0 },
  };
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function ConsentWizard() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<WizardData>(INITIAL_DATA);

  // Track animation direction: 1 = forward, -1 = backward
  const directionRef = useRef(1);

  // Merge partial updates into wizard data
  const handleUpdate = useCallback((updates: Partial<WizardData>) => {
    setData((prev) => ({ ...prev, ...updates }));
  }, []);

  // Navigation
  function goNext() {
    directionRef.current = 1;
    if (step === 5) {
      toast("Consent submitted successfully");
    }
    setStep((s) => Math.min(s + 1, 6));
  }

  function goBack() {
    directionRef.current = -1;
    setStep((s) => Math.max(s - 1, 1));
  }

  function goToStep(target: number) {
    directionRef.current = target > step ? 1 : -1;
    setStep(target);
  }

  function handleReset() {
    directionRef.current = -1;
    setData(INITIAL_DATA);
    setStep(1);
  }

  // Determine whether the primary button should be disabled
  function isNextDisabled(): boolean {
    switch (step) {
      case 1:
        return data.templateId === null;
      case 2:
        return !data.reviewedLegalText;
      case 3:
        return !Object.values(data.channels).some(Boolean);
      case 4:
        return data.signatureMode === "draw"
          ? data.signatureDataUrl === null
          : data.typedSignature.trim() === "";
      default:
        return false;
    }
  }

  // Primary button label
  function primaryLabel(): string {
    if (step === 5) return "Submit Consent";
    return "Next";
  }

  // -----------------------------------------------------------------------
  // Render step content
  // -----------------------------------------------------------------------

  function renderStep() {
    const variants = slideVariants(directionRef.current);

    const inner = (() => {
      switch (step) {
        case 1:
          return <StepTemplateSelect data={data} onUpdate={handleUpdate} />;
        case 2:
          return <StepLegalText data={data} onUpdate={handleUpdate} />;
        case 3:
          return <StepChannels data={data} onUpdate={handleUpdate} />;
        case 4:
          return <StepSignature data={data} onUpdate={handleUpdate} />;
        case 5:
          return (
            <StepConfirmation
              data={data}
              onUpdate={handleUpdate}
              goToStep={goToStep}
            />
          );
        case 6:
          return <StepSuccess onReset={handleReset} />;
        default:
          return null;
      }
    })();

    return (
      <motion.div
        key={step}
        variants={variants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.35, ease: EASE }}
      >
        {inner}
      </motion.div>
    );
  }

  // -----------------------------------------------------------------------
  // Main render
  // -----------------------------------------------------------------------

  return (
    <div className="mx-auto w-full max-w-3xl">
      {/* ── Progress stepper ───────────────────────────────────────── */}
      <nav aria-label="Wizard progress" className="mb-10">
        <ol className="flex items-center">
          {STEPS.map((s, idx) => {
            const isCompleted = step > s.number;
            const isActive = step === s.number;
            const isFuture = step < s.number;

            return (
              <li
                key={s.number}
                className={cn(
                  "flex items-center",
                  idx < STEPS.length - 1 && "flex-1"
                )}
              >
                {/* Circle + label group */}
                <div className="relative flex flex-col items-center">
                  {/* Pulse ring for active step */}
                  {isActive && (
                    <span
                      className="absolute inset-0 -m-0.5 rounded-full animate-step-pulse"
                      aria-hidden="true"
                    />
                  )}

                  <div
                    className={cn(
                      "relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition-all duration-500",
                      isCompleted && "bg-teal text-white",
                      isActive &&
                        "bg-teal text-white shadow-md shadow-teal/25",
                      isFuture &&
                        "border-2 border-slate-300 bg-white text-slate-400 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-500"
                    )}
                  >
                    {isCompleted ? (
                      <Check className="h-4 w-4" strokeWidth={3} />
                    ) : (
                      s.number
                    )}
                  </div>

                  <span
                    className={cn(
                      "mt-1.5 hidden text-xs font-medium transition-colors duration-300 sm:block",
                      (isCompleted || isActive) && "text-teal",
                      isFuture && "text-slate-400 dark:text-slate-500"
                    )}
                  >
                    {s.label}
                  </span>
                </div>

                {/* Connecting line (track + fill) */}
                {idx < STEPS.length - 1 && (
                  <div className="mx-2 h-0.5 flex-1 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                    <div
                      className={cn(
                        "h-full rounded-full bg-teal transition-all duration-500 ease-out",
                        step > s.number ? "w-full" : "w-0"
                      )}
                    />
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      </nav>

      {/* ── Step content ───────────────────────────────────────────── */}
      <div className="min-h-[420px]">
        <AnimatePresence mode="wait">{renderStep()}</AnimatePresence>
      </div>

      {/* ── Navigation buttons ─────────────────────────────────────── */}
      {step < 6 && (
        <div className="mt-8 flex items-center justify-between">
          {/* Back */}
          {step > 1 ? (
            <button
              type="button"
              onClick={goBack}
              className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition-colors duration-200 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </button>
          ) : (
            <div />
          )}

          {/* Next / Submit */}
          <button
            type="button"
            onClick={goNext}
            disabled={isNextDisabled()}
            className={cn(
              "inline-flex cursor-pointer items-center gap-2 rounded-lg font-semibold text-white transition-all duration-200",
              step === 5
                ? "px-8 py-3 text-base shadow-lg shadow-teal/25 dark:shadow-slate-950/50"
                : "px-6 py-2.5 text-sm shadow-md shadow-teal/20 dark:shadow-slate-950/50",
              isNextDisabled()
                ? "cursor-not-allowed bg-teal/40 shadow-none"
                : "bg-teal hover:bg-teal-dark hover:shadow-lg hover:shadow-teal/25"
            )}
          >
            {primaryLabel()}
            {step < 5 && <ChevronRight className="h-4 w-4" />}
          </button>
        </div>
      )}
    </div>
  );
}
