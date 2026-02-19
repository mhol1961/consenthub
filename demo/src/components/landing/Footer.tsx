import Link from "next/link";
import Image from "next/image";
import {
  ShieldCheck,
  Lock,
  Globe,
  KeyRound,
  Linkedin,
  Twitter,
  Github,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const productLinks = [
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "Demo", href: "/demo/dashboard" },
  { label: "API Docs", href: "#" },
  { label: "Integrations", href: "#" },
];

const complianceLinks = [
  { label: "HIPAA", href: "#" },
  { label: "GDPR", href: "#" },
  { label: "SOC 2", href: "#" },
  { label: "CCPA", href: "#" },
  { label: "Security", href: "#" },
];

const companyLinks = [
  { label: "About", href: "#" },
  { label: "Blog", href: "#" },
  { label: "Careers", href: "#" },
  { label: "Contact", href: "#" },
  { label: "Partners", href: "#" },
];

const complianceBadges = [
  { label: "HIPAA Compliant", icon: ShieldCheck },
  { label: "SOC 2 Type II", icon: Lock },
  { label: "GDPR Ready", icon: Globe },
  { label: "256-bit Encryption", icon: KeyRound },
] as const;

const socialLinks = [
  { label: "LinkedIn", icon: Linkedin, href: "#" },
  { label: "Twitter", icon: Twitter, href: "#" },
  { label: "GitHub", icon: Github, href: "#" },
] as const;

const legalLinks = [
  { label: "Privacy Policy", href: "#" },
  { label: "Terms of Service", href: "#" },
  { label: "Cookie Policy", href: "#" },
] as const;

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function FooterLinkColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
        {title}
      </h3>
      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link.label}>
            {link.href.startsWith("/") ? (
              <Link
                href={link.href}
                className="text-sm text-slate-400 transition-colors duration-200 hover:text-teal-light"
              >
                {link.label}
              </Link>
            ) : (
              <a
                href={link.href}
                className="text-sm text-slate-400 transition-colors duration-200 hover:text-teal-light"
              >
                {link.label}
              </a>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function Footer() {
  return (
    <footer className="bg-slate-900 py-16 text-slate-400 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-6">
        {/* ---- 4-column grid ---- */}
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* Column 1 — Brand */}
          <div>
            <Link href="/" className="mb-4 inline-flex items-center">
              <Image
                src="/logo-dark.png"
                alt="ConsentHub"
                width={160}
                height={36}
                className="h-9 w-auto"
              />
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-slate-400">
              HIPAA-compliant consent management. Built natively for Microsoft
              Dynamics 365.
            </p>
            <div className="mt-6 flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="flex size-9 cursor-pointer items-center justify-center rounded-full border border-slate-700 text-slate-400 transition-all duration-200 hover:border-teal hover:text-teal"
                >
                  <social.icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Columns 2-4 — Links */}
          <FooterLinkColumn title="Product" links={productLinks} />
          <FooterLinkColumn title="Compliance" links={complianceLinks} />
          <FooterLinkColumn title="Company" links={companyLinks} />
        </div>

        {/* ---- Compliance badges ---- */}
        <div className="mt-16 flex flex-wrap items-center justify-center gap-3">
          {complianceBadges.map((badge) => (
            <div
              key={badge.label}
              className="flex items-center gap-2 rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300"
            >
              <badge.icon className="size-4 shrink-0 text-teal" />
              <span>{badge.label}</span>
            </div>
          ))}
        </div>

        {/* ---- Bottom bar ---- */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-800 pt-8 sm:flex-row">
          <p className="text-sm text-slate-500">
            &copy; 2026 ConsentHub. All rights reserved.
          </p>
          <div className="flex items-center gap-1 text-sm text-slate-500">
            {legalLinks.map((link, i) => (
              <span key={link.label} className="flex items-center">
                {i > 0 && <span className="mx-2">&middot;</span>}
                <a
                  href={link.href}
                  className="cursor-pointer transition-colors duration-200 hover:text-slate-300"
                >
                  {link.label}
                </a>
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
