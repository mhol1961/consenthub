"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileSignature,
  ArrowLeftRight,
  ScrollText,
  Check,
  CheckCircle,
  ShieldCheck,
  RefreshCw,
  Pen,
  FileText,
  ArrowRight,
  Lock,
  Database,
  Globe,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const EASE: [number, number, number, number] = [0.17, 0.55, 0.55, 1];

const TABS = [
  { id: "consent", label: "Consent Capture", icon: FileSignature },
  { id: "sync", label: "Real-Time Sync", icon: ArrowLeftRight },
  { id: "audit", label: "Audit Trail", icon: ScrollText },
] as const;

type TabId = (typeof TABS)[number]["id"];

// ---------------------------------------------------------------------------
// Animation variants
// ---------------------------------------------------------------------------

const headerFade = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE },
  },
};

const tabContent = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: EASE } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2, ease: EASE } },
};

// ---------------------------------------------------------------------------
// Tab 1: Consent Capture Mini-Demo
// ---------------------------------------------------------------------------

const MINI_TEMPLATES = [
  { id: "hipaa", name: "HIPAA Treatment", badge: "HIPAA", badgeColor: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300" },
  { id: "gdpr", name: "GDPR Marketing", badge: "GDPR", badgeColor: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300" },
  { id: "tcpa", name: "TCPA Telemarketing", badge: "TCPA", badgeColor: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300" },
];

function ConsentCaptureDemo() {
  const [miniStep, setMiniStep] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [signed, setSigned] = useState(false);

  const handleSelect = useCallback((id: string) => {
    setSelected(id);
    setTimeout(() => setMiniStep(1), 600);
  }, []);

  const handleSign = useCallback(() => {
    setSigned(true);
    setTimeout(() => setMiniStep(2), 800);
  }, []);

  const handleReset = useCallback(() => {
    setMiniStep(0);
    setSelected(null);
    setSigned(false);
  }, []);

  return (
    <div className="p-4">
      <AnimatePresence mode="wait">
        {/* Step 0: Template Select */}
        {miniStep === 0 && (
          <motion.div key="select" {...tabContent}>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Step 1 — Select Template
            </p>
            <div className="grid grid-cols-3 gap-2">
              {MINI_TEMPLATES.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => handleSelect(t.id)}
                  className={cn(
                    "cursor-pointer rounded-lg border p-3 text-left transition-all duration-200",
                    selected === t.id
                      ? "border-teal bg-teal/5 ring-1 ring-teal dark:bg-teal/10"
                      : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:hover:border-slate-600"
                  )}
                >
                  <FileText className="mb-1.5 h-4 w-4 text-teal" />
                  <p className="text-[11px] font-semibold text-navy">{t.name}</p>
                  <span className={cn("mt-1.5 inline-block rounded-full px-2 py-0.5 text-[9px] font-semibold", t.badgeColor)}>
                    {t.badge}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Step 1: Signature */}
        {miniStep === 1 && (
          <motion.div key="sign" {...tabContent}>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Step 2 — Capture Signature
            </p>
            <div className="relative overflow-hidden rounded-lg border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
              <div className="flex min-h-[120px] items-center justify-center">
                {!signed ? (
                  <button
                    type="button"
                    onClick={handleSign}
                    className="flex cursor-pointer flex-col items-center gap-2 text-slate-400 transition-colors hover:text-teal dark:text-slate-500"
                  >
                    <Pen className="h-6 w-6" />
                    <span className="text-xs font-medium">Click to sign</span>
                  </button>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center justify-center px-6 py-4"
                  >
                    <svg viewBox="0 0 200 60" className="h-12 w-auto" aria-hidden="true">
                      <motion.path
                        d="M10,45 C20,20 35,15 50,30 S70,50 85,25 S110,10 130,35 S155,50 175,20 L190,25"
                        fill="none"
                        stroke="currentColor"
                        className="text-navy"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.8, ease: EASE }}
                      />
                    </svg>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 2: Success */}
        {miniStep === 2 && (
          <motion.div key="success" {...tabContent} className="flex flex-col items-center py-4">
            <motion.div
              className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
            >
              <motion.svg viewBox="0 0 24 24" fill="none" className="h-7 w-7" aria-hidden="true">
                <motion.path
                  d="M6 12.5l4 4 8-8"
                  stroke="white"
                  strokeWidth={2.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 0.3, duration: 0.5, ease: EASE }}
                />
              </motion.svg>
            </motion.div>
            <motion.p
              className="mt-3 font-serif text-lg text-navy"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.4, ease: EASE }}
            >
              Consent Captured
            </motion.p>
            <motion.div
              className="mt-2 space-y-1.5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              {["Recorded in database", "PDF generated", "Dynamics 365 synced"].map((text, i) => (
                <motion.div
                  key={text}
                  className="flex items-center gap-1.5"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + i * 0.3, duration: 0.3, ease: EASE }}
                >
                  <CheckCircle className="h-3 w-3 text-emerald-500" />
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">{text}</span>
                </motion.div>
              ))}
            </motion.div>
            <motion.button
              type="button"
              onClick={handleReset}
              className="mt-4 cursor-pointer rounded-lg bg-teal px-4 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-teal-dark"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.8 }}
            >
              Try Again
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Tab 2: Real-Time Sync Visualization
// ---------------------------------------------------------------------------

