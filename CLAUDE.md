# ConsentHub — Claude Code Master Guide

## Project Overview

**ConsentHub** is a HIPAA/GDPR consent management SaaS platform natively integrated with Microsoft Dynamics 365. It enables healthcare organizations to capture, manage, validate, and audit patient consent with full regulatory compliance.

**Client:** TAS Incorporated (Chris Johnson & Jacquelin) — Microsoft Dynamics CRM consulting firm in Atlanta  
**Developer:** Mark Holland  
**Status:** Pre-development — Demo/Promo site phase → Full modular build

---

## ⚠️ CRITICAL BUILD RULES

### Session Discipline
- **ONE module per Claude Code session.** Start fresh for each module.
- **Commit after each module.** `git add . && git commit -m 'Module X: [description]'`
- **Test before moving on.** Verify each module works before starting the next.
- **Read the module file FIRST.** Before writing ANY code, read `modules/MODULE_XX.md` for that module's full spec.

### Code Quality Standards
- **TypeScript strict mode** — All code must be fully typed. No `any` types.
- **Zod for validation** — Every API endpoint validates input with Zod schemas.
- **Error handling** — Try/catch with proper error responses on every endpoint.
- **No mock data in production modules** — Real Neon database connections only (demo module excepted).
- **Server timestamps only** — Never trust client-provided timestamps for audit records.

### Security — Non-Negotiable
- **No PHI in logs** — Never log patient names, emails, phone numbers, or health data.
- **RLS on all tables** — Row-level security for multi-tenant isolation. No exceptions.
- **Audit logs are IMMUTABLE** — Database triggers MUST block UPDATE and DELETE on `audit_logs`.
- **Webhook signature validation** — All Dynamics 365 webhooks validated with HMAC-SHA256.
- **No secrets in code** — All credentials via environment variables only.

### File Organization
```
consenthub/
├── CLAUDE.md                    # This file — read FIRST every session
├── docs/
│   ├── client/                  # Client-facing docs (safe to share)
│   │   ├── PRD.md               # Product Requirements Document
│   │   └── PROPOSAL.md          # Client Proposal
│   ├── private/                 # ⚠️ NEVER share with client
│   │   └── TECH_SPEC.md         # Full technical specification
│   └── architecture/            # Architecture diagrams & references
│       └── DIAGRAMS.md          # Mermaid diagram source code
├── modules/                     # Modular build specifications
│   ├── MODULE_00_DEMO.md        # Demo/Promo site (START HERE)
│   ├── MODULE_01_FOUNDATION.md  # Database, auth, project setup
│   ├── MODULE_02_CONSENT.md     # Consent engine & signatures
│   ├── MODULE_03_JOBS.md        # Background job processing
│   ├── MODULE_04_DYNAMICS.md    # Dynamics 365 integration
│   ├── MODULE_05_ADMIN.md       # Admin dashboard
│   ├── MODULE_06_PORTAL.md      # Patient self-service portal
│   └── MODULE_07_LAUNCH.md      # Testing, CI/CD, deployment
├── demo/                        # Demo/promo site source
│   └── (built by Module 00)
├── app/                         # Next.js App Router (Modules 1-7)
├── components/                  # React components
├── lib/                         # Utilities, clients, schemas
├── types/                       # TypeScript type definitions
├── drizzle/                     # Database migrations & seed
└── .env.local.example           # Environment variable template
```

---

## Build Sequence

| Order | Module | Description | Depends On |
|-------|--------|-------------|------------|
| **0** | `MODULE_00_DEMO.md` | Interactive demo/promo site for Chris & Jacquelin | Nothing |
| 1 | `MODULE_01_FOUNDATION.md` | Next.js, Neon, Clerk, Database schema | Module 0 (optional) |
| 2 | `MODULE_02_CONSENT.md` | Consent engine, signatures, PDF gen, audit | Module 1 |
| 3 | `MODULE_03_JOBS.md` | BullMQ queues, background processors | Module 2 |
| 4 | `MODULE_04_DYNAMICS.md` | Dynamics 365 bi-directional sync | Module 3 |
| 5 | `MODULE_05_ADMIN.md` | Full admin dashboard | Module 4 |
| 6 | `MODULE_06_PORTAL.md` | Patient self-service portal | Module 5 |
| 7 | `MODULE_07_LAUNCH.md` | Testing, Docker, CI/CD, production deploy | Module 6 |

---

## Technology Stack

| Category | Technology | Purpose |
|----------|-----------|---------|
| **Framework** | Next.js 16 (App Router) with Turbopack | React framework, SSR, API routes |
| **Language** | TypeScript 5 (strict) | Type safety across entire codebase |
| **UI** | Tailwind CSS + shadcn/ui | Utility CSS + accessible component library |
| **ORM** | Drizzle ORM | Type-safe database queries |
| **Database** | Neon PostgreSQL | Serverless Postgres with RLS |
| **Auth** | Clerk + Azure AD | Staff SSO + Patient magic links |
| **Queue** | BullMQ + Upstash Redis | Background job processing |
| **Email** | Resend | Transactional emails |
| **PDF** | pdf-lib | Consent document generation |
| **Signatures** | signature_pad | Canvas-based digital signatures |
| **Monitoring** | Sentry | Error tracking and alerting |
| **Hosting (Demo)** | Railway | Demo/sales phase hosting |
| **Hosting (Prod)** | Vercel Pro or Azure App Service | Production container hosting |
| **CI/CD** | GitHub Actions | Automated test, build, deploy |
| **Integration** | Dynamics Dataverse API | CRM bi-directional sync |

