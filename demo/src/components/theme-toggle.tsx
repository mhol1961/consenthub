"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Monitor } from "lucide-react";
import { cn } from "@/lib/utils";

const modes = [
  { key: "light", label: "Light", Icon: Sun },
  { key: "dark", label: "Dark", Icon: Moon },
  { key: "system", label: "System", Icon: Monitor },
] as const;

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch — render nothing until client mounts
  useEffect(() => setMounted(true), []);
  if (!mounted) {
    return <div className="h-9 w-9" aria-hidden="true" />;
  }

  return (
    <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50 p-0.5 dark:border-slate-700 dark:bg-slate-800">
      {modes.map(({ key, label, Icon }) => (
        <button
          key={key}
          type="button"
          onClick={() => setTheme(key)}
          className={cn(
            "flex h-8 w-8 cursor-pointer items-center justify-center rounded-md transition-all duration-200",
            theme === key
              ? "bg-white text-navy shadow-sm dark:bg-slate-700 dark:text-slate-100"
              : "text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
          )}
          aria-label={`Switch to ${label} mode`}
          title={label}
        >
          <Icon className="h-4 w-4" />
        </button>
      ))}
    </div>
  );
}
