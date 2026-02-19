"use client";

import { useState, useCallback } from "react";
import { usePathname } from "next/navigation";
import DemoSidebar from "@/components/demo/DemoSidebar";
import DemoHeader from "@/components/demo/DemoHeader";
import Toaster from "@/components/ui/Toaster";
import { cn } from "@/lib/utils";

const pageTitles: Record<string, string> = {
  "/demo/dashboard": "Dashboard",
  "/demo/patients": "Patients",
  "/demo/consent": "Capture Consent",
  "/demo/templates": "Templates",
  "/demo/audit": "Audit Log",
  "/demo/reports": "Reports",
  "/demo/settings": "Settings",
  "/demo/architecture": "Architecture",
};

function resolveTitle(pathname: string): string {
  // Exact match first
  if (pageTitles[pathname]) return pageTitles[pathname];

  // Dynamic route patterns
  if (pathname.startsWith("/demo/patients/")) return "Patient Details";

  return "ConsentHub";
}

export default function DemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const pathname = usePathname();

  const title = resolveTitle(pathname);

  const handleMenuToggle = useCallback(() => {
    setSidebarOpen((prev) => !prev);
  }, []);

  const handleSidebarClose = useCallback(() => {
    setSidebarOpen(false);
  }, []);

  const handleToggleCollapse = useCallback(() => {
    setSidebarCollapsed((prev) => !prev);
  }, []);

  // Portal uses its own layout — skip admin sidebar/header
  if (pathname.startsWith("/demo/portal")) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-background">
      {/* Sidebar */}
      <DemoSidebar
        isOpen={sidebarOpen}
        onClose={handleSidebarClose}
        collapsed={sidebarCollapsed}
        onToggleCollapse={handleToggleCollapse}
      />

      {/* Main content area */}
      <div
        className={cn(
          "transition-all duration-300",
          sidebarCollapsed ? "lg:ml-[4.5rem]" : "lg:ml-64"
        )}
      >
        {/* Header */}
        <DemoHeader
          title={title}
          onMenuToggle={handleMenuToggle}
          collapsed={sidebarCollapsed}
        />

        {/* Page content */}
        <main className="p-6 lg:p-8">{children}</main>
      </div>

      {/* Toast notifications */}
      <Toaster />
    </div>
  );
}
