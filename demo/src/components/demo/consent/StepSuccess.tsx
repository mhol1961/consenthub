"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw, CheckCircle } from "lucide-react";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const EASE: [number, number, number, number] = [0.17, 0.55, 0.55, 1];

// ---------------------------------------------------------------------------
// Animated checkmark SVG (self-drawing path)
// ---------------------------------------------------------------------------

function AnimatedCheckmark() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-10 w-10"
      aria-hidden="true"
    >
      <motion.path
        d="M6 12.5l4 4 8-8"
        stroke="white"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{
          pathLength: { delay: 0.3, duration: 0.8, ease: EASE },
          opacity: { delay: 0.3, duration: 0.1 },
        }}
      />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Pulse ring
// ---------------------------------------------------------------------------

function PulseRing({ delay }: { delay: number }) {
  return (
    <motion.div
      className="absolute inset-0 rounded-full border-2 border-emerald-400"
      initial={{ scale: 1, opacity: 0.6 }}
      animate={{ scale: 2.5, opacity: 0 }}
      transition={{
        delay,
        duration: 0.8,
        ease: EASE,
      }}
    />
  );
}

// ---------------------------------------------------------------------------
// Status line items
// ---------------------------------------------------------------------------

type StatusItem = {
  text: string;
  delay: number;
};

const STATUS_ITEMS: StatusItem[] = [
  { text: "Consent recorded in database", delay: 0.8 },
  { text: "PDF document generated", delay: 1.3 },
  // Dynamics sync slot is handled separately (index 2)
  { text: "Audit log updated \u00b7 SHA-256 checksum verified", delay: 3.5 },
];

// ---------------------------------------------------------------------------
// Dynamics sync line with spinner → checkmark crossfade
// ---------------------------------------------------------------------------

function DynamicsSyncLine({ appearDelay }: { appearDelay: number }) {
  const [synced, setSynced] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const showTimer = setTimeout(() => setVisible(true), appearDelay * 1000);
    const syncTimer = setTimeout(() => setSynced(true), 3.0 * 1000);
    return () => {
      clearTimeout(showTimer);
      clearTimeout(syncTimer);
    };
  }, [appearDelay]);

  if (!visible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: EASE }}
    >
      <AnimatePresence mode="wait">
        {!synced ? (
          <motion.div
            key="syncing"
            className="flex items-center gap-2.5"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3, ease: EASE }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <RefreshCw className="h-[18px] w-[18px] text-slate-400" />
            </motion.div>
            <span className="text-sm text-slate-600 dark:text-slate-300">
              Syncing to Dynamics 365...
            </span>
          </motion.div>
        ) : (
          <motion.div
            key="synced"
            className="flex items-center gap-2.5"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
          >
            <CheckCircle className="h-[18px] w-[18px] text-emerald-500" />
            <span className="text-sm text-slate-600 dark:text-slate-300">
              Dynamics 365 synced
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Individual status line (non-sync items)
// ---------------------------------------------------------------------------

function StatusLine({ item }: { item: StatusItem }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), item.delay * 1000);
    return () => clearTimeout(timer);
  }, [item.delay]);

  if (!visible) return null;

  return (
    <motion.div
      className="flex items-center gap-2.5"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: EASE }}
    >
      <CheckCircle className="h-[18px] w-[18px] text-emerald-500" />
      <span className="text-sm text-slate-600 dark:text-slate-300">
        {item.text}
      </span>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function StepSuccess({ onReset }: { onReset: () => void }) {
  const [showButtons, setShowButtons] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowButtons(true), 4000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col items-center py-4">
      {/* ── Checkmark circle + pulse rings ─────────────────────────── */}
      <div className="relative flex items-center justify-center">
        {/* Pulse rings */}
        <PulseRing delay={0.3} />
        <PulseRing delay={0.55} />

        {/* Main circle */}
        <motion.div
          className="relative z-10 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/30 dark:shadow-slate-950/50"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 15,
          }}
        >
          <AnimatedCheckmark />
        </motion.div>
      </div>

      {/* ── Heading ────────────────────────────────────────────────── */}
      <motion.h2
        className="mt-8 font-serif text-2xl text-navy"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5, ease: EASE }}
      >
        Consent Captured Successfully
      </motion.h2>

      {/* ── Sequential status messages ─────────────────────────────── */}
      <div className="mt-6 flex flex-col gap-3">
        {/* Line 1: Consent recorded */}
        <StatusLine item={STATUS_ITEMS[0]} />

        {/* Line 2: PDF generated */}
        <StatusLine item={STATUS_ITEMS[1]} />

        {/* Line 3: Dynamics sync (with spinner → checkmark crossfade) */}
        <DynamicsSyncLine appearDelay={1.8} />

        {/* Line 4: Audit log */}
        <StatusLine item={STATUS_ITEMS[2]} />
      </div>

      {/* ── Action buttons ─────────────────────────────────────────── */}
      {showButtons && (
        <motion.div
          className="mt-8 flex items-center gap-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: EASE }}
        >
          <button
            type="button"
            className="cursor-pointer rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-5 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-200 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            View Consent Record
          </button>
          <button
            type="button"
            onClick={onReset}
            className="cursor-pointer rounded-lg bg-teal px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-teal-dark"
          >
            Capture Another
          </button>
        </motion.div>
      )}
    </div>
  );
}
