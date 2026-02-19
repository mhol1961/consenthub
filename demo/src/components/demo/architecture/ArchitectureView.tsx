"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Network,
  FileSignature,
  RefreshCw,
  Database,
  GitBranch,
  Cloud,
  Shield,
  ChevronDown,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import mermaid from "mermaid";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Mermaid diagram source definitions
// ---------------------------------------------------------------------------

const DIAGRAM_SOURCES: Record<string, string> = {
  system: `graph TB
    subgraph "Client Layer"
        PP[Patient Portal<br/>Next.js]
        AD[Admin Dashboard<br/>Next.js]
        D365[Dynamics 365<br/>Embedded Panel]
    end

    subgraph "API Layer - Next.js API Routes"
        AUTH[Auth API]
        CONSENT[Consent API]
        PATIENT[Patient API]
        AUDIT[Audit API]
        TEMPLATE[Template API]
        SYNC[Dynamics Sync]
    end

    subgraph "Services Layer"
        PDF[PDF Generator<br/>pdf-lib]
        EMAIL[Email Service<br/>Resend]
        QUEUE[Job Queue<br/>BullMQ]
        CACHE[Cache<br/>Redis]
    end

    subgraph "Data Layer - Supabase"
        DB[(PostgreSQL<br/>+ RLS)]
        STORAGE[Blob Storage<br/>Signed PDFs]
        REALTIME[Realtime<br/>Subscriptions]
    end

    subgraph "External"
        AZURE[Azure AD<br/>SSO]
        DYN[Dynamics 365<br/>Dataverse API]
    end

    PP --> AUTH
    PP --> CONSENT
    AD --> AUTH
    AD --> CONSENT
    AD --> PATIENT
    AD --> AUDIT
    AD --> TEMPLATE
    D365 --> CONSENT
    D365 --> SYNC

    AUTH --> AZURE
    AUTH --> DB
    CONSENT --> DB
    CONSENT --> PDF
    CONSENT --> QUEUE
    PATIENT --> DB
    AUDIT --> DB
    TEMPLATE --> DB
    SYNC --> DYN
    SYNC --> QUEUE

    PDF --> STORAGE
    QUEUE --> CACHE
    EMAIL --> QUEUE

    DB --> REALTIME`,

  capture: `sequenceDiagram
    autonumber
    participant S as Staff
    participant D365 as Dynamics 365
    participant UI as ConsentHub UI
    participant API as API Server
    participant DB as PostgreSQL
    participant Q as Job Queue
    participant DYN as Dynamics API

    S->>D365: Open Contact record
    D365->>UI: Load embedded panel
    UI->>API: GET /api/patients/:id/consents
    API->>DB: Query consent status
    DB-->>API: No active consent
    API-->>UI: {status: "missing"}
    UI-->>D365: Show yellow warning

    S->>UI: Click "Request Consent"
    UI->>UI: Open consent form modal
    S->>UI: Select template + channels
    S->>UI: Hand tablet to patient

    Note over UI: Patient interaction
    UI->>UI: Patient signs on canvas
    UI->>UI: Patient clicks "I Agree"

    UI->>API: POST /api/consents
    Note right of API: Payload includes:<br/>signature_data, ip,<br/>user_agent, timestamp

    API->>DB: BEGIN TRANSACTION
    API->>DB: INSERT consent
    API->>DB: INSERT audit_log (SHA-256)
    API->>DB: COMMIT

    API->>Q: Queue PDF generation
    API->>Q: Queue Dynamics sync
    API-->>UI: {success: true, id: "..."}

    Q->>API: Generate PDF
    API->>DB: Store PDF path

    Q->>DYN: PATCH Contact
    Note right of DYN: Update ch_marketing_email,<br/>ch_marketing_sms, etc.
    DYN-->>Q: 200 OK
    Q->>DB: Update sync_status

    UI-->>D365: Refresh panel
    D365-->>S: Show green checkmark`,

  sync: `sequenceDiagram
    autonumber
    participant D365 as Dynamics 365
    participant WH as Webhook Endpoint
    participant API as ConsentHub API
    participant DB as PostgreSQL
    participant Q as Job Queue

    Note over D365,Q: Dynamics → ConsentHub (Contact Created)
    D365->>WH: POST /api/dynamics/webhook
    Note right of WH: Event: Contact Created
    WH->>WH: Validate webhook signature
    WH->>API: Process event
    API->>DB: INSERT patient
    API->>DB: INSERT audit_log
    API-->>WH: 200 OK

    Note over D365,Q: Dynamics → ConsentHub (Contact Updated)
    D365->>WH: POST /api/dynamics/webhook
    WH->>API: Process event
    API->>DB: UPDATE patient
    API->>DB: INSERT audit_log
    API-->>WH: 200 OK

    Note over D365,Q: ConsentHub → Dynamics (Consent Granted)
    API->>DB: INSERT consent
    API->>Q: Queue sync job
    Q->>D365: PATCH /contacts(id)
    Note right of D365: {ch_marketing_email: true,<br/>ch_consent_expires: "..."}
    D365-->>Q: 200 OK
    Q->>DB: UPDATE consent sync_status

    Note over D365,Q: ConsentHub → Dynamics (Consent Revoked)
    API->>DB: UPDATE consent status
    API->>Q: Queue sync job
    Q->>D365: PATCH /contacts(id)
    Note right of D365: {ch_marketing_sms: false}
    D365-->>Q: 200 OK`,

  erd: `erDiagram
    organizations ||--o{ users : has
    organizations ||--o{ patients : has
    organizations ||--o{ consent_templates : has
    organizations ||--o{ consents : has
    organizations ||--o{ audit_logs : has

    patients ||--o{ consents : has
    consent_templates ||--o{ consents : uses
    users ||--o{ consents : captures
    users ||--o{ audit_logs : performs
    consents ||--o{ audit_logs : generates
    patients ||--o{ audit_logs : involves

    organizations {
        uuid id PK
        string name
        string dynamics_org_id UK
        uuid azure_tenant_id
        jsonb settings
    }

    users {
        uuid id PK
        uuid organization_id FK
        string email UK
        uuid azure_ad_oid UK
        enum role
        string first_name
        string last_name
    }

    patients {
        uuid id PK
        uuid organization_id FK
        string dynamics_contact_id
        string email
        string phone
        string first_name
        string last_name
        date date_of_birth
    }

    consent_templates {
        uuid id PK
        uuid organization_id FK
        string name
        enum consent_type
        enum regulation_type
        text legal_text
        int version
        int expiration_days
        boolean is_active
    }

    consents {
        uuid id PK
        uuid patient_id FK
        uuid template_id FK
        uuid organization_id FK
        uuid captured_by_user_id FK
        enum status
        enum consent_type
        timestamp granted_at
        timestamp expires_at
        jsonb signature_data
        string dynamics_record_id
    }

    audit_logs {
        uuid id PK
        uuid organization_id FK
        uuid consent_id FK
        uuid patient_id FK
        uuid user_id FK
        enum action
        jsonb old_values
        jsonb new_values
        timestamp timestamp
        string checksum
    }`,

  state: `stateDiagram-v2
    [*] --> pending: Consent requested

    pending --> active: Patient signs
    pending --> [*]: Request expires (7 days)

    active --> revoked: Patient or staff revokes
    active --> expired: Expiration date reached

    revoked --> active: New consent granted
    expired --> active: New consent granted

    note right of pending
        Waiting for patient
        to complete form
    end note

    note right of active
        Valid consent
        Dynamics synced
    end note

    note right of revoked
        Manually revoked
        Audit logged
    end note

    note right of expired
        Auto-expired
        based on template
    end note`,

  deployment: `graph TB
    subgraph "Developer Machine"
        CODE[Source Code]
        DOCKER[Docker Compose<br/>Local Dev]
    end

    subgraph "GitHub"
        REPO[Repository]
        ACTIONS[GitHub Actions<br/>CI/CD]
    end

    subgraph "Azure"
        subgraph "App Service"
            NEXT[Next.js App<br/>Container]
        end
        subgraph "Azure AD"
            SSO[SSO Provider]
        end
    end

    subgraph "Supabase Cloud"
        SUPA_DB[(PostgreSQL)]
        SUPA_AUTH[Auth]
        SUPA_STORAGE[Storage]
        SUPA_EDGE[Edge Functions]
    end

    subgraph "External Services"
        RESEND[Resend<br/>Email]
        SENTRY[Sentry<br/>Errors]
        UPSTASH[Upstash Redis<br/>Queue + Cache]
    end

    subgraph "Microsoft"
        DYN365[Dynamics 365]
    end

    CODE --> DOCKER
    CODE --> REPO
    REPO --> ACTIONS
    ACTIONS -->|Deploy| NEXT

    NEXT --> SSO
    NEXT --> SUPA_DB
    NEXT --> SUPA_AUTH
    NEXT --> SUPA_STORAGE
    NEXT --> SUPA_EDGE
    NEXT --> RESEND
    NEXT --> SENTRY
    NEXT --> UPSTASH
    NEXT <--> DYN365`,

  auth: `sequenceDiagram
    autonumber
    participant U as User
    participant APP as ConsentHub
    participant SUPA as Supabase Auth
    participant AZURE as Azure AD
    participant DB as PostgreSQL

    Note over U,DB: Staff Login (Azure AD SSO)
    U->>APP: Click "Sign in with Microsoft"
    APP->>AZURE: Redirect to Azure AD
    AZURE->>U: Microsoft login page
    U->>AZURE: Enter credentials + MFA
    AZURE->>APP: Redirect with auth code
    APP->>AZURE: Exchange code for tokens
    AZURE-->>APP: access_token, id_token
    APP->>SUPA: Create/link user session
    APP->>DB: Upsert user record
    APP-->>U: Redirect to dashboard

    Note over U,DB: Patient Portal (Magic Link)
    U->>APP: Enter email on portal
    APP->>DB: Lookup patient by email
    DB-->>APP: Patient found
    APP->>SUPA: Generate magic link token
    APP->>APP: Send email via Resend
    APP-->>U: "Check your email"

    U->>APP: Click link in email
    APP->>SUPA: Validate token
    Note right of SUPA: Check: not expired,<br/>not used, valid patient
    SUPA-->>APP: Token valid
    APP->>DB: Create portal session
    APP-->>U: Redirect to preferences`,
};

