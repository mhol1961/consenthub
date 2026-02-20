"use client";

import { motion } from "framer-motion";
import { Monitor, PenTool, Zap } from "lucide-react";
import type { LucideIcon } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

interface Step {
  number: number;
  icon: LucideIcon;
  title: string;
  description: string;
}

const steps: Step[] = [
  {
    number: 1,
    icon: Monitor,
    title: "Open Contact in Dynamics",
    description:
      "Staff opens a patient contact record. ConsentHub panel loads automatically, showing consent status at a glance.",
  },
  {
    number: 2,
    icon: PenTool,
    title: "Patient Signs Consent",
    description:
      "Select a template, hand the tablet to the patient. They review, sign on the touchscreen, and tap 'I Agree'.",
  },
  {
    number: 3,
    icon: Zap,
    title: "Instant Sync & Audit",
    description:
      "Consent syncs to Dynamics in real-time. PDF generated, audit trail recorded with SHA-256 checksum.",
  },
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

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.2 } },
};

const stepFade = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.17, 0.55, 0.55, 1] as const },
  },
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-slate-50 py-24 dark:bg-slate-900/50">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <motion.div
          variants={headerFade}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="mx-auto mb-16 max-w-2xl text-center"
        >
          <p className="text-sm font-semibold uppercase tracking-widest text-teal">
            Simple Process
          </p>
          <h2 className="mt-3 font-serif text-4xl font-bold text-navy md:text-5xl">
            How It Works
          </h2>
          <p className="mt-4 text-lg text-slate-500 dark:text-slate-400">
            From Dynamics 365 to signed consent in under two minutes
          </p>
        </motion.div>

        {/* Steps */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="relative mx-auto max-w-4xl"
        >
          {/* ---- Connecting line (desktop: horizontal, mobile: vertical) ---- */}
          {/* Desktop horizontal dashed line — sits behind the badges */}
          <div
            className="pointer-events-none absolute left-[calc(16.67%+32px)] right-[calc(16.67%+32px)] top-[32px] hidden border-t-2 border-dashed border-teal-300 lg:block dark:border-teal-800"
            aria-hidden="true"
          />
          {/* Mobile vertical dashed line — centered on 64px badge (left-8 = 32px) */}
          <div
            className="pointer-events-none absolute bottom-8 left-8 top-8 border-l-2 border-dashed border-teal-300 lg:hidden dark:border-teal-800"
            aria-hidden="true"
          />

          {/* Steps grid */}
          <div className="relative grid items-stretch gap-12 lg:grid-cols-3 lg:gap-8">
            {steps.map((step) => {
              const Icon = step.icon;

              return (
                <motion.div
                  key={step.number}
                  variants={stepFade}
                  className="flex gap-5 lg:flex-col lg:items-center lg:text-center lg:h-full"
                >
                  {/* Number badge — large with ring */}
                  <div className="relative z-10 flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-teal-600 text-2xl font-bold text-white shadow-lg shadow-teal/25 ring-4 ring-teal-100 dark:ring-teal-900">
                    {step.number}
                  </div>

                  {/* Step card */}
                  <div className="flex-1 rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md lg:mt-4 dark:border-slate-700 dark:bg-slate-900">
                    {/* Icon */}
                    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 dark:bg-teal-900/30">
                      <Icon
                        className="h-8 w-8 text-teal-500"
                        strokeWidth={1.5}
                      />
                    </div>

                    {/* Title */}
                    <h3 className="mb-2 font-serif text-xl font-semibold text-navy">
                      {step.title}
                    </h3>

                    {/* Description */}
                    <p className="max-w-xs text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
