"use client";

import { motion } from "framer-motion";
import { XCircle, CheckCircle } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const problems = [
  "Paper forms get lost, misfiled, or expire without notice",
  "Manual Dynamics entry creates data errors and compliance gaps",
  "No audit trail means failed HIPAA audits and real legal risk",
  "Patients can't manage their own preferences",
];

const solutions = [
  "Digital consent capture with legally-binding e-signatures",
  "Real-time bi-directional Dynamics 365 sync",
  "Immutable audit trail with SHA-256 checksums",
  "Self-service patient portal for preference management",
];

/* ------------------------------------------------------------------ */
/*  Variants                                                           */
/* ------------------------------------------------------------------ */

const headerFade = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.17, 0.55, 0.55, 1] as const },
  },
};

const cardLeft = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: [0.17, 0.55, 0.55, 1] as const },
  },
};

const cardRight = {
  hidden: { opacity: 0, x: 40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: [0.17, 0.55, 0.55, 1] as const },
  },
};

const bulletStagger = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const bulletItem = {
  hidden: { opacity: 0, x: -16 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: [0.17, 0.55, 0.55, 1] as const },
  },
};

const bulletItemRight = {
  hidden: { opacity: 0, x: 16 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: [0.17, 0.55, 0.55, 1] as const },
  },
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function ProblemSolution() {
  return (
    <section
      id="problem-solution"
      className="bg-slate-50 py-24 dark:bg-slate-900/50"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          variants={headerFade}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="mb-16 text-center"
        >
          <p className="text-sm font-semibold uppercase tracking-widest text-teal">
            Why ConsentHub
          </p>
          <h2 className="mt-3 font-serif text-4xl font-bold text-navy md:text-5xl">
            A Better Way to Manage Consent
          </h2>
        </motion.div>

        <div className="grid items-stretch gap-10 lg:grid-cols-[1fr_auto_1fr] lg:gap-6">
          {/* ---- Problem card ---- */}
          <motion.div
            variants={cardLeft}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="group relative overflow-hidden rounded-2xl border-2 border-red-200 bg-red-50 p-8 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg sm:p-10 dark:border-red-800 dark:bg-red-950/30"
          >
            {/* Top gradient accent */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-red-100/50 to-transparent dark:from-red-900/20 dark:to-transparent" />

            <div className="relative">
              {/* Label */}
              <div className="mb-6">
                <span className="inline-block px-3 py-1 bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
                  The Problem
                </span>
                <h3 className="font-serif text-2xl font-bold leading-snug text-navy sm:text-[1.7rem]">
                  Consent Management Is Broken
                </h3>
              </div>

              {/* Pain points */}
              <motion.ul
                variants={bulletStagger}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                className="space-y-5"
              >
                {problems.map((text, i) => (
                  <motion.li
                    key={i}
                    variants={bulletItem}
                    className="flex items-start gap-4"
                  >
                    <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500 dark:text-red-400" />
                    <span className="text-[0.95rem] leading-relaxed text-slate-600 dark:text-slate-300">
                      {text}
                    </span>
                  </motion.li>
                ))}
              </motion.ul>

              {/* Bottom accent line */}
              <div className="mt-8 h-1 w-full rounded-full bg-gradient-to-r from-red-400/60 via-red-300/30 to-transparent dark:from-red-600/40 dark:via-red-700/20 dark:to-transparent" />
            </div>
          </motion.div>

          {/* ---- Arrow divider (desktop only) ---- */}
          <div className="hidden items-center justify-center lg:flex">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-slate-200 bg-white text-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-500">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </div>
          </div>

          {/* ---- Solution card ---- */}
          <motion.div
            variants={cardRight}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="group relative overflow-hidden rounded-2xl border-2 border-teal-200 bg-teal-50 p-8 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg sm:p-10 dark:border-teal-800 dark:bg-teal-950/30"
          >
            {/* Top gradient accent */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-teal-100/50 to-transparent dark:from-teal-900/20 dark:to-transparent" />

            <div className="relative">
              {/* Label */}
              <div className="mb-6">
                <span className="inline-block px-3 py-1 bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
                  The Solution
                </span>
                <h3 className="font-serif text-2xl font-bold leading-snug text-navy sm:text-[1.7rem]">
                  ConsentHub Changes Everything
                </h3>
              </div>

              {/* Benefits */}
              <motion.ul
                variants={bulletStagger}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                className="space-y-5"
              >
                {solutions.map((text, i) => (
                  <motion.li
                    key={i}
                    variants={bulletItemRight}
                    className="flex items-start gap-4"
                  >
                    <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal-100 dark:bg-teal-900/50">
                      <CheckCircle className="h-5 w-5 text-teal-500 dark:text-teal-400" />
                    </div>
                    <span className="text-[0.95rem] leading-relaxed text-slate-600 dark:text-slate-300">
                      {text}
                    </span>
                  </motion.li>
                ))}
              </motion.ul>

              {/* Bottom accent line */}
              <div className="mt-8 h-1 w-full rounded-full bg-gradient-to-r from-teal-400/50 via-teal-300/20 to-transparent dark:from-teal-500/30 dark:via-teal-600/10 dark:to-transparent" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