// ---------------------------------------------------------------------------
// Section metadata
// ---------------------------------------------------------------------------

interface DiagramSection {
  id: string;
  diagramKey: string;
  title: string;
  description: string;
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
}

const SECTIONS: DiagramSection[] = [
  {
    id: "system",
    diagramKey: "system",
    title: "System Architecture",
    description:
      "High-level overview of all system components and their connections",
    icon: Network,
    iconColor: "text-blue-600 dark:text-blue-400",
    iconBg: "bg-blue-50 dark:bg-blue-900/30",
  },
  {
    id: "capture",
    diagramKey: "capture",
    title: "Consent Capture Flow",
    description: "Step-by-step sequence of the consent capture process",
    icon: FileSignature,
    iconColor: "text-teal-600 dark:text-teal-400",
    iconBg: "bg-teal-50 dark:bg-teal-900/30",
  },
  {
    id: "sync",
    diagramKey: "sync",
    title: "Dynamics 365 Sync",
    description:
      "Bi-directional data synchronization with Microsoft Dynamics",
    icon: RefreshCw,
    iconColor: "text-orange-600 dark:text-orange-400",
    iconBg: "bg-orange-50 dark:bg-orange-900/30",
  },
  {
    id: "erd",
    diagramKey: "erd",
    title: "Entity Relationships",
    description: "Database schema and table relationships",
    icon: Database,
    iconColor: "text-green-600 dark:text-green-400",
    iconBg: "bg-green-50 dark:bg-green-900/30",
  },
  {
    id: "state",
    diagramKey: "state",
    title: "Consent State Machine",
    description: "Lifecycle states of a consent record",
    icon: GitBranch,
    iconColor: "text-purple-600 dark:text-purple-400",
    iconBg: "bg-purple-50 dark:bg-purple-900/30",
  },
  {
    id: "deployment",
    diagramKey: "deployment",
    title: "Deployment Architecture",
    description: "Infrastructure and deployment pipeline",
    icon: Cloud,
    iconColor: "text-sky-600 dark:text-sky-400",
    iconBg: "bg-sky-50 dark:bg-sky-900/30",
  },
  {
    id: "auth",
    diagramKey: "auth",
    title: "Authentication Flows",
    description: "Staff SSO and patient magic link authentication",
    icon: Shield,
    iconColor: "text-rose-600 dark:text-rose-400",
    iconBg: "bg-rose-50 dark:bg-rose-900/30",
  },
];

