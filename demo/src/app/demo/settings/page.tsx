"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Building2,
  Shield,
  Bell,
  RefreshCw,
  Globe,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/lib/toast";

function Toggle({
  enabled,
  onChange,
}: {
  enabled: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      onClick={() => onChange(!enabled)}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200",
        enabled ? "bg-teal" : "bg-slate-200 dark:bg-slate-700"
      )}
    >
      <motion.span
        className="pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow"
        initial={false}
        animate={{ x: enabled ? 20 : 2 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
    </button>
  );
}

export default function SettingsPage() {
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [slackNotifs, setSlackNotifs] = useState(false);
  const [autoSync, setAutoSync] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    toast("Settings saved successfully");
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Organization */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal/10">
            <Building2 className="h-5 w-5 text-teal" />
          </div>
          <div>
            <h2 className="font-serif text-lg text-navy">Organization</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Manage your organization settings
            </p>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label htmlFor="org-name" className="mb-1 block text-xs font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Organization Name
            </label>
            <input
              id="org-name"
              type="text"
              defaultValue="TAS Health Partners"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none transition-colors focus:border-teal focus:ring-1 focus:ring-teal dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
            />
          </div>
          <div>
            <label htmlFor="dynamics-url" className="mb-1 block text-xs font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Dynamics 365 Org URL
            </label>
            <input
              id="dynamics-url"
              type="text"
              defaultValue="https://tashealth.crm.dynamics.com"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none transition-colors focus:border-teal focus:ring-1 focus:ring-teal dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
            />
          </div>
        </div>
      </div>

      {/* Compliance */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950">
            <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h2 className="font-serif text-lg text-navy">Compliance</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Regulatory compliance settings
            </p>
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3 dark:bg-slate-950">
            <div>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                HIPAA Compliance Mode
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Enforce audit logging and data encryption
              </p>
            </div>
            <Toggle enabled={true} onChange={() => {}} />
          </div>
          <div className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3 dark:bg-slate-950">
            <div>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                GDPR Data Processing
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Enable GDPR-specific consent workflows
              </p>
            </div>
            <Toggle enabled={true} onChange={() => {}} />
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 dark:bg-amber-950">
            <Bell className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <h2 className="font-serif text-lg text-navy">Notifications</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Configure alert preferences
            </p>
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3 dark:bg-slate-950">
            <div>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                Email Notifications
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Receive alerts for consent events
              </p>
            </div>
            <Toggle enabled={emailNotifs} onChange={setEmailNotifs} />
          </div>
          <div className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3 dark:bg-slate-950">
            <div>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                Slack Integration
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Post notifications to Slack channel
              </p>
            </div>
            <Toggle enabled={slackNotifs} onChange={setSlackNotifs} />
          </div>
        </div>
      </div>

      {/* Dynamics Sync */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50 dark:bg-purple-950">
            <RefreshCw className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h2 className="font-serif text-lg text-navy">Dynamics 365 Sync</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Configure CRM synchronization
            </p>
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3 dark:bg-slate-950">
            <div>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                Auto-Sync Enabled
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Automatically sync consent changes to Dynamics
              </p>
            </div>
            <Toggle enabled={autoSync} onChange={setAutoSync} />
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500">
            <Globe className="h-3.5 w-3.5" />
            Last sync: 2 minutes ago &middot; 1,247 records synced
          </div>
        </div>
      </div>

      {/* Save button */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          className={cn(
            "inline-flex cursor-pointer items-center gap-2 rounded-lg px-6 py-2.5 text-sm font-medium text-white transition-all",
            saved ? "bg-emerald-500" : "bg-teal hover:bg-teal/90"
          )}
        >
          {saved ? (
            <>
              <CheckCircle2 className="h-4 w-4" />
              Saved
            </>
          ) : (
            "Save Changes"
          )}
        </button>
      </div>
    </div>
  );
}
