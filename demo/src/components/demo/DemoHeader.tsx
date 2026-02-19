"use client";

import Link from "next/link";
import { Menu, Building2, Bell, ChevronDown, ChevronRight } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

interface DemoHeaderProps {
  title: string;
  onMenuToggle: () => void;
  collapsed: boolean;
}

export default function DemoHeader({
  title,
  onMenuToggle,
  collapsed,
}: DemoHeaderProps) {
  return (
    <header className="sticky top-0 z-40">
      {/* Main header row */}
      <div className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 dark:border-slate-700 dark:bg-slate-900 lg:px-8">
        {/* Left side */}
        <div className="flex items-center gap-3">
          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={onMenuToggle}
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg text-slate-600 transition-colors duration-200 hover:bg-slate-100 hover:text-navy dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100 lg:hidden"
            aria-label="Toggle sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Page title */}
          <h1 className="font-serif text-xl text-navy">{title}</h1>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Theme toggle */}
          <ThemeToggle />

          {/* Notification bell */}
          <button
            type="button"
            className="relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg transition-colors duration-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5 text-slate-500 dark:text-slate-400" />
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
              3
            </span>
          </button>

          {/* Organization badge */}
          <div className="hidden items-center gap-2 rounded-lg bg-slate-50 px-3 py-1.5 text-sm text-slate-600 dark:bg-slate-800 dark:text-slate-300 sm:flex">
            <Building2 className="h-4 w-4 text-slate-400 dark:text-slate-500" />
            <span className="font-medium">TAS Health Partners</span>
          </div>

          {/* User avatar */}
          <div className="flex cursor-pointer items-center gap-1.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-teal text-sm font-semibold text-white transition-opacity duration-150 hover:opacity-90">
              CJ
            </div>
            <ChevronDown className="h-4 w-4 text-slate-400" />
          </div>
        </div>
      </div>

      {/* Breadcrumb row */}
      <div className="border-b border-slate-100 bg-slate-50/50 px-4 py-2 dark:border-slate-800 dark:bg-slate-900/50 lg:px-8">
        <div className="flex items-center gap-1.5 text-sm">
          <Link
            href="/demo/dashboard"
            className="text-slate-500 transition-colors duration-200 hover:text-slate-700 dark:text-slate-400"
          >
            Demo
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
          <span className="font-medium text-slate-900 dark:text-slate-100">
            {title}
          </span>
        </div>
      </div>
    </header>
  );
}
