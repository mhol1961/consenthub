"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  BarChart3,
  Users,
  FileSignature,
  FileText,
  ScrollText,
  Settings,
  Bell,
  TrendingUp,
  CheckCircle,
  Clock,
  LayoutDashboard,
  ChevronDown,
  Search,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

/* ------------------------------------------------------------------ */
/*  Framer Motion variants                                            */
/* ------------------------------------------------------------------ */

const stagger = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.17, 0.55, 0.55, 1] as const },
  },
};

/* ------------------------------------------------------------------ */
/*  Browser-framed dashboard mockup — mirrors the real admin UI       */
/* ------------------------------------------------------------------ */

const SIDEBAR_NAV = [
  { icon: LayoutDashboard, active: true },
  { icon: Users, active: false },
  { icon: FileSignature, active: false },
  { icon: FileText, active: false },
  { icon: ScrollText, active: false },
  { icon: BarChart3, active: false },
  { icon: Settings, active: false },
];

const MOCK_METRICS = [
  { label: "Total Patients", value: "1,247", icon: Users, iconBg: "bg-blue-500/10", iconColor: "text-blue-500", trend: "+12%", trendType: "up" as const },
  { label: "Active Consents", value: "982", icon: FileSignature, iconBg: "bg-teal/10", iconColor: "text-teal", trend: "+8%", trendType: "up" as const },
  { label: "Pending Review", value: "43", icon: Clock, iconBg: "bg-amber-500/10", iconColor: "text-amber-500", trend: "5 expiring", trendType: "warning" as const },
  { label: "Compliance", value: "94.2%", icon: ShieldCheck, iconBg: "bg-emerald-500/10", iconColor: "text-emerald-500", trend: "+2.1%", trendType: "up" as const },
];

const MOCK_ACTIVITY = [
  { icon: CheckCircle, color: "text-teal bg-teal/10", text: "Dr. Mitchell captured HIPAA Treatment for Sarah M.", time: "2m" },
  { icon: TrendingUp, color: "text-blue-500 bg-blue-500/10", text: "Dynamics 365 sync: 12 records updated", time: "5m" },
  { icon: CheckCircle, color: "text-teal bg-teal/10", text: "Dr. Chen captured GDPR Marketing for James R.", time: "12m" },
];

/** Static SVG mini donut chart */
function MiniDonut() {
  const segments = [
    { pct: 42, color: "#0D9488" },
    { pct: 24, color: "#6366F1" },
    { pct: 18, color: "#3B82F6" },
    { pct: 16, color: "#F59E0B" },
  ];
  const r = 32;
  const c = 2 * Math.PI * r;
  let offset = 0;

  return (
    <svg viewBox="0 0 80 80" className="h-full w-full" aria-hidden="true">
      {segments.map((seg, i) => {
        const dash = (seg.pct / 100) * c;
        const currentOffset = offset;
        offset += dash;
        return (
          <circle
            key={i}
            cx="40"
            cy="40"
            r={r}
            fill="none"
            stroke={seg.color}
            strokeWidth="8"
            strokeDasharray={`${dash} ${c - dash}`}
            strokeDashoffset={-currentOffset}
            strokeLinecap="butt"
          />
        );
      })}
    </svg>
  );
}

