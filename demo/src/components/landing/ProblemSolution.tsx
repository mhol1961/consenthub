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
      className="bg-slate-50 py-24 dark:bg-slate-950"
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
          <h2 className="mt-3 font-serif text-3xl text-navy sm:text-4xl">
            A Better Way to Manage Consent
          </h2>
        </motion.div>

        <div className="grid gap-10 lg:grid-cols-2 lg:gap-8">
          {/* ---- Problem card ---- */}
          <motion.div
            variants={cardLeft}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="group rounded-2xl border border-red-200/60 bg-rose-50/60 p-8 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md sm:p-10 dark:border-red-900/30 dark:bg-red-950/20 dark:shadow-none dark:hover:border-red-900/50 dark:hover:shadow-lg dark:hover:shadow-red-950/10"
          >
            {/* Label */}
            <div className="mb-6">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-red-100/80 px-4 py-1.5 dark:bg-red-950/50">
                <span className="h-2 w-2 rounded-full bg-red-400" />
                <span className="text-xs font-semibold uppercase tracking-wider text-red-600 dark:text-red-400">
                  The Problem
                </span>
              </div>
              <h3 className="font-serif text-2xl leading-snug text-navy sm:text-[1.7rem]">
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
                  <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-950/50">
                    <XCircle className="h-[18px] w-[18px] text-red-500 dark:text-red-400" />
                  </div>
                  <span className="text-[0.95rem] leading-relaxed text-slate-600 dark:text-slate-300">
                    {text}
                  </span>
                </motion.li>
              ))}
            </motion.ul>

            {/* Bottom accent line */}
            <div className="mt-8 h-1 w-full rounded-full bg-gradient-to-r from-red-300/60 via-red-200/30 to-transparent dark:from-red-700/40 dark:via-red-800/20 dark:to-transparent" />
          </motion.div>

          {/* ---- Solution card ---- */}
          <motion.div
            variants={cardRight}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="group rounded-2xl border border-teal/20 bg-teal-50/50 p-8 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md sm:p-10 dark:border-teal/15 dark:bg-teal-950/20 dark:shadow-none dark:hover:border-teal/30 dark:hover:shadow-lg dark:hover:shadow-teal-950/10"
          >
            {/* Label */}
            <div className="mb-6">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-teal/10 px-4 py-1.5 dark:bg-teal-950/50">
                <span className="h-2 w-2 rounded-full bg-teal" />
                <span className="text-xs font-semibold uppercase tracking-wider text-teal dark:text-teal-light">
                  The Solution
                </span>
              </div>
              <h3 className="font-serif text-2xl leading-snug text-navy sm:text-[1.7rem]">
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
                  <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-teal/10 dark:bg-teal-950/50">
                    <CheckCircle className="h-[18px] w-[18px] text-teal dark:text-teal-light" />
                  </div>
                  <span className="text-[0.95rem] leading-relaxed text-slate-600 dark:text-slate-300">
                    {text}
                  </span>
                </motion.li>
              ))}
            </motion.ul>

            {/* Bottom accent line */}
            <div className="mt-8 h-1 w-full rounded-full bg-gradient-to-r from-teal/40 via-teal/15 to-transparent dark:from-teal/30 dark:via-teal/10 dark:to-transparent" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
