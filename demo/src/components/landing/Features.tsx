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
  /** Tailwind classes for the icon circle bg + icon color */
  iconBg: string;
  iconColor: string;
}

const features: Feature[] = [
  {
    name: "Consent Engine",
    description:
      "Digital signatures, customizable templates, multi-channel consent capture with legally-binding e-signatures.",
    icon: FileSignature,
    iconBg: "bg-teal/10 group-hover:bg-teal/15 dark:bg-teal/15 dark:group-hover:bg-teal/20",
    iconColor: "text-teal",
  },
  {
    name: "Dynamics 365 Integration",
    description:
      "Real-time bi-directional sync. Consent status flows to Dynamics, contact changes flow back.",
    icon: ArrowLeftRight,
    iconBg: "bg-indigo/10 group-hover:bg-indigo/15 dark:bg-indigo/15 dark:group-hover:bg-indigo/20",
    iconColor: "text-indigo",
  },
  {
    name: "HIPAA Compliance",
    description:
      "Immutable audit trail with SHA-256 checksums. Every action logged, every change tracked.",
    icon: ShieldCheck,
    iconBg: "bg-emerald-500/10 group-hover:bg-emerald-500/15 dark:bg-emerald-400/15 dark:group-hover:bg-emerald-400/20",
    iconColor: "text-emerald-600 dark:text-emerald-400",
  },
  {
    name: "Patient Portal",
    description:
      "Self-service preference management. Patients control their own consent via secure magic links.",
    icon: Smartphone,
    iconBg: "bg-sky-500/10 group-hover:bg-sky-500/15 dark:bg-sky-400/15 dark:group-hover:bg-sky-400/20",
    iconColor: "text-sky-600 dark:text-sky-400",
  },
  {
    name: "Admin Dashboard",
    description:
      "Real-time metrics, compliance rates, expiring consents, and exportable reports at a glance.",
    icon: LayoutDashboard,
    iconBg: "bg-amber-500/10 group-hover:bg-amber-500/15 dark:bg-amber-400/15 dark:group-hover:bg-amber-400/20",
    iconColor: "text-amber-600 dark:text-amber-400",
  },
  {
    name: "Full API",
    description:
      "REST API, Power Automate connectors, Zapier, n8n. Integrate with your existing workflow tools.",
    icon: Plug,
    iconBg: "bg-rose-500/10 group-hover:bg-rose-500/15 dark:bg-rose-400/15 dark:group-hover:bg-rose-400/20",
    iconColor: "text-rose-600 dark:text-rose-400",
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
    <section id="features" className="bg-white py-24 dark:bg-slate-900">
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
          <h2 className="mt-3 font-serif text-3xl text-navy sm:text-4xl">
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
                className="group cursor-default rounded-xl border border-slate-200 bg-white p-8 transition-all duration-300 hover:-translate-y-0.5 hover:border-teal/40 hover:shadow-lg hover:shadow-slate-900/5 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-teal/30 dark:hover:shadow-teal-950/10"
              >
                <div
                  className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl transition-colors duration-300 ${feature.iconBg}`}
                >
                  <Icon className={`h-6 w-6 ${feature.iconColor}`} />
                </div>

                <h3 className="mb-2 font-serif text-lg font-semibold text-navy">
                  {feature.name}
                </h3>

                <p className="text-[0.95rem] leading-relaxed text-slate-500 dark:text-slate-400">
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