function DashboardMockup() {
  return (
    <div className="hero-dashboard-float relative w-full max-w-[640px]">
      {/* Ambient glow (enhanced via CSS class) */}
      <div className="absolute -inset-10 rounded-3xl bg-teal/15 blur-3xl dark:bg-teal/10" />

      {/* Teal glow beneath mockup */}
      <div className="absolute -bottom-4 left-1/4 right-1/4 h-8 bg-teal-500/20 blur-2xl rounded-full" />

      {/* Browser frame */}
      <div className="hero-dashboard-glow relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white dark:border-slate-700/60 dark:bg-slate-900">
        {/* ── Browser chrome ────────────────────────────────────────── */}
        <div className="flex items-center gap-2 border-b border-slate-200 bg-slate-100 px-4 py-3 dark:border-slate-700 dark:bg-slate-800">
          {/* Traffic lights */}
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
            <div className="h-2.5 w-2.5 rounded-full bg-amber-400" />
            <div className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
          </div>
          {/* URL bar */}
          <div className="mx-2 flex flex-1 items-center gap-2 rounded-md bg-white px-3 py-1 dark:bg-slate-900">
            <svg viewBox="0 0 16 16" className="h-3 w-3 shrink-0 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <circle cx="8" cy="8" r="6" />
              <path d="M8 2a8 8 0 0 1 0 12M8 2a8 8 0 0 0 0 12M2 8h12" />
            </svg>
            <span className="truncate text-[11px] text-slate-500 dark:text-slate-400">
              app.consenthub.io/dashboard
            </span>
          </div>
        </div>

        {/* ── App chrome (sidebar + main) ───────────────────────────── */}
        <div className="flex">
          {/* Sidebar */}
          <div className="hidden w-12 shrink-0 flex-col items-center border-r border-slate-800 bg-slate-900 py-2.5 sm:flex dark:border-slate-700 dark:bg-slate-950">
            {/* Logo */}
            <div className="mb-3 h-5 w-5 rounded bg-teal" />
            {/* Nav icons */}
            <div className="flex flex-col items-center gap-1">
              {SIDEBAR_NAV.map((item, i) => {
                const Icon = item.icon;
                return (
                  <div
                    key={i}
                    className={`flex h-7 w-7 items-center justify-center rounded-md ${
                      item.active
                        ? "bg-white/10 text-white"
                        : "text-slate-500 hover:text-slate-300"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1 overflow-hidden bg-slate-50 dark:bg-slate-900/50">
            {/* Header bar */}
            <div className="flex items-center justify-between border-b border-slate-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900">
              <span className="text-[11px] font-semibold text-navy">Dashboard</span>
              <div className="flex items-center gap-1.5">
                <div className="relative flex h-5 w-5 items-center justify-center rounded-md text-slate-400 dark:text-slate-500">
                  <Bell className="h-3 w-3" />
                  <div className="absolute -right-0.5 -top-0.5 h-1.5 w-1.5 rounded-full bg-red-500" />
                </div>
                <div className="hidden items-center gap-1 rounded bg-slate-50 px-1.5 py-0.5 sm:flex dark:bg-slate-800">
                  <Building2 className="h-2.5 w-2.5 text-slate-400" />
                  <span className="text-[9px] text-slate-500 dark:text-slate-400">TAS Health</span>
                </div>
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-teal text-[8px] font-bold text-white">
                  CJ
                </div>
              </div>
            </div>

            {/* Dashboard body */}
            <div className="p-3">
              {/* Metric cards */}
              <div className="mb-3 grid grid-cols-4 gap-2">
                {MOCK_METRICS.map((m) => {
                  const Icon = m.icon;
                  return (
                    <div
                      key={m.label}
                      className="rounded-lg border border-slate-200 bg-white p-2 dark:border-slate-700 dark:bg-slate-900"
                    >
                      <div className={`mb-1 flex h-5 w-5 items-center justify-center rounded-md ${m.iconBg}`}>
                        <Icon className={`h-2.5 w-2.5 ${m.iconColor}`} />
                      </div>
                      <span className="block text-[11px] font-bold text-slate-900 dark:text-slate-100">
                        {m.value}
                      </span>
                      <span className="text-[8px] leading-none text-slate-400 dark:text-slate-500">
                        {m.label}
                      </span>
                      <div className="mt-1">
                        <span className={`inline-flex items-center gap-0.5 rounded-full px-1 py-px text-[7px] font-medium ${
                          m.trendType === "up"
                            ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
                            : "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400"
                        }`}>
                          {m.trendType === "up" && <TrendingUp className="h-1.5 w-1.5" />}
                          {m.trend}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Charts row */}
              <div className="mb-3 grid grid-cols-2 gap-2">
                {/* Donut chart */}
                <div className="rounded-lg border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
                  <div className="border-b border-slate-100 px-2.5 py-1.5 dark:border-slate-800">
                    <span className="text-[9px] font-semibold text-navy">Consents by Type</span>
                  </div>
                  <div className="flex items-center justify-center px-2 py-2">
                    <div className="relative h-16 w-16">
                      <MiniDonut />
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-[10px] font-bold text-navy">2,847</span>
                        <span className="text-[7px] text-slate-400">Total</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap justify-center gap-x-2 gap-y-0.5 px-2 pb-2">
                    {[
                      { color: "#0D9488", label: "Treatment" },
                      { color: "#6366F1", label: "Marketing" },
                      { color: "#3B82F6", label: "Data" },
                      { color: "#F59E0B", label: "Research" },
                    ].map((l) => (
                      <div key={l.label} className="flex items-center gap-1">
                        <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: l.color }} />
                        <span className="text-[7px] text-slate-500 dark:text-slate-400">{l.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Line chart */}
                <div className="rounded-lg border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
                  <div className="border-b border-slate-100 px-2.5 py-1.5 dark:border-slate-800">
                    <span className="text-[9px] font-semibold text-navy">Monthly Trend</span>
                  </div>
                  <div className="px-2 py-2">
                    <svg viewBox="0 0 160 60" className="w-full" aria-hidden="true">
                      {/* Grid lines */}
                      {[15, 30, 45].map((y) => (
                        <line key={y} x1="0" y1={y} x2="160" y2={y} stroke="currentColor" strokeWidth="0.5" className="text-slate-200 dark:text-slate-700" strokeDasharray="2 2" />
                      ))}
                      {/* Teal line — consents */}
                      <polyline
                        points="0,45 20,40 40,38 60,30 80,28 100,22 120,18 140,12 160,8"
                        fill="none"
                        stroke="#0D9488"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      {/* Red line — revocations */}
                      <polyline
                        points="0,50 20,48 40,52 60,47 80,50 100,48 120,51 140,46 160,49"
                        fill="none"
                        stroke="#EF4444"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      {/* Teal area fill */}
                      <path
                        d="M0,45 20,40 40,38 60,30 80,28 100,22 120,18 140,12 160,8 L160,60 L0,60 Z"
                        fill="#0D9488"
                        fillOpacity="0.06"
                      />
                      {/* Dots on teal line */}
                      {[[0,45],[40,38],[80,28],[120,18],[160,8]].map(([cx, cy], i) => (
                        <circle key={i} cx={cx} cy={cy} r="2" fill="#0D9488" />
                      ))}
                    </svg>
                  </div>
                  <div className="flex items-center justify-center gap-3 px-2 pb-2">
                    <div className="flex items-center gap-1">
                      <div className="h-1.5 w-1.5 rounded-full bg-teal" />
                      <span className="text-[7px] text-slate-500 dark:text-slate-400">Consents</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="h-1.5 w-1.5 rounded-full bg-red-500" />
                      <span className="text-[7px] text-slate-500 dark:text-slate-400">Revocations</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Activity feed */}
              <div className="rounded-lg border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
                <div className="border-b border-slate-100 px-2.5 py-1.5 dark:border-slate-800">
                  <span className="text-[9px] font-semibold text-navy">Recent Activity</span>
                </div>
                <div>
                  {MOCK_ACTIVITY.map((row, i) => {
                    const Icon = row.icon;
                    return (
                      <div
                        key={i}
                        className={`flex items-center gap-2 px-2.5 py-1.5 ${
                          i % 2 === 1 ? "bg-slate-50/80 dark:bg-slate-800/30" : ""
                        }`}
                      >
                        <div className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${row.color}`}>
                          <Icon className="h-2 w-2" />
                        </div>
                        <span className="flex-1 truncate text-[9px] text-slate-600 dark:text-slate-300">
                          {row.text}
                        </span>
                        <span className="shrink-0 text-[8px] text-slate-400 dark:text-slate-500">
                          {row.time}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Hero section                                                       */
/* ------------------------------------------------------------------ */

export default function Hero() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden pt-24">
      {/* ---- Gradient mesh background ---- */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Orb 1 — teal, top-left */}
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-teal-400 opacity-20 blur-[128px] animate-pulse" />
        {/* Orb 2 — indigo, bottom-right */}
        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-indigo-500 opacity-15 blur-[128px] animate-pulse" style={{ animationDelay: '2s' }} />
        {/* Orb 3 — sky, center */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-sky-400 opacity-10 blur-[100px] animate-pulse" style={{ animationDelay: '4s' }} />
      </div>

      {/* ---- Content ---- */}
      <div className="relative mx-auto w-full max-w-7xl px-6 py-12 lg:px-8 lg:py-20">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          {/* ---- Left: Text content ---- */}
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="max-w-2xl"
          >
            {/* 1. Trust badge */}
            <motion.div variants={fadeUp}>
              <span className="inline-flex items-center gap-2 rounded-full border border-teal/30 bg-gradient-to-r from-teal/10 to-indigo/10 px-4 py-2 text-sm font-semibold text-teal shadow-sm dark:border-teal/40 dark:from-teal/15 dark:to-indigo/15">
                <ShieldCheck className="h-4 w-4" />
                HIPAA Compliant · SOC 2 Type II
              </span>
            </motion.div>

            {/* 2. Headline */}
            <motion.h1
              variants={fadeUp}
              className="mt-6 font-serif text-4xl leading-[1.12] text-navy sm:text-5xl md:text-6xl lg:text-7xl"
            >
              Patient Consent Management,{" "}
              <span className="text-teal">Built for Dynamics&nbsp;365</span>
            </motion.h1>

            {/* 3. Subheadline */}
            <motion.p
              variants={fadeUp}
              className="mt-6 max-w-xl text-lg leading-relaxed text-slate-600 md:text-xl dark:text-slate-300"
            >
              HIPAA-compliant consent capture, real-time CRM sync, and immutable
              audit trails&nbsp;&mdash; at a fraction of enterprise pricing.
            </motion.p>

            {/* 4. Dual CTAs */}
            <motion.div
              variants={fadeUp}
              className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4"
            >
              <Button
                asChild
                size="lg"
                className="cursor-pointer rounded-xl bg-gradient-to-r from-teal-dark to-teal px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-teal/25 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-teal/30"
              >
                <Link href="/demo/dashboard">See Demo</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="cursor-pointer rounded-xl border-2 border-slate-300 px-8 py-4 text-lg font-semibold text-navy transition-all duration-200 hover:-translate-y-0.5 hover:border-teal hover:bg-teal/5 hover:text-teal dark:border-slate-500 dark:text-slate-200 dark:hover:border-teal dark:hover:bg-teal/10 dark:hover:text-teal-light"
              >
                <a href="#pricing">View Pricing</a>
              </Button>
            </motion.div>

            {/* 5. Social proof strip */}
            <motion.p
              variants={fadeUp}
              className="mt-10 text-sm font-medium text-slate-400 dark:text-slate-500"
            >
              Trusted by healthcare organizations across the U.S.
            </motion.p>
            <motion.div
              variants={fadeUp}
              className="mt-4 flex flex-wrap items-center gap-3"
            >
              {["Health System", "Medical Group", "Regional Hospital", "Care Network", "University Health"].map((name) => (
                <div
                  key={name}
                  className="rounded-lg bg-slate-200/60 px-4 py-2 text-xs font-medium text-slate-400 dark:bg-slate-800/60 dark:text-slate-500"
                >
                  {name}
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* ---- Right: Dashboard mockup (desktop) ---- */}
          <motion.div
            initial={{ opacity: 0, x: 40, scale: 0.97 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            transition={{
              duration: 1,
              ease: [0.17, 0.55, 0.55, 1] as const,
              delay: 0.3,
            }}
            viewport={{ once: true }}
            className="hidden justify-center lg:flex"
          >
            <DashboardMockup />
          </motion.div>

          {/* ---- Right: Dashboard mockup (mobile — simplified) ---- */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex justify-center lg:hidden"
          >
            <DashboardMockup />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
