"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Pen, Type, Eraser } from "lucide-react";
import { cn } from "@/lib/utils";
import SignaturePad from "signature_pad";
import type { StepProps } from "./ConsentWizard";

// ---------------------------------------------------------------------------
// Animation constants
// ---------------------------------------------------------------------------

const FADE_TRANSITION = {
  duration: 0.25,
  ease: [0.4, 0, 0.2, 1] as const,
};

// ---------------------------------------------------------------------------
// Dark-mode pen color constants
// ---------------------------------------------------------------------------

const PEN_COLOR_LIGHT = "#0F172A"; // navy
const PEN_COLOR_DARK = "#E2E8F0"; // slate-200

/** Return the correct pen color based on the current theme. */
function getCurrentPenColor(): string {
  if (typeof document === "undefined") return PEN_COLOR_LIGHT;
  return document.documentElement.classList.contains("dark")
    ? PEN_COLOR_DARK
    : PEN_COLOR_LIGHT;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Debounce a callback by `ms` milliseconds. */
function useDebouncedCallback<T extends (...args: never[]) => void>(
  callback: T,
  ms: number,
): T {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cbRef = useRef(callback);
  cbRef.current = callback;

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => cbRef.current(...args), ms);
    },
    [ms],
  ) as unknown as T;
}

// ---------------------------------------------------------------------------
// Draw Mode
// ---------------------------------------------------------------------------

