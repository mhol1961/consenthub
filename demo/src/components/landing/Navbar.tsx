"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
] as const;

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const handleNavClick = useCallback(() => {
    setMobileOpen(false);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-4 left-4 right-4 z-50 mx-auto max-w-7xl rounded-2xl border transition-all duration-300",
        scrolled
          ? "border-slate-200/80 bg-white/95 shadow-lg shadow-slate-900/5 backdrop-blur-md dark:border-slate-700/80 dark:bg-slate-900/95 dark:shadow-none"
          : "border-slate-200/50 bg-white/80 shadow-md shadow-slate-900/5 backdrop-blur-md dark:border-slate-700/50 dark:bg-slate-900/80 dark:shadow-none"
      )}
    >
      <div className="flex h-16 items-center justify-between px-6">
        {/* Logo */}
        <Link
          href="/"
          className="group flex items-center transition-opacity duration-200 hover:opacity-80"
        >
          <Image
            src="/consenthub/logo-light.png"
            alt="ConsentHub"
            width={180}
            height={48}
            className="h-9 w-auto dark:hidden"
            priority
          />
          <Image
            src="/consenthub/logo-dark.png"
            alt="ConsentHub"
            width={180}
            height={48}
            className="hidden h-9 w-auto dark:block"
            priority
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="cursor-pointer rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition-colors duration-200 hover:bg-slate-100 hover:text-navy dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />
          <Button
            asChild
            className="cursor-pointer rounded-lg bg-teal px-5 text-sm font-semibold text-white transition-all duration-200 hover:bg-teal-dark hover:shadow-md"
          >
            <Link href="/demo/dashboard">See Demo</Link>
          </Button>
        </div>

        {/* Mobile Hamburger */}
        <button
          type="button"
          onClick={() => setMobileOpen((prev) => !prev)}
          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg text-slate-600 transition-colors duration-200 hover:bg-slate-100 hover:text-navy dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100 md:hidden"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
        >
          <div className="relative h-5 w-5">
            <Menu
              className={cn(
                "absolute inset-0 h-5 w-5 transition-all duration-200",
                mobileOpen ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"
              )}
            />
            <X
              className={cn(
                "absolute inset-0 h-5 w-5 transition-all duration-200",
                mobileOpen ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0"
              )}
            />
          </div>
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          "overflow-hidden transition-all duration-300 ease-in-out md:hidden",
          mobileOpen ? "max-h-72 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="border-t border-slate-200/80 px-6 pb-5 pt-3 dark:border-slate-700/80">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={handleNavClick}
                className="cursor-pointer rounded-lg px-4 py-3 text-sm font-medium text-slate-600 transition-colors duration-200 hover:bg-slate-100 hover:text-navy dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100"
              >
                {link.label}
              </a>
            ))}
          </div>
          <div className="mt-3 flex items-center justify-between gap-3 border-t border-slate-200/60 pt-3 dark:border-slate-700/60">
            <Button
              asChild
              className="flex-1 cursor-pointer rounded-lg bg-teal px-5 text-sm font-semibold text-white transition-all duration-200 hover:bg-teal-dark hover:shadow-md"
            >
              <Link href="/demo/dashboard" onClick={handleNavClick}>
                See Demo
              </Link>
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}
