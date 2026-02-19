# Module 01: Foundation

## Prerequisites
- Module 00 (Demo) complete OR decided to start production build directly
- Neon database project created (free tier for development)
- Azure AD app registration created by Chris/TAS
- Environment variables ready (see CLAUDE.md)

## Scope

Set up the production codebase: Next.js project, Neon database with Drizzle ORM and full schema, authentication with Clerk + Azure AD SSO, and project structure.

## Deliverables

### 1. Next.js 16 Project
- App Router with TypeScript strict mode
- `next.config.ts` with `output: 'standalone'` (required for Railway deployment)
- Tailwind CSS + shadcn/ui installed and configured
- ESLint + Prettier configured
- Path aliases (`@/components`, `@/lib`, `@/types`)

### 2. Database Configuration (Drizzle + Neon)
- Drizzle ORM configured with Neon serverless driver
- Schema defined in TypeScript (type-safe queries)
- Drizzle Kit for migrations

### 3. Database Schema
Run via Drizzle migrations:

**Enums:**
- `consent_type`: marketing_email, marketing_sms, marketing_phone, marketing_mail, treatment, research, data_sharing, hipaa_authorization
- `regulation_type`: hipaa, gdpr, tcpa, ccpa, state_specific
- `consent_status`: pending, active, revoked, expired
- `audit_action`: consent_granted, consent_revoked, consent_viewed, consent_exported, patient_created, patient_updated, user_login, settings_changed, dynamics_sync, report_generated
- `user_role`: admin, staff, compliance, readonly

**Tables:** organizations, users, patients, consent_templates, consents, audit_logs

**Immutability triggers** on audit_logs — BLOCK UPDATE and DELETE

**RLS policies** on all tables — org_isolation pattern

Full SQL in `docs/private/TECH_SPEC.md` §3.

### 4. Authentication
- Clerk with Azure AD as SSO provider
- Magic link flow for patient portal (separate auth context)
- Auth middleware protecting `/dashboard/*` routes
- Login page with "Sign in with Microsoft" button

### 5. Project Structure
```
app/
├── (auth)/
│   ├── login/page.tsx
│   └── callback/page.tsx
├── (admin)/
│   ├── layout.tsx           # Authenticated layout wrapper
│   └── dashboard/page.tsx   # Placeholder
├── (portal)/
│   └── portal/page.tsx      # Placeholder
└── api/
    └── auth/
        ├── azure/route.ts
        └── callback/route.ts
components/
├── ui/                      # shadcn/ui components
└── auth/
    └── LoginForm.tsx
lib/
├── db/
│   ├── index.ts             # Drizzle client + Neon connection
│   └── schema.ts            # Drizzle schema definitions
├── utils.ts
└── constants.ts
types/
├── database.ts              # Inferred from Drizzle schema
└── index.ts
drizzle/
├── migrations/
│   └── 0001_initial_schema.sql
├── seed.ts
└── drizzle.config.ts
```

## Checklist
- [ ] `npm run dev` starts without errors
- [ ] shadcn/ui components render correctly
- [ ] All 6 database tables created in Neon via Drizzle
- [ ] `audit_logs` UPDATE fails (trigger blocks it)
- [ ] RLS policies active — query from anon key returns empty
- [ ] Login page renders with Azure AD SSO button
- [ ] SSO flow completes and redirects to dashboard
- [ ] Auth middleware blocks unauthenticated access to /dashboard
- [ ] `.env.local.example` created with all variable names
- [ ] Git commit: `'Module 1: Foundation complete'`

## Claude Code Prompt

```
I'm building ConsentHub, a HIPAA/GDPR consent management SaaS.

FIRST: Read CLAUDE.md and modules/MODULE_01_FOUNDATION.md for complete specifications.
ALSO READ: docs/private/TECH_SPEC.md §2-3 for exact package.json, env vars, and SQL schema.

Create the foundation:
1. Next.js 16 with App Router, TypeScript strict mode, Tailwind CSS, shadcn/ui
2. Drizzle ORM + Neon database configuration
3. Full database schema — all 6 tables, 5 enums, RLS policies, audit immutability triggers
4. Azure AD SSO authentication via Clerk
5. Project structure per MODULE_01_FOUNDATION.md
6. Working login page — I want to log in with Azure AD when this is done

Use REAL Neon database connection. Environment variables I'll provide:
- DATABASE_URL, DIRECT_URL (Neon)
- NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY, CLERK_SECRET_KEY
- AZURE_AD_CLIENT_ID, AZURE_AD_CLIENT_SECRET, AZURE_AD_TENANT_ID
```