// ---------------------------------------------------------------------------
// Technology badges data
// ---------------------------------------------------------------------------

interface TechBadge {
  name: string;
  dotColor: string;
}

interface TechCategory {
  label: string;
  badges: TechBadge[];
}

const TECH_CATEGORIES: TechCategory[] = [
  {
    label: "Framework",
    badges: [
      { name: "Next.js", dotColor: "bg-blue-500" },
      { name: "TypeScript", dotColor: "bg-blue-500" },
      { name: "React", dotColor: "bg-blue-500" },
    ],
  },
  {
    label: "Infrastructure",
    badges: [
      { name: "Supabase", dotColor: "bg-emerald-500" },
      { name: "PostgreSQL", dotColor: "bg-emerald-500" },
      { name: "Redis", dotColor: "bg-emerald-500" },
    ],
  },
  {
    label: "Services",
    badges: [
      { name: "BullMQ", dotColor: "bg-purple-500" },
      { name: "Resend", dotColor: "bg-purple-500" },
      { name: "Sentry", dotColor: "bg-purple-500" },
    ],
  },
  {
    label: "Integration",
    badges: [
      { name: "Dynamics 365", dotColor: "bg-orange-500" },
      { name: "Azure AD", dotColor: "bg-orange-500" },
    ],
  },
  {
    label: "Frontend",
    badges: [
      { name: "Tailwind CSS", dotColor: "bg-pink-500" },
      { name: "shadcn/ui", dotColor: "bg-pink-500" },
      { name: "framer-motion", dotColor: "bg-pink-500" },
    ],
  },
];