interface SyncPacket {
  id: number;
  direction: "right" | "left";
  label: string;
  delay: number;
}

const SYNC_PACKETS: SyncPacket[] = [
  { id: 1, direction: "right", label: "Consent Record", delay: 0.5 },
  { id: 2, direction: "right", label: "PDF Document", delay: 1.8 },
  { id: 3, direction: "left", label: "Contact Update", delay: 3.2 },
  { id: 4, direction: "right", label: "Audit Entry", delay: 4.5 },
  { id: 5, direction: "left", label: "Preference Change", delay: 5.8 },
];

function DataPacket({ packet, onDone }: { packet: SyncPacket; onDone: () => void }) {
  const isRight = packet.direction === "right";

  useEffect(() => {
    const timer = setTimeout(onDone, 1200);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <motion.div
      className="absolute top-1/2 flex -translate-y-1/2 items-center gap-1.5"
      initial={{ x: isRight ? 0 : "100%", opacity: 0 }}
      animate={{
        x: isRight ? [0, "100%", "100%"] : ["100%", 0, 0],
        opacity: [0, 1, 0],
      }}
      transition={{
        duration: 1.2,
        ease: EASE,
        times: [0, 0.8, 1],
      }}
    >
      <div className={cn(
        "rounded-md px-2 py-0.5 text-[9px] font-medium shadow-sm",
        isRight
          ? "bg-teal/10 text-teal border border-teal/20"
          : "bg-indigo/10 text-indigo border border-indigo/20"
      )}>
        {packet.label}
      </div>
      <ArrowRight className={cn("h-2.5 w-2.5", isRight ? "text-teal" : "rotate-180 text-indigo")} />
    </motion.div>
  );
}

function RealTimeSyncDemo() {
  const [activePackets, setActivePackets] = useState<number[]>([]);
  const [syncCount, setSyncCount] = useState(0);
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    SYNC_PACKETS.forEach((packet) => {
      const timer = setTimeout(() => {
        setActivePackets((prev) => [...prev, packet.id]);
      }, packet.delay * 1000);
      timers.push(timer);
    });

    // Reset cycle after all packets
    const resetTimer = setTimeout(() => {
      setActivePackets([]);
      setSyncCount(0);
      setCycle((c) => c + 1);
    }, 8000);
    timers.push(resetTimer);

    return () => timers.forEach(clearTimeout);
  }, [cycle]);

  const handlePacketDone = useCallback(() => {
    setSyncCount((c) => c + 1);
  }, []);

  return (
    <div className="p-4">
      {/* System endpoints */}
      <div className="flex items-center justify-between">
        {/* ConsentHub */}
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal/10 dark:bg-teal/20">
            <ShieldCheck className="h-5 w-5 text-teal" />
          </div>
          <div>
            <p className="text-xs font-semibold text-navy">ConsentHub</p>
            <p className="text-[10px] text-slate-400 dark:text-slate-500">Consent Engine</p>
          </div>
        </div>

        {/* Dynamics 365 */}
        <div className="flex items-center gap-2.5">
          <div className="text-right">
            <p className="text-xs font-semibold text-navy">Dynamics 365</p>
            <p className="text-[10px] text-slate-400 dark:text-slate-500">CRM Platform</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo/10 dark:bg-indigo/20">
            <Globe className="h-5 w-5 text-indigo" />
          </div>
        </div>
      </div>

      {/* Connection pipeline */}
      <div className="relative my-4 h-10">
        {/* Track line */}
        <div className="absolute left-12 right-12 top-1/2 h-px -translate-y-1/2 border-t-2 border-dashed border-slate-200 dark:border-slate-700" />

        {/* Animated packets */}
        <div className="absolute left-14 right-14 top-0 bottom-0">
          <AnimatePresence>
            {SYNC_PACKETS.filter((p) => activePackets.includes(p.id)).map((packet) => (
              <DataPacket key={`${cycle}-${packet.id}`} packet={packet} onDone={handlePacketDone} />
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Status bar */}
      <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-700 dark:bg-slate-800">
        <div className="flex items-center gap-2">
          <motion.div
            className="h-2 w-2 rounded-full bg-emerald-500"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <span className="text-[11px] font-medium text-slate-600 dark:text-slate-300">
            Bi-directional sync active
          </span>
        </div>
        <div className="flex items-center gap-3 text-[10px] text-slate-400 dark:text-slate-500">
          <span>{syncCount} synced</span>
          <span>&lt; 200ms latency</span>
        </div>
      </div>

      {/* Sync log */}
      <div className="mt-3 space-y-1">
        {SYNC_PACKETS.filter((p) => activePackets.includes(p.id)).slice(-3).map((p) => (
          <motion.div
            key={`${cycle}-log-${p.id}`}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="flex items-center justify-between text-[10px]"
          >
            <div className="flex items-center gap-1.5">
              <CheckCircle className="h-3 w-3 text-emerald-500" />
              <span className="text-slate-600 dark:text-slate-300">{p.label}</span>
            </div>
            <span className="text-slate-400 dark:text-slate-500">
              {p.direction === "right" ? "→ Dynamics" : "← ConsentHub"}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Tab 3: Audit Trail Demo
// ---------------------------------------------------------------------------

const AUDIT_ENTRIES = [
  { action: "Consent Granted", patient: "Sarah Mitchell", user: "Dr. Chen", type: "consent_granted", time: "2 min ago" },
  { action: "PDF Generated", patient: "Sarah Mitchell", user: "System", type: "pdf_generated", time: "2 min ago" },
  { action: "Dynamics Synced", patient: "Sarah Mitchell", user: "System", type: "dynamics_sync", time: "2 min ago" },
  { action: "Consent Revoked", patient: "James Rivera", user: "Portal", type: "consent_revoked", time: "15 min ago" },
  { action: "Template Updated", patient: "—", user: "Dr. Mitchell", type: "template_updated", time: "1 hr ago" },
];

const AUDIT_COLORS: Record<string, string> = {
  consent_granted: "text-teal bg-teal/10",
  pdf_generated: "text-blue-500 bg-blue-500/10",
  dynamics_sync: "text-indigo bg-indigo/10",
  consent_revoked: "text-red-400 bg-red-400/10",
  template_updated: "text-amber-500 bg-amber-500/10",
};

const AUDIT_ICONS: Record<string, typeof CheckCircle> = {
  consent_granted: CheckCircle,
  pdf_generated: FileText,
  dynamics_sync: RefreshCw,
  consent_revoked: Lock,
  template_updated: FileSignature,
};

function AuditTrailDemo() {
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const MOCK_HASH = "a3f7c9e2b1d4...8f2a";

  const handleVerify = useCallback(() => {
    setVerifying(true);
    setTimeout(() => {
      setVerifying(false);
      setVerified(true);
    }, 1500);
    setTimeout(() => setVerified(false), 5000);
  }, []);

  return (
    <div className="p-4">
      {/* Mini audit log */}
      <div className="rounded-lg border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
        <div className="border-b border-slate-100 px-3 py-2 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-navy">Immutable Audit Log</span>
            <div className="flex items-center gap-1">
              <Database className="h-3 w-3 text-slate-400" />
              <span className="text-[9px] text-slate-400 dark:text-slate-500">2,847 entries</span>
            </div>
          </div>
        </div>

        {AUDIT_ENTRIES.map((entry, i) => {
          const Icon = AUDIT_ICONS[entry.type] ?? CheckCircle;
          const color = AUDIT_COLORS[entry.type] ?? "text-slate-400 bg-slate-400/10";

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.15, duration: 0.3, ease: EASE }}
              className={cn(
                "flex items-center gap-2.5 px-3 py-2",
                i % 2 === 1 && "bg-slate-50/80 dark:bg-slate-800/30",
                i < AUDIT_ENTRIES.length - 1 && "border-b border-slate-100 dark:border-slate-800"
              )}
            >
              <div className={cn("flex h-5 w-5 shrink-0 items-center justify-center rounded-full", color)}>
                <Icon className="h-2.5 w-2.5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[11px] font-medium text-slate-700 dark:text-slate-200">
                  {entry.action} — {entry.patient}
                </p>
                <p className="text-[9px] text-slate-400 dark:text-slate-500">
                  {entry.user} · {entry.time}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Checksum verification */}
      <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock className="h-3.5 w-3.5 text-slate-400" />
            <span className="text-[11px] font-medium text-slate-600 dark:text-slate-300">
              SHA-256 Integrity Check
            </span>
          </div>
          <button
            type="button"
            onClick={handleVerify}
            disabled={verifying}
            className={cn(
              "cursor-pointer rounded-md px-2.5 py-1 text-[10px] font-semibold transition-colors",
              verified
                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400"
                : verifying
                  ? "bg-slate-100 text-slate-400 dark:bg-slate-700 dark:text-slate-500"
                  : "bg-teal/10 text-teal hover:bg-teal/20"
            )}
          >
            {verified ? "Verified" : verifying ? "Checking..." : "Verify"}
          </button>
        </div>

        <AnimatePresence mode="wait">
          {verifying && (
            <motion.div
              key="verifying"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-2 overflow-hidden"
            >
              <div className="flex items-center gap-2">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <RefreshCw className="h-3 w-3 text-teal" />
                </motion.div>
                <code className="text-[10px] text-slate-500 dark:text-slate-400">
                  Computing hash...
                </code>
              </div>
            </motion.div>
          )}
          {verified && (
            <motion.div
              key="verified"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-2 overflow-hidden"
            >
              <div className="flex items-center gap-2">
                <CheckCircle className="h-3 w-3 text-emerald-500" />
                <code className="text-[10px] text-emerald-600 dark:text-emerald-400">
                  {MOCK_HASH}
                </code>
              </div>
              <p className="mt-1 text-[9px] text-slate-400 dark:text-slate-500">
                All records verified — no tampering detected
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Browser Frame Wrapper
// ---------------------------------------------------------------------------

function BrowserFrame({ children, url }: { children: React.ReactNode; url: string }) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-xl shadow-slate-900/5 dark:border-slate-700/60 dark:bg-slate-900 dark:shadow-black/20">
      {/* Chrome */}
      <div className="flex items-center gap-2 border-b border-slate-200 bg-slate-100 px-3 py-2 dark:border-slate-700 dark:bg-slate-800">
        <div className="flex items-center gap-1.5">
          <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
          <div className="h-2.5 w-2.5 rounded-full bg-amber-400" />
          <div className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
        </div>
        <div className="mx-2 flex flex-1 items-center gap-2 rounded-md bg-white px-3 py-1 dark:bg-slate-900">
          <Lock className="h-2.5 w-2.5 text-emerald-500" />
          <span className="truncate text-[11px] text-slate-500 dark:text-slate-400">{url}</span>
        </div>
      </div>
      {/* Content */}
      {children}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Section
// ---------------------------------------------------------------------------

export default function InteractiveDemo() {
  const [activeTab, setActiveTab] = useState<TabId>("consent");

  return (
    <section className="bg-slate-50 py-24 dark:bg-slate-950/50">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <motion.div
          variants={headerFade}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="mx-auto mb-12 max-w-2xl text-center"
        >
          <p className="text-sm font-semibold uppercase tracking-widest text-teal">
            Try It Yourself
          </p>
          <h2 className="mt-3 font-serif text-3xl text-navy sm:text-4xl">
            See It In Action
          </h2>
          <p className="mt-4 text-lg text-slate-500 dark:text-slate-400">
            Click through real workflows — no signup required
          </p>
        </motion.div>

        {/* Tabbed interface */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.15 }}
          viewport={{ once: true, amount: 0.2 }}
          className="mx-auto max-w-3xl"
        >
          {/* Segmented control */}
          <div className="mb-6 flex justify-center">
            <div className="relative inline-flex rounded-xl border border-slate-200 bg-white p-1 dark:border-slate-700 dark:bg-slate-900">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "relative z-10 inline-flex cursor-pointer items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors duration-200",
                      isActive
                        ? "text-white"
                        : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                    )}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="demo-tab-active"
                        className="absolute inset-0 rounded-lg bg-teal shadow-sm"
                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10 flex items-center gap-2">
                      <Icon className="h-4 w-4" />
                      <span className="hidden sm:inline">{tab.label}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Browser frame with tab content */}
          <BrowserFrame
            url={
              activeTab === "consent"
                ? "app.consenthub.io/consent/capture"
                : activeTab === "sync"
                  ? "app.consenthub.io/dashboard/sync"
                  : "app.consenthub.io/audit"
            }
          >
            <div className="min-h-[320px] bg-slate-50/50 dark:bg-slate-900/50">
              <AnimatePresence mode="wait">
                {activeTab === "consent" && (
                  <motion.div key="consent" {...tabContent}>
                    <ConsentCaptureDemo />
                  </motion.div>
                )}
                {activeTab === "sync" && (
                  <motion.div key="sync" {...tabContent}>
                    <RealTimeSyncDemo />
                  </motion.div>
                )}
                {activeTab === "audit" && (
                  <motion.div key="audit" {...tabContent}>
                    <AuditTrailDemo />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </BrowserFrame>
        </motion.div>
      </div>
    </section>
  );
}