function DrawMode({ data, onUpdate }: StepProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const padRef = useRef<SignaturePad | null>(null);
  const [isEmpty, setIsEmpty] = useState(true);

  // ── Resize the canvas to match its container ──────────────────────────
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Capture current data before resizing (if user already drew something)
    const currentData =
      padRef.current && !padRef.current.isEmpty()
        ? padRef.current.toData()
        : null;

    const ratio = Math.max(window.devicePixelRatio || 1, 1);
    canvas.width = canvas.offsetWidth * ratio;
    canvas.height = canvas.offsetHeight * ratio;

    const ctx = canvas.getContext("2d");
    if (ctx) ctx.scale(ratio, ratio);

    // Re-apply existing signature data after resize
    if (padRef.current) {
      padRef.current.clear();
      if (currentData) {
        padRef.current.fromData(currentData);
        setIsEmpty(false);
      }
    }
  }, []);

  const debouncedResize = useDebouncedCallback(resizeCanvas, 150);

  // ── Initialize signature_pad, ResizeObserver, and MutationObserver ────
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    // Initial size
    const ratio = Math.max(window.devicePixelRatio || 1, 1);
    canvas.width = canvas.offsetWidth * ratio;
    canvas.height = canvas.offsetHeight * ratio;
    const ctx = canvas.getContext("2d");
    if (ctx) ctx.scale(ratio, ratio);

    // Create the SignaturePad instance with theme-aware pen color
    const pad = new SignaturePad(canvas, {
      minWidth: 1.5,
      maxWidth: 3,
      penColor: getCurrentPenColor(),
    });
    padRef.current = pad;

    // Restore existing signature if re-entering this step
    if (data.signatureDataUrl) {
      pad
        .fromDataURL(data.signatureDataUrl, {
          width: canvas.offsetWidth,
          height: canvas.offsetHeight,
        })
        .then(() => {
          setIsEmpty(pad.isEmpty());
        });
    }

    // Listen for stroke completion
    const handleEndStroke = () => {
      setIsEmpty(false);
      onUpdate({ signatureDataUrl: pad.toDataURL() });
    };
    pad.addEventListener("endStroke", handleEndStroke);

    // ResizeObserver for responsive canvas
    const resizeObserver = new ResizeObserver(() => {
      debouncedResize();
    });
    resizeObserver.observe(container);

    // MutationObserver to detect dark mode class changes on <html>
    const mutationObserver = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "class"
        ) {
          if (padRef.current) {
            padRef.current.penColor = getCurrentPenColor();
          }
        }
      }
    });
    mutationObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      pad.removeEventListener("endStroke", handleEndStroke);
      pad.off();
      padRef.current = null;
      resizeObserver.disconnect();
      mutationObserver.disconnect();
    };
    // We intentionally only run this on mount/unmount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Clear handler ─────────────────────────────────────────────────────
  function handleClear() {
    padRef.current?.clear();
    setIsEmpty(true);
    onUpdate({ signatureDataUrl: null });
  }

  return (
    <div ref={containerRef} className="relative">
      {/* Clear button */}
      <button
        type="button"
        onClick={handleClear}
        className={cn(
          "absolute right-3 top-3 z-10 inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors duration-200",
          isEmpty
            ? "pointer-events-none text-slate-300 dark:text-slate-600"
            : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-800 dark:hover:text-slate-100"
        )}
        aria-label="Clear signature"
      >
        <Eraser className="h-3.5 w-3.5" />
        Clear
      </button>

      {/* Canvas wrapper */}
      <div className="relative overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
        {/* "Sign here" placeholder — visible only when empty */}
        <AnimatePresence>
          {isEmpty && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="pointer-events-none absolute inset-0 z-[1] flex flex-col items-center justify-center"
            >
              <span className="text-lg text-slate-300 dark:text-slate-500 select-none">
                Sign here
              </span>
              <div className="mt-1 w-40">
                <svg
                  viewBox="0 0 160 2"
                  fill="none"
                  className="w-full"
                  aria-hidden="true"
                >
                  <motion.line
                    x1="0"
                    y1="1"
                    x2="160"
                    y2="1"
                    stroke="currentColor"
                    className="text-slate-300 dark:text-slate-600"
                    strokeWidth="2"
                    strokeDasharray="6 4"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{
                      duration: 1.2,
                      ease: [0.4, 0, 0.2, 1] as const,
                      repeat: Infinity,
                      repeatType: "reverse",
                      repeatDelay: 0.5,
                    }}
                  />
                </svg>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <canvas
          ref={canvasRef}
          className="min-h-[200px] w-full cursor-crosshair md:min-h-[250px]"
          style={{ touchAction: "none" }}
        />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Type Mode
// ---------------------------------------------------------------------------

function TypeMode({ data, onUpdate }: StepProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus the input when entering type mode
  useEffect(() => {
    const timeout = setTimeout(() => inputRef.current?.focus(), 100);
    return () => clearTimeout(timeout);
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    onUpdate({ typedSignature: e.target.value });
  }

  const hasText = data.typedSignature.trim().length > 0;

  return (
    <div className="space-y-6">
      {/* Text input */}
      <div>
        <label htmlFor="typed-sig" className="sr-only">
          Type your full name
        </label>
        <input
          ref={inputRef}
          id="typed-sig"
          type="text"
          value={data.typedSignature}
          onChange={handleChange}
          placeholder="Type your full name"
          autoComplete="name"
          className={cn(
            "h-14 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-5 text-2xl text-slate-700 dark:text-slate-200 outline-none transition-colors duration-200",
            "placeholder:text-slate-300 dark:placeholder:text-slate-600",
            "focus:border-teal focus:ring-2 focus:ring-teal/20"
          )}
        />
      </div>

      {/* Signature preview */}
      <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-6 py-8">
        <div className="flex min-h-[80px] items-end justify-center">
          <div className="w-full sm:max-w-md">
            <div
              className={cn(
                "border-b-2 border-slate-300 dark:border-slate-600 pb-2 text-center transition-all duration-300",
                hasText
                  ? "border-navy/30"
                  : "border-dashed border-slate-200 dark:border-slate-600"
              )}
            >
              {hasText ? (
                <motion.span
                  key={data.typedSignature}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.2,
                    ease: [0.4, 0, 0.2, 1] as const,
                  }}
                  className="inline-block text-navy"
                  style={{
                    fontFamily:
                      "'Brush Script MT', 'Segoe Script', 'Dancing Script', cursive",
                    fontSize: "clamp(1.5rem, 5vw, 2.5rem)",
                    lineHeight: 1.2,
                  }}
                >
                  {data.typedSignature}
                </motion.span>
              ) : (
                <span
                  className="inline-block text-slate-300 dark:text-slate-500 select-none"
                  style={{
                    fontFamily:
                      "'Brush Script MT', 'Segoe Script', 'Dancing Script', cursive",
                    fontSize: "2rem",
                    lineHeight: 1.2,
                  }}
                >
                  Your signature
                </span>
              )}
            </div>
            <p className="mt-2 text-center text-xs text-slate-400 dark:text-slate-500">
              Signature Preview
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export default function StepSignature({ data, onUpdate }: StepProps) {
  const isDraw = data.signatureMode === "draw";

  return (
    <div>
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <h2 className="font-serif text-2xl text-navy">Capture Signature</h2>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        Draw your signature or type it below
      </p>

      {/* ── Mode toggle ────────────────────────────────────────────────── */}
      <div className="mt-6 flex gap-2">
        <button
          type="button"
          onClick={() => onUpdate({ signatureMode: "draw" })}
          className={cn(
            "inline-flex cursor-pointer items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition-all duration-200",
            isDraw
              ? "bg-teal text-white shadow-md shadow-teal/20 dark:shadow-slate-950/50"
              : "border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
          )}
        >
          <Pen className="h-4 w-4" />
          Draw Signature
        </button>

        <button
          type="button"
          onClick={() => onUpdate({ signatureMode: "type" })}
          className={cn(
            "inline-flex cursor-pointer items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition-all duration-200",
            !isDraw
              ? "bg-teal text-white shadow-md shadow-teal/20 dark:shadow-slate-950/50"
              : "border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
          )}
        >
          <Type className="h-4 w-4" />
          Type Signature
        </button>
      </div>

      {/* ── Mode content with animated crossfade ───────────────────────── */}
      <div className="mt-6">
        <AnimatePresence mode="wait">
          {isDraw ? (
            <motion.div
              key="draw"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={FADE_TRANSITION}
            >
              <DrawMode data={data} onUpdate={onUpdate} />
            </motion.div>
          ) : (
            <motion.div
              key="type"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={FADE_TRANSITION}
            >
              <TypeMode data={data} onUpdate={onUpdate} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