// ---------------------------------------------------------------------------
// Animation constants
// ---------------------------------------------------------------------------

const EASE = [0.4, 0, 0.2, 1] as const;

// ---------------------------------------------------------------------------
// MermaidDiagram — renders a single diagram with client-side mermaid
// ---------------------------------------------------------------------------

function MermaidDiagram({
  diagramKey,
  source,
}: {
  diagramKey: string;
  source: string;
}) {
  const [svg, setSvg] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;

    async function render() {
      try {
        // Use a unique ID for each render call to avoid collisions
        const id = `mermaid-${diagramKey}-${Date.now()}`;
        const { svg: renderedSvg } = await mermaid.render(id, source);
        if (!cancelled) {
          setSvg(renderedSvg);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Failed to render diagram"
          );
        }
      }
    }

    render();

    return () => {
      cancelled = true;
    };
  }, [diagramKey, source]);

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 p-4 text-sm text-red-600 dark:text-red-400">
        Failed to render diagram: {error}
      </div>
    );
  }

  if (!svg) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-teal-600" />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="flex justify-center overflow-x-auto"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}

// ---------------------------------------------------------------------------
// AccordionSection — expandable section for a single diagram
// ---------------------------------------------------------------------------

function AccordionSection({
  section,
  isExpanded,
  onToggle,
  isDark,
}: {
  section: DiagramSection;
  isExpanded: boolean;
  onToggle: () => void;
  isDark: boolean;
}) {
  const Icon = section.icon;

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
      {/* Header */}
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full cursor-pointer items-center gap-4 px-6 py-5 text-left transition-colors duration-200 hover:bg-slate-50 dark:hover:bg-slate-800"
        aria-expanded={isExpanded}
      >
        <div
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
            section.iconBg
          )}
        >
          <Icon className={cn("h-5 w-5", section.iconColor)} />
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="font-serif text-lg text-navy">{section.title}</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">{section.description}</p>
        </div>

        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.25, ease: EASE }}
        >
          <ChevronDown className="h-5 w-5 shrink-0 text-slate-400" />
        </motion.div>
      </button>

      {/* Expandable content */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            key={`content-${section.id}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="overflow-hidden"
          >
            <div className="border-t border-slate-100 dark:border-slate-800 px-6 py-6">
              <div className="rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 p-4 shadow-sm dark:shadow-slate-950/50">
                <MermaidDiagram
                  diagramKey={`${section.diagramKey}-${isDark ? "dark" : "light"}`}
                  source={DIAGRAM_SOURCES[section.diagramKey]}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ---------------------------------------------------------------------------
// ArchitectureView — main page component
// ---------------------------------------------------------------------------

export default function ArchitectureView() {
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(["system"])
  );

  // Initialize mermaid and mark as mounted (client-side only)
  useEffect(() => {
    const root = document.documentElement;
    const dark = root.classList.contains("dark");
    setIsDark(dark);

    mermaid.initialize({
      startOnLoad: false,
      theme: dark ? "dark" : "neutral",
      fontFamily: "Plus Jakarta Sans",
    });
    setMounted(true);

    // Watch for dark mode changes
    const observer = new MutationObserver(() => {
      const nowDark = root.classList.contains("dark");
      if (nowDark !== dark) {
        setIsDark(nowDark);
        mermaid.initialize({
          startOnLoad: false,
          theme: nowDark ? "dark" : "neutral",
          fontFamily: "Plus Jakarta Sans",
        });
      }
    });
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });

    return () => observer.disconnect();
  }, []);

  const toggleSection = useCallback((id: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="space-y-8">
      {/* ── Intro section ─────────────────────────────────────────── */}
      <div>
        <h1 className="font-serif text-3xl text-navy">
          Technical Architecture
        </h1>
        <p className="mt-2 max-w-2xl text-slate-500 dark:text-slate-400">
          A comprehensive overview of ConsentHub&apos;s architecture, data
          flows, and technology stack
        </p>
      </div>

      {/* ── Technology badges ─────────────────────────────────────── */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6">
        <h2 className="mb-4 font-serif text-xl text-navy">
          Technology Stack
        </h2>
        <div className="space-y-4">
          {TECH_CATEGORIES.map((category) => (
            <div key={category.label} className="flex flex-wrap items-center gap-2">
              <span className="mr-1 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                {category.label}
              </span>
              {category.badges.map((badge) => (
                <span
                  key={badge.name}
                  className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-1 text-xs font-medium text-slate-700 dark:text-slate-200"
                >
                  <span
                    className={cn(
                      "inline-block h-2 w-2 rounded-full",
                      badge.dotColor
                    )}
                  />
                  {badge.name}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ── Diagram accordion sections ────────────────────────────── */}
      <div className="space-y-4">
        {SECTIONS.map((section) => (
          <AccordionSection
            key={section.id}
            section={section}
            isExpanded={expandedSections.has(section.id)}
            onToggle={() => toggleSection(section.id)}
            isDark={isDark}
          />
        ))}
      </div>
    </div>
  );
}
