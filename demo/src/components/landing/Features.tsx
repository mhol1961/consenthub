"use client";

import { motion } from "framer-motion";
import {
  FileSignature,
  ArrowLeftRight,
  ShieldCheck,
  Smartphone,
  LayoutDashboard,
  Plug,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Data — each card gets a distinct icon tint                         */
/* ------------------------------------------------------------------ */

interface Feature {
  name: string;
  description: string;
  icon: LucideIcon;
  /** Tailwind classes for the icon container bg + icon color */
  iconBg: string;
  iconColor: string;
  /** Top accent bar + hover border color */
  accentColor: string;
  hoverBorder: string;
}

const features: Feature[] = [
  {
    name: "Consent Engine",
    description:
      "Digital signatures, customizable templates, multi-channel consent capture with legally-binding e-signatures.",
    icon: FileSignature,
    iconBg: "bg-teal-100 dark:bg-teal-900/50",
    iconColor: "text-teal-600 dark:text-teal-400",
    accentColor: "bg-teal-500",
    hoverBorder: "group-hover:border-teal-400 dark:group-hover:border-teal-600",
  },
  {
    name: "Dynamics 365 Integration",
    description:
      "Real-time bi-directional sync. Consent status flows to Dynamics, contact changes flow back.",
    icon: ArrowLeftRight,
    iconBg: "bg-blue-100 dark:bg-blue-900/50",
    iconColor: "text-blue-600 dark:text-blue-400",
    accentColor: "bg-blue-500",
    hoverBorder: "group-hover:border-blue-400 dark:group-hover:border-blue-600",
  },
  {
    name: "HIPAA Compliance",
    description:
      "Immutable audit trail with SHA-256 checksums. Every action logged, every change tracked.",
    icon: ShieldCheck,
    iconBg: "bg-emerald-100 dark:bg-emerald-900/50",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    accentColor: "bg-emerald-500",
    hoverBorder: "group-hover:border-emerald-400 dark:group-hover:border-emerald-600",
  },
  {
    name: "Patient Portal",
    description:
      "Self-service preference management. Patients control their own consent via secure magic links.",
    icon: Smartphone,
    iconBg: "bg-violet-100 dark:bg-violet-900/50",
    iconColor: "text-violet-600 dark:text-violet-400",
    accentColor: "bg-violet-500",
    hoverBorder: "group-hover:border-violet-400 dark:group-hover:border-violet-600",
  },
  {
    name: "Admin Dashboard",
    description:
      "Real-time metrics, compliance rates, expiring consents, and exportable reports at a glance.",
    icon: LayoutDashboard,
    iconBg: "bg-amber-100 dark:bg-amber-900/50",
    iconColor: "text-amber-600 dark:text-amber-400",
    accentColor: "bg-amber-500",
    hoverBorder: "group-hover:border-amber-400 dark:group-hover:border-amber-600",
  },
  {
    name: "Full API",
    description:
      "REST API, Power Automate connectors, Zapier, n8n. Integrate with your existing workflow tools.",
    icon: Plug,
    iconBg: "bg-indigo-100 dark:bg-indigo-900/50",
    iconColor: "text-indigo-600 dark:text-indigo-400",
    accentColor: "bg-indigo-500",
    hoverBorder: "group-hover:border-indigo-400 dark:group-hover:border-indigo-600",
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

const gridStagger = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const cardFadeUp = {
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

export default function Features() {
  return (
    <section id="features" className="bg-gradient-to-b from-slate-50 to-white py-24 dark:from-slate-900 dark:to-slate-950">
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
            Platform Features
          </p>
          <h2 className="mt-3 font-serif text-4xl font-bold text-navy md:text-5xl">
            Everything You Need for Compliant Consent
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-slate-500 dark:text-slate-400">
            Purpose-built for healthcare organizations using Microsoft
            Dynamics&nbsp;365
          </p>
        </motion.div>

        {/* Feature grid */}
        <motion.div
          variants={gridStagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8"
        >
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <motion.div
                key={feature.name}
                variants={cardFadeUp}
                className={`group relative cursor-default overflow-hidden rounded-xl border border-slate-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-900/5 dark:border-slate-700 dark:bg-slate-900 dark:hover:shadow-teal-950/10 ${feature.hoverBorder}`}
              >
                {/* Colored top accent bar */}
                <div className={`h-1 rounded-t-xl -mx-6 -mt-6 mb-6 ${feature.accentColor}`} />

                <div
                  className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl ${feature.iconBg}`}
                >
                  <Icon className={`h-6 w-6 ${feature.iconColor}`} />
                </div>

                <h3 className="mb-2 text-lg font-semibold text-navy">
                  {feature.name}
                </h3>

                <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
