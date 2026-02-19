"use client";

import { Mail, Smartphone, Phone, Send, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { StepProps } from "./ConsentWizard";
import type { LucideIcon } from "lucide-react";

// ---------------------------------------------------------------------------
// Channel definitions
// ---------------------------------------------------------------------------

type ChannelKey = "email" | "sms" | "phone" | "mail";

interface ChannelDef {
  key: ChannelKey;
  label: string;
  description: string;
  icon: LucideIcon;
}

const CHANNELS: ChannelDef[] = [
  {
    key: "email",
    label: "Email Marketing",
    description: "Newsletters, health tips, and promotional offers via email",
    icon: Mail,
  },
  {
    key: "sms",
    label: "SMS/Text Messages",
    description: "Appointment reminders and health alerts via text message",
    icon: Smartphone,
  },
  {
    key: "phone",
    label: "Phone Calls",
    description: "Direct phone calls for appointments and follow-ups",
    icon: Phone,
  },
  {
    key: "mail",
    label: "Direct Mail",
    description: "Physical mail for important documents and notices",
    icon: Send,
  },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function StepChannels({ data, onUpdate }: StepProps) {
  function toggle(key: ChannelKey) {
    onUpdate({
      channels: {
        ...data.channels,
        [key]: !data.channels[key],
      },
    });
  }

  return (
    <div>
      {/* Heading */}
      <h2 className="font-serif text-2xl text-navy">Communication Channels</h2>
      <p className="mt-1 text-sm text-slate-500">
        Select how the patient prefers to be contacted
      </p>

      {/* 2x2 grid */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {CHANNELS.map((channel) => {
          const Icon = channel.icon;
          const isSelected = data.channels[channel.key];

          return (
            <button
              key={channel.key}
              type="button"
              onClick={() => toggle(channel.key)}
              className={cn(
                "relative flex cursor-pointer flex-col items-start gap-3 rounded-xl border p-5 text-left transition-all duration-200",
                isSelected
                  ? "border-teal bg-teal/5 dark:bg-teal/10 ring-1 ring-teal"
                  : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800"
              )}
            >
              {/* Checkmark overlay */}
              {isSelected && (
                <div className="absolute right-2.5 top-2.5 flex h-5 w-5 items-center justify-center rounded-full bg-teal">
                  <Check className="h-3 w-3 text-white" strokeWidth={3} />
                </div>
              )}

              {/* Icon */}
              <div
                className={cn(
                  "flex h-12 w-12 items-center justify-center rounded-xl transition-colors duration-200",
                  isSelected
                    ? "bg-teal/10 dark:bg-teal/20"
                    : "bg-slate-100 dark:bg-slate-800"
                )}
              >
                <Icon
                  className={cn(
                    "h-6 w-6 transition-colors duration-200",
                    isSelected
                      ? "text-teal"
                      : "text-slate-400 dark:text-slate-500"
                  )}
                />
              </div>

              {/* Label */}
              <span
                className={cn(
                  "text-sm font-semibold transition-colors duration-200",
                  isSelected
                    ? "text-teal"
                    : "text-slate-600 dark:text-slate-300"
                )}
              >
                {channel.label}
              </span>

              {/* Description */}
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {channel.description}
              </span>
            </button>
          );
        })}
      </div>

      {/* Helper text */}
      <p className="mt-4 text-center text-xs text-slate-400 dark:text-slate-500">
        At least one channel is required
      </p>
    </div>
  );
}