---

## Environment Variables

```bash
# .env.local — NEVER commit this file
# Database (Neon)
DATABASE_URL=postgresql://user:pass@xxxx.neon.tech/consenthub
DIRECT_URL=postgresql://user:pass@xxxx.neon.tech/consenthub

# Auth (Clerk)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_xxxx
CLERK_SECRET_KEY=sk_xxxx

# Redis (Upstash)
UPSTASH_REDIS_REST_URL=https://xxxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=xxxx

# Azure AD (configured in Clerk as SSO provider)
AZURE_AD_CLIENT_ID=xxxx
AZURE_AD_CLIENT_SECRET=xxxx
AZURE_AD_TENANT_ID=xxxx

# Dynamics 365
DYNAMICS_ORG_URL=https://org.crm.dynamics.com
DYNAMICS_CLIENT_ID=xxxx
DYNAMICS_CLIENT_SECRET=xxxx
DYNAMICS_WEBHOOK_SECRET=xxxx

# Email
RESEND_API_KEY=re_xxxx

# Monitoring
SENTRY_DSN=https://xxxx@sentry.io/xxxx

# App
NEXT_PUBLIC_APP_URL=https://consenthub.example.com
NEXT_PUBLIC_APP_NAME=ConsentHub
```

---

## Key Architecture Decisions

1. **Neon PostgreSQL + Drizzle ORM** — Serverless Postgres with type-safe queries, branching for dev/preview, SOC2 compliant. Drizzle provides compile-time schema safety.
2. **Clerk for auth** — Managed authentication with built-in Azure AD SSO, magic links for patients, session management, and RBAC. Faster than self-hosted auth.
3. **Next.js 16 App Router with Turbopack** — Server components for security, API routes co-located, streaming for performance.
4. **Multi-tenant via RLS** — Database-level isolation is more secure than application-level checks.
5. **BullMQ for async** — Dynamics sync, PDF gen, and emails all run async to keep API responses fast (<500ms).
6. **Immutable audit logs** — Database triggers prevent tampering. SHA-256 checksums for integrity verification.
7. **Railway for demo, Vercel/Azure for production** — Railway for fast demo deploys; Vercel Pro or Azure App Service for production with edge network and custom domains.

---

## Database Schema Quick Reference

**6 Core Tables:** `organizations`, `users`, `patients`, `consent_templates`, `consents`, `audit_logs`

**5 Enums:** `consent_type`, `regulation_type`, `consent_status`, `audit_action`, `user_role`

**Key Relationships:**
- `organizations` → has many `users`, `patients`, `consent_templates`, `consents`, `audit_logs`
- `patients` → has many `consents` → each generates `audit_logs`
- `consent_templates` → used by `consents`
- `users` → captures `consents`, performs `audit_logs`

Full schema in `docs/private/TECH_SPEC.md` §3.

---

## Consent State Machine

```
[*] → pending → active → revoked
                active → expired
         revoked → active (new consent)
         expired → active (new consent)
   pending → [*] (request expires 7 days)
```

---

## API Endpoints Summary

### Authentication
- `GET /api/auth/azure` — Initiate Azure AD SSO
- `GET /api/auth/azure/callback` — OAuth callback
- `POST /api/portal/auth/magic-link` — Send patient login link
- `POST /api/portal/auth/verify` — Validate magic link token

### Consent Management
- `POST /api/consents` — Capture new consent
- `POST /api/consents/validate` — Check consent validity
- `POST /api/consents/validate-bulk` — Bulk validation (up to 1000)
- `GET /api/patients/:id/consents` — Patient consent history

### Dynamics Integration
- `POST /api/dynamics/webhook` — Receive Contact change events
- `GET /api/dynamics/status` — Connection health check
- `POST /api/dynamics/test` — Test credentials

### Templates
- `GET/POST/PATCH /api/templates` — Consent template CRUD

### Audit & Reports
- `GET /api/audit` — Search audit logs
- `POST /api/reports/generate` — Generate compliance report
- `GET /api/portal/export` — GDPR data export

---

## Quick Reference Commands

```bash
# Development
npm run dev                    # Start dev server
npm run build                  # Production build
npm run lint                   # Lint check
npm run test                   # Run Jest unit tests
npm run test:e2e               # Run Playwright E2E tests

# Database
npm run db:migrate             # Push schema to Neon via Drizzle
npm run db:seed                # Seed test data

# Docker
docker compose up              # Local dev environment
docker build -t consenthub .   # Production build

# Git workflow
git add . && git commit -m 'Module X: description'
git tag v1.0.0                 # Production release tag
```

---

## References

- `docs/client/PRD.md` — Full product requirements
- `docs/private/TECH_SPEC.md` — Complete implementation guide (⚠️ PRIVATE)
- `docs/architecture/DIAGRAMS.md` — All Mermaid diagram source code
- `modules/MODULE_XX.md` — Individual module build specs
