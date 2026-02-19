"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  FileSignature,
  FileText,
  ScrollText,
  BarChart3,
  Settings,
  ArrowLeft,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", href: "/demo/dashboard", icon: LayoutDashboard },
  { label: "Patients", href: "/demo/patients", icon: Users },
  { label: "Consents", href: "/demo/consent", icon: FileSignature },
  { label: "Templates", href: "/demo/templates", icon: FileText },
  { label: "Audit Log", href: "/demo/audit", icon: ScrollText },
  { label: "Reports", href: "/demo/reports", icon: BarChart3 },
  { label: "Settings", href: "/demo/settings", icon: Settings },
] as const;

interface DemoSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export default function DemoSidebar({
  isOpen,
  onClose,
  collapsed,
  onToggleCollapse,
}: DemoSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 lg:hidden",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 flex h-full flex-col bg-slate-900 text-white transition-all duration-300 ease-in-out dark:bg-slate-950 lg:z-30 lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
          collapsed ? "lg:w-[4.5rem]" : "lg:w-64",
          "w-64"
        )}
      >
        {/* Logo area */}
        <div className="flex h-16 items-center justify-between px-5">
          <Link
            href="/demo/dashboard"
            className="group flex items-center transition-opacity duration-200 hover:opacity-80"
          >
            {collapsed ? (
              <div className="hidden h-8 w-8 rounded bg-teal lg:block" />
            ) : null}
            <Image
              src="/logo-dark.png"
              alt="ConsentHub"
              width={160}
              height={42}
              className={cn("h-8 w-auto", collapsed ? "lg:hidden" : "")}
              priority
            />
          </Link>

          {/* Mobile close button */}
          <button
            type="button"
            onClick={onClose}
            className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-lg text-slate-400 transition-colors duration-200 hover:bg-white/10 hover:text-white lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Demo mode badge */}
        {!collapsed && (
          <div className="px-5 pb-4">
            <span className="inline-flex items-center rounded-full bg-teal/20 px-2.5 py-0.5 text-xs font-medium text-teal-light">
              Demo Mode
            </span>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "relative flex items-center rounded-lg text-sm font-medium transition-all duration-200",
                  collapsed
                    ? "gap-3 px-3 py-2.5 lg:justify-center lg:gap-0 lg:px-2 lg:py-2.5"
                    : "gap-3 px-3 py-2.5",
                  isActive
                    ? "bg-white/10 font-semibold text-white"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                )}
                title={collapsed ? item.label : undefined}
              >
                {/* Animated active indicator */}
                {isActive && !collapsed && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute left-0 top-1 bottom-1 w-0.5 rounded-full bg-teal"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                <Icon className="h-5 w-5 shrink-0" />
                <span className={cn(collapsed && "lg:hidden")}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Collapse toggle button */}
        <div className="hidden border-t border-white/10 lg:block">
          <button
            type="button"
            onClick={onToggleCollapse}
            className="flex w-full cursor-pointer items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-400 transition-colors duration-200 hover:bg-white/5 hover:text-white"
          >
            {collapsed ? (
              <ChevronRight className="mx-auto h-5 w-5 shrink-0" />
            ) : (
              <>
                <ChevronLeft className="h-5 w-5 shrink-0" />
                <span>Collapse</span>
              </>
            )}
          </button>
        </div>

        {/* Back to site */}
        <div className="border-t border-white/10 p-3">
          <Link
            href="/"
            className={cn(
              "flex cursor-pointer items-center rounded-lg text-sm font-medium text-slate-400 transition-colors duration-200 hover:bg-white/5 hover:text-white",
              collapsed
                ? "gap-3 px-3 py-2.5 lg:justify-center lg:gap-0 lg:px-2 lg:py-2.5"
                : "gap-3 px-3 py-2.5"
            )}
            title={collapsed ? "Back to Site" : undefined}
          >
            <ArrowLeft className="h-5 w-5 shrink-0" />
            <span className={cn(collapsed && "lg:hidden")}>
              Back to Site
            </span>
          </Link>
        </div>
      </aside>
    </>
  );
}
