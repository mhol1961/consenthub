# ConsentHub Production Readiness — Complete Analysis & Strategic Plan

**Date:** February 23, 2026
**Author:** Mark Holland
**Status:** Design Phase — Awaiting Approval
**Audience:** Mark Holland (developer), Chris Johnson & Jacquelin (TAS Incorporated)

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Current State Assessment](#2-current-state-assessment)
3. [Production Readiness Gap Analysis](#3-production-readiness-gap-analysis)
4. [Build Strategy: MVP vs. Full Build](#4-build-strategy)
5. [Security & Compliance Requirements](#5-security--compliance-requirements)
6. [UI/UX Assessment](#6-uiux-assessment)
7. [Technical Architecture Decisions](#7-technical-architecture-decisions)
8. [Value-Adding Enhancements](#8-value-adding-enhancements)
9. [Strategic Expansion Roadmap](#9-strategic-expansion-roadmap)
10. [Timeline & Pricing Options for Chris](#10-timeline--pricing-options)
11. [Implementation Plan](#11-implementation-plan)

---

## 1. Executive Summary

ConsentHub has a polished demo site (Module 0) deployed to GitHub Pages and 8 promotional videos rendered via Remotion. **However, zero production code exists.** Modules 1-7 are thoroughly specified but completely unbuilt — there is no database, no authentication, no API endpoints, no Dynamics 365 connection, and no compliance infrastructure.

### Key Findings

| Area | Score | Summary |
|------|-------|---------|
| Demo Site UI/UX | **8.5/10** | Professional, responsive, great animations. Minor accessibility gaps. |
| Security Readiness | **2/10** | Specs mention security but nothing is implemented. Critical gaps in HIPAA/GDPR compliance. |
| Feature Completeness | **1/10** | Only demo with mock data exists. All production features unbuilt. |
| Documentation Quality | **8/10** | Excellent module specs, PRD, and tech spec. Some conflicts to resolve. |
| Architecture Design | **7/10** | Sound choices (Neon, Clerk, BullMQ) but implementation details incomplete. |
| Production Readiness | **0/10** | Cannot serve a single real customer today. |

### The Demo vs. Production Gap

| Aspect | Demo (Built in 3-4 days) | Production (To Be Built) |
|--------|--------------------------|--------------------------|
| Data | 5 JSON files with mock data | PostgreSQL with 6 tables, Row-Level Security, encrypted connections |
| Auth | None — anyone can access everything | Clerk + Azure AD SSO + MFA + magic links + session management |
| API | None — purely client-side rendering | 15+ REST endpoints with Zod validation, rate limiting, CORS |
| Dynamics 365 | Animated SVG showing sync | Real OAuth + Dataverse API + webhooks + bi-directional field sync |
| Audit Trail | Static mock table | Immutable DB-level triggers, SHA-256 checksums, chain verification |
| Security | None | HIPAA/GDPR compliant: PII scrubbing, RLS, CSP headers, encryption |
| Deployment | Static HTML on GitHub Pages | Docker + CI/CD + Sentry monitoring + health checks |
| Testing | None | Jest unit + Playwright E2E + integration + security tests |

---

## 2. Current State Assessment

### What's Actually Built

**Module 0: Demo/Promo Site (COMPLETE)**
- Standalone Next.js 15.3 app in `/demo/`
- 11 interactive pages (landing, dashboard, patients, consents, templates, audit, reports, settings, portal, architecture)
- 53 source files, 6 mock data files
- Deployed to GitHub Pages via GitHub Actions
- Key components: Consent Wizard (6-step), Dashboard with animated metrics, Patient table with search/filter, Audit log with checksum verification UI

**Remotion Videos (COMPLETE)**
- 8 rendered videos (146 MB total)
- Full overview (3+ min), 2-min demo, 4 feature clips, 2 voice test clips

### What's Documented But Not Built

| Module | Spec Lines | Status | Key Deliverables |
|--------|-----------|--------|-----------------|
| 01: Foundation | 118 | Unstarted | Next.js, Neon DB, Clerk auth, schema, RLS |
| 02: Consent Engine | 109 | Unstarted | Templates, signatures, PDF gen, audit, state machine |
| 03: Background Jobs | 76 | Unstarted | BullMQ, async processors, retry logic |
| 04: Dynamics 365 | 104 | Unstarted | OAuth, Dataverse API, webhooks, bi-directional sync |
| 05: Admin Dashboard | 101 | Unstarted | Real data dashboard, management pages, reports |
| 06: Patient Portal | 109 | Unstarted | Magic link auth, self-service, GDPR export |
| 07: Launch | 117 | Unstarted | Tests, Docker, CI/CD, monitoring, deployment |

### Known Issues in Specs

1. **Next.js version mismatch**: TECH_SPEC says v16, demo uses v15.3.0 — must resolve before Module 01
2. **Supabase vs. Neon**: .env.local.example mentions Supabase, but all docs specify Neon — template needs updating
3. **PDF storage undefined**: Module 02 mentions "cloud storage bucket" but no provider specified
4. **RLS + Clerk gap**: TECH_SPEC assumes Postgres-level `auth.uid()` but Clerk doesn't provide this — need app-level enforcement
5. **Missing consent expiration job**: State machine shows active → expired transition but no cron/scheduled job specified

---

## 3. Production Readiness Gap Analysis

### Tier 1: Show-Stoppers (Must Fix Before Any Customer)

| # | Gap | Impact | Resolution |
|---|-----|--------|------------|
| 1 | No database exists | Cannot store any data | Module 01: Create Neon DB + schema |
| 2 | No authentication | Anyone accesses everything | Module 01: Clerk + Azure AD SSO |
| 3 | No API endpoints | No server-side functionality | Module 02+: Build all API routes |
| 4 | No Dynamics connection | Core value proposition broken | Module 04: OAuth + Dataverse API |
| 5 | No audit trail | HIPAA non-compliant | Module 02: Immutable logs + checksums |
| 6 | No multi-tenant isolation | Cross-org data leaks | Module 01: RLS + app-level enforcement |
| 7 | No CORS/CSP headers | Vulnerable to CSRF/XSS | Module 01: Security headers in next.config |
| 8 | No rate limiting | DoS vulnerability | Module 01: Upstash rate limiter |
| 9 | No PII scrubbing in logs | HIPAA violation if PHI logged | Module 01: Sanitization middleware |
| 10 | No webhook signature validation | Malicious webhook injection | Module 04: HMAC-SHA256 validation |

### Tier 2: Required for Compliance Certification

| # | Gap | Impact | Resolution |
|---|-----|--------|------------|
| 11 | No BAA template | Legal exposure with healthcare clients | Pre-development legal document |
| 12 | No MFA enforcement | Unauthorized staff access risk | Module 01: Clerk MFA config |
| 13 | No session timeouts | Session hijacking risk | Module 01: 30-min timeout config |
| 14 | No GDPR data subject rights | GDPR violation | Module 06: Export, delete, rectify endpoints |
| 15 | No disaster recovery plan | Data loss risk | Module 07: Backup/restore documentation |
| 16 | No secrets rotation procedures | Credential compromise risk | Module 07: Rotation schedule |
| 17 | No Sentry PII filtering | Sensitive data in error tracking | Module 07: beforeSend filter |
| 18 | No webhook replay protection | Duplicate consent records | Module 04: Event ID deduplication |
| 19 | No checksum chain verification | Limited tamper detection | Module 02: Chain-linked checksums |
| 20 | No SOC 2 control documentation | SOC 2 audit failure | Module 07: Control documentation |

### Tier 3: Quality & Polish

| # | Gap | Impact | Resolution |
|---|-----|--------|------------|
| 21 | Demo accessibility gaps | Screen reader issues | Demo fixes: form labels, focus traps, ARIA |
| 22 | No API pagination | Performance with large datasets | Module 02+: Cursor pagination |
| 23 | No email templates defined | Runtime failures when sending | Module 02: Resend template definitions |
| 24 | No API documentation (OpenAPI) | Developer integration friction | Module 07: Auto-generated from Zod |
| 25 | No health check endpoint | Container orchestration issues | Module 07: /api/health route |

---

## 4. Build Strategy

### Option A: MVP First, Then Iterate (RECOMMENDED)

Build the minimum product that can serve real paying customers, then expand based on feedback.

**MVP Scope (Modules: 1, 2, 4-basic, 5-basic, 7-basic)**

| Component | What's Included | What's Deferred to Phase 2 |
|-----------|----------------|---------------------------|
| **Foundation** | Full DB schema + RLS + Clerk auth + Azure AD SSO + security headers | None — no shortcuts on foundation |
| **Consent Engine** | Core consent capture + digital signatures + basic audit trail + consent state machine | Advanced templates, PDF generation, bulk validation |
| **Dynamics Sync** | One-way sync (ConsentHub → Dynamics) + webhook receiver | Bi-directional sync, advanced field mapping |
| **Admin Dashboard** | Dashboard metrics, patient list, consent list, basic audit viewer | Reports, template builder, advanced settings |
| **Deployment** | Docker, basic CI/CD, Railway hosting, core tests | Full E2E suite, Azure production, load testing |

**Timeline with AI-Assisted Development:**
- Module 01: 1-2 focused sessions (1-2 days)
- Module 02: 2-3 sessions (2-3 days)
- Module 04 basic: 1-2 sessions (1-2 days)
- Module 05 basic: 1-2 sessions (1-2 days)
- Module 07 basic: 1-2 sessions (1-2 days)
- Integration testing + fixes: 2-3 days
- **Total: 2-3 weeks** (with focused daily sessions)

**Phase 2 Additions (Post-MVP, Post-Revenue):**

| Addition | Timeframe | Trigger |
|----------|-----------|---------|
| Patient Portal (Module 06) | +1 week | Customer request or GDPR requirement |
| Background Jobs (Module 03) | +1 week | Performance needs async processing |
| Advanced Dynamics sync | +1 week | Customers need bi-directional |
| PDF generation | +3 days | Customers need downloadable consent records |
| Compliance reports | +3 days | Compliance officer requests |
| Template builder | +3 days | Customers want custom consent forms |

### Option B: Full 7-Module Build

Build everything before launching. More comprehensive but longer time to first customer.

**Timeline with AI-Assisted Development:**
- All 7 modules: 4-6 weeks
- Integration + testing: 1-2 weeks
- **Total: 5-8 weeks**

**Risk:** Building features customers may not need yet. Revenue delayed by 3-5 weeks vs. MVP.

### Recommendation

**Go with MVP (Option A).** Get real customers and real revenue in 2-3 weeks. Every Phase 2 addition is a natural upsell conversation with Chris: "Customers are asking for X — here's what it costs to add."

---

## 5. Security & Compliance Requirements

### HIPAA Compliance Checklist

| Requirement | Current State | What to Build |
|-------------|--------------|---------------|
| BAA with healthcare clients | Not documented | Legal template (pre-development) |
| Vendor BAAs (Neon, Clerk, Resend) | Not verified | Verify each vendor's BAA availability |
| PHI handling policy | Specified in CLAUDE.md rules | Enforce via PII scrubbing middleware |
| Encryption at rest | Neon provides (verify) | Verify Neon Pro encryption + document |
| Encryption in transit | HTTPS assumed | Enforce TLS 1.2+ via security headers |
| Audit trail immutability | DB triggers specified | Implement triggers + checksum chain |
| Access controls (RBAC) | 4 roles in schema (admin, staff, compliance, readonly) | Implement role-based API middleware |
| Minimum necessary rule | Not specified | Field-level access per role |
| Data retention (7 years) | Not specified | Automated retention policy |
| Breach notification | Not documented | Incident response SOP |

### GDPR Compliance Checklist

| Requirement | Current State | What to Build |
|-------------|--------------|---------------|
| Lawful basis for processing | Not documented | Document per consent type |
| Right of Access (Art. 15) | Module 06 spec | /api/portal/export endpoint |
| Right to Erasure (Art. 17) | Not specified | Anonymization with retention exception |
| Right to Rectification (Art. 16) | Not specified | Patient self-update endpoint |
| Right to Data Portability (Art. 20) | Module 06 spec | JSON export endpoint |
| Consent withdrawal | Revocation in spec | Explicit withdrawal + audit log |
| Privacy Policy | Not created | Legal document required |
| DPA with customers | Not created | Legal template required |
| Data residency | Not specified | Document Neon hosting region |

### Security Architecture (To Be Built)

```
Request → HTTPS/TLS 1.2+ → WAF/DDoS (Vercel/Azure)
  → Rate Limiter (Upstash)
  → CORS/CSP Headers
  → Clerk Auth (JWT validation)
  → Role Check Middleware
  → Zod Input Validation
  → Drizzle ORM (parameterized queries)
  → Neon PostgreSQL (RLS policies)
  → Response (no PHI in errors)
  → Audit Log (immutable, SHA-256)
```

---

## 6. UI/UX Assessment

### Demo Site Rating: 8.5/10

**Strengths:**
- Professional color palette (Navy + Teal + Indigo) — perfect for healthcare
- Elegant typography (DM Serif Display + Plus Jakarta Sans)
- Excellent dark mode with proper contrast ratios
- Sophisticated animations via Framer Motion (staggered fades, spring physics, 3D perspective)
- Responsive design across all breakpoints
- Reduced motion support (prefers-reduced-motion media query)
- Interactive demo section is the crown jewel — consent capture, sync visualization, audit checksum verification

**Issues to Fix:**

| Priority | Issue | Fix |
|----------|-------|-----|
| High | Missing `<label>` elements on search inputs | Add `aria-label` or sr-only labels |
| High | No focus trap on mobile sidebar overlay | Implement focus-trap library |
| High | Missing `scope="col"` on table headers | Add to all `<th>` elements |
| Medium | Icon-only tabs on mobile InteractiveDemo | Add abbreviated text labels |
| Medium | Charts lack alt text for screen readers | Add `<figcaption>` + aria-label |
| Medium | Placeholder links (all point to `#`) | Replace with real URLs or forms |
| Low | Some dark mode grays borderline contrast | Test with WebAIM checker |
| Low | No save-draft on Consent Wizard | Add sessionStorage auto-save |

### Production UI Considerations

The demo components provide excellent UI patterns to reuse in production. Key decisions:

1. **Shared component library**: Extract shadcn/ui + custom components from demo for production use
2. **Real data integration**: Replace mock JSON with React Query + API calls
3. **Loading states**: Add skeleton screens (already in demo) for API-fetched data
4. **Error states**: Add error boundaries and user-friendly error messages
5. **Accessibility**: Fix the issues listed above before production launch

---

## 7. Technical Architecture Decisions

### Decisions That Must Be Made Before Module 01

| Decision | Options | Recommendation |
|----------|---------|----------------|
| Next.js version | 15.3 (demo) vs. 16 (spec'd) | **16** — current stable, matches spec, Turbopack stable, production app is separate from demo |
| PDF storage provider | Azure Blob, AWS S3, Cloudflare R2 | **Azure Blob** — aligns with D365/Azure ecosystem |
| RLS enforcement | Postgres-level vs. app-level | **App-level** — Clerk doesn't integrate with Postgres auth context |
| Production hosting | Railway, Vercel Pro, Azure App Service | **Railway** for MVP (cheapest, fastest), **Azure** for enterprise |
| Email provider | Resend (in spec) | **Resend** — confirmed, good DX, reasonable pricing |
| Monitoring | Sentry (in spec) | **Sentry** — confirmed, add PII filtering |

### Architecture Diagram (Production)

```
[Browser/Client]
    │
    ├── Landing Page (Static/SSG)
    ├── Admin Dashboard (SSR + Client)
    └── Patient Portal (SSR + Client)
         │
    [Next.js API Routes]
    ├── /api/auth/* → Clerk SDK
    ├── /api/consents/* → Consent Engine
    ├── /api/patients/* → Patient Management
    ├── /api/templates/* → Template CRUD
    ├── /api/audit/* → Audit Log Reader
    ├── /api/dynamics/* → Dynamics Connector
    └── /api/portal/* → Patient Self-Service
         │
    [Middleware Layer]
    ├── Rate Limiter (Upstash Redis)
    ├── Auth Check (Clerk JWT)
    ├── Role Check (RBAC)
    ├── Input Validation (Zod)
    └── Audit Logger (SHA-256)
         │
    [Data Layer]
    ├── Neon PostgreSQL (RLS)
    ├── Upstash Redis (sessions, rate limits, queues)
    └── Azure Blob Storage (PDFs)
         │
    [External Services]
    ├── Dynamics 365 Dataverse API
    ├── Clerk (auth/SSO)
    ├── Resend (email)
    └── Sentry (monitoring)
```

---

## 8. Value-Adding Enhancements

These are features NOT in the current specs that would bring real value. Ordered by impact.

### High Value — Include in Phase 2

| Enhancement | Why It Matters | Effort |
|-------------|---------------|--------|
| **Consent Expiration Auto-Manager** | Consents expire silently without this. Auto-transitions active → expired, syncs to Dynamics, emails patient. Without it, expired consents stay "active" in CRM. | 1 session |
| **Webhook Health Dashboard** | Shows Dynamics sync status, last successful sync, failed events, retry queue. Without it, sync failures are invisible until a compliance audit catches stale data. | 1 session |
| **Bulk Consent Validation API** | Healthcare orgs need to check validity of hundreds of consents at once (e.g., before a marketing campaign). The spec mentions it but doesn't detail implementation. | 1 session |
| **Compliance Report Generator** | One-click PDF report showing: total consents by type, expiration forecast, audit log summary, Dynamics sync status. Compliance officers present these to auditors. | 1-2 sessions |
| **Multi-Language Consent Templates** | Healthcare orgs serve diverse populations. Consent forms in Spanish, Mandarin, etc. Template system supports this with a `locale` field. | 1 session |

### Medium Value — Phase 3

| Enhancement | Why It Matters | Effort |
|-------------|---------------|--------|
| **API Key Management** | Third-party systems (labs, pharmacies) need to validate consents via API without user login. Org-level API keys with rate limits. | 1 session |
| **Consent Analytics Dashboard** | Trend analysis: consent rates over time, revocation patterns, average time-to-sign. Helps compliance teams identify issues proactively. | 1 session |
| **Custom Branding per Organization** | Enterprise customers want their logo/colors on the patient portal and consent forms. White-label capability. | 1 session |
| **Dynamics Power Automate Connector** | Pre-built Power Automate actions for ConsentHub (check consent, capture consent, get audit log). Extends value for D365 power users. | 2 sessions |
| **Email/SMS Consent Capture** | Send consent request via email/SMS, patient clicks link, signs digitally, done. No admin portal needed. Reduces friction for remote patients. | 2 sessions |

### Low Value — Only If Specifically Requested

| Enhancement | Why | Risk |
|-------------|-----|------|
| Mobile app | Healthcare staff rarely need mobile consent capture; web app works on tablets | High effort, low adoption |
| AI-powered consent recommendations | Suggesting consent types based on patient data | Unnecessary complexity, regulatory risk |
| Blockchain audit trail | Some pitch "immutable blockchain audit" | Marketing buzzword, database triggers achieve the same immutability |
| Social login for patients | OAuth with Google/Facebook for patient portal | Healthcare patients expect magic links, not social login |

---

## 9. Strategic Expansion Roadmap

### The Platform Vision

ConsentHub's architecture (immutable audit, RLS multi-tenancy, Dynamics integration, digital signatures) is reusable across regulated industries. TAS should position ConsentHub as the first module of a **compliance platform for Dynamics 365**.

```
TAS Compliance Platform
├── Shared Core (auth, billing, audit, Dynamics connector)
│
├── ConsentHub (Healthcare) ← CURRENT PROJECT
│   └── HIPAA/GDPR consent management
│
├── FleetComply (Trucking/Logistics) ← BEST EXPANSION
│   └── DOT/FMCSA driver qualification files, compliance tracking
│
├── ConsentHub Clinical (Pharma) ← NATURAL EXTENSION
│   └── 21 CFR Part 11 clinical trial e-consent
│
└── Future: KYC/AML (Financial Services)
    └── Customer due diligence, regulatory reporting
```

### Why Trucking/Logistics is the #1 Expansion Target

| Factor | Assessment |
|--------|-----------|
| Market size | $5.6B North America logistics software market |
| Pain intensity | DOT audits can shut down a carrier. Driver qualification files are often paper-based. |
| Willingness to pay | $25-75/driver/month is industry standard |
| D365 competition | **Zero** native D365 DOT compliance solutions exist |
| Code reuse from ConsentHub | ~70% — audit trails, document management, expiration tracking, multi-tenant RLS |
| TAS fit | D365 consulting firms frequently work with logistics clients |

**Key DOT/FMCSA Compliance Needs:**
- Driver Qualification File management (14 mandatory documents per driver)
- Hours of Service compliance reporting
- Drug & Alcohol testing record tracking
- Vehicle inspection (DVIR) documentation
- CSA score monitoring
- Insurance certificate tracking

### Recommended Timeline

| When | What | Revenue Potential |
|------|------|-------------------|
| **Now - Q1 2026** | Complete ConsentHub MVP | Foundation |
| **Q2 2026** | Launch ConsentHub, onboard 5-10 pilot customers | $5K-$10K MRR |
| **Q3-Q4 2026** | Build FleetComply on shared platform | +$10K-$25K MRR potential |
| **2027** | ConsentHub Clinical for pharma e-consent | +$10K-$20K MRR potential |
| **2027+** | Microsoft AppSource listing, co-sell with Microsoft | Accelerated growth |

### Dynamics 365 Ecosystem Gaps TAS Can Fill

Dynamics 365 is strong at CRM/ERP but structurally weak in:

1. **Regulatory compliance workflows** — No native HIPAA consent, DOT compliance, or KYC/AML
2. **Immutable audit trails with cryptographic integrity** — D365 audit logging is basic
3. **Industry-specific compliance portals** — Power Pages is expensive and generic
4. **Digital signature capture** — No native solution
5. **Compliance document automation** — No consent form or DQF generation

Each of these gaps is a product opportunity.

---

## 10. Timeline & Pricing Options for Chris

### The Honest Framing

The demo showed what ConsentHub can be. Building the production platform — with real HIPAA compliance, database security, Dynamics integration, and deployment infrastructure — is a fundamentally different engineering challenge. The demo is a model home; production is a house with plumbing, electrical, inspections, and permits.

**Market rate for this type of project:** $75,000 - $150,000+ (based on 450-600 hours of senior developer time for HIPAA-compliant SaaS with D365 integration).

Because this is a partnership, not just a contract, the options below are significantly below market rate — structured so both parties succeed.

### MVP Timeline (AI-Assisted Development)

| Phase | Duration | Deliverable |
|-------|----------|-------------|
| Week 1 | Module 01 + 02 | Database, auth, consent engine |
| Week 2 | Module 04-basic + 05-basic | Dynamics sync + admin dashboard |
| Week 3 | Module 07-basic + testing | Deployment, monitoring, QA |
| Buffer | +1 week | Integration fixes, Chris feedback |
| **Total** | **3-4 weeks** | Working MVP ready for pilot customers |

### Option A: Development Fee + Revenue Share (Recommended)

| Component | Amount | Notes |
|-----------|--------|-------|
| MVP Development Fee | $15,000 | Covers MVP (Modules 1, 2, 4-basic, 5-basic, 7-basic) |
| Payment Structure | $5K upfront, $5K at consent engine complete, $5K at launch | De-risks for both parties |
| Revenue Share | 15% of MRR | Developer participates in product success |
| Revenue Share Cap | $100,000 total OR 36 months (whichever first) | Defined endpoint for Chris |
| Phase 2 Work | $100/hr OR renegotiate rev share | Patient portal, advanced Dynamics, reports |
| Infrastructure Costs | Chris covers directly | Neon, Clerk, Resend, hosting (~$200-500/mo) |

**Revenue share math at different scales:**

| Customers | Avg. Price | MRR | Chris Keeps (85%) | Mark Gets (15%) |
|-----------|-----------|-----|-------------------|-----------------|
| 5 | $999 | $4,995 | $4,246 | $749 |
| 15 | $999 | $14,985 | $12,737 | $2,248 |
| 25 | $999 | $24,975 | $21,229 | $3,746 |
| 50 | $999 | $49,950 | $42,458 | $7,493 |

**Why this works:** Mark gets compensated for the real value created. Chris gets a product partner invested in success, not just a contractor who walks away after delivery.

### Option B: Fixed Fee with Phase Pricing

| Phase | Deliverable | Fee | Payment |
|-------|-------------|-----|---------|
| Phase 1 (MVP) | Foundation + consent + basic Dynamics + basic admin + deployment | $20,000 | $7K / $7K / $6K milestones |
| Phase 2 | Patient portal + background jobs + advanced Dynamics sync | $12,000 | $6K / $6K milestones |
| Phase 3 | Reports + template builder + PDF generation + full E2E tests | $8,000 | $4K / $4K milestones |
| **Total** | **Complete platform** | **$40,000** | |

**Why this works:** Chris sees the full cost upfront with no surprises. Each phase is a clear go/no-go decision.

### Option C: Reduced Fee + Equity

| Component | Amount |
|-----------|--------|
| MVP Development Fee | $10,000 |
| Equity in ConsentHub entity | 10-15% |
| No revenue share | Equity IS the long-term value |
| Phase 2+ Work | At-cost ($75/hr) |

**Why this works:** If TAS plans to raise funding, get acquired, or build a multi-product platform, developer equity is the most efficient compensation. Lower cash outlay for Chris today, potentially high value for Mark long-term.

### What Chris Needs to Provide (All Options)

| Item | Why | When |
|------|-----|------|
| Neon database account | Production database | Before Module 01 |
| Clerk account | Authentication provider | Before Module 01 |
| Azure AD app registration | Staff SSO | Before Module 01 |
| Dynamics 365 sandbox | Integration testing | Before Module 04 |
| Resend account | Email delivery | Before Module 02 |
| Domain name | Production URL | Before Module 07 |
| BAA template (legal review) | HIPAA compliance | Before first customer |

---

## 11. Implementation Plan

### MVP Build Order

```
Week 1: Foundation + Consent Engine
├── Session 1: Project scaffold, Neon DB, schema + RLS, Drizzle ORM
├── Session 2: Clerk auth, Azure AD SSO, security middleware
├── Session 3: Consent engine API (capture, validate, state machine)
├── Session 4: Digital signatures, audit trail with checksums
└── Session 5: Basic consent template CRUD

Week 2: Dynamics + Admin
├── Session 6: Dynamics OAuth, Dataverse API client
├── Session 7: ConsentHub → Dynamics one-way sync
├── Session 8: Webhook receiver with HMAC validation
├── Session 9: Admin dashboard (real data, metrics, charts)
└── Session 10: Patient list, consent list, audit viewer

Week 3: Launch + QA
├── Session 11: Docker, CI/CD pipeline, Railway deployment
├── Session 12: Core tests (unit + integration)
├── Session 13: Sentry monitoring, health checks, rate limiting
├── Session 14: End-to-end testing, bug fixes
└── Session 15: Final QA, documentation, handoff

Week 4 (Buffer): Integration fixes, Chris feedback, pilot customer setup
```

### Per-Session Deliverables

Each session uses parallel Claude Code subagents for maximum efficiency:
- Agent 1: Core implementation (routes, handlers, business logic)
- Agent 2: Schema/migrations + Zod validation schemas
- Agent 3: Tests + security verification
- Agent 4: UI components (when applicable)

### Definition of "Done" for MVP

- [ ] Staff can log in via Azure AD SSO through Clerk
- [ ] Admin can create consent templates
- [ ] Admin can capture patient consent with digital signature
- [ ] Consent status tracked (pending → active → revoked → expired)
- [ ] Every action creates immutable audit log with SHA-256 checksum
- [ ] Consent status syncs to Dynamics 365 Contact custom fields
- [ ] Dashboard shows real metrics (total patients, active consents, compliance score)
- [ ] Admin can search patients, view consent history, view audit trail
- [ ] Multi-tenant isolation verified (Org A cannot see Org B data)
- [ ] Deployed to Railway with Docker, accessible via custom domain
- [ ] Basic CI/CD pipeline runs tests on push
- [ ] Sentry captures errors (with PII filtered)
- [ ] Rate limiting active on all endpoints
- [ ] Security headers (CORS, CSP, HSTS) configured

---

## Appendix A: Technology Stack (Confirmed)

| Category | Technology | Version | Status |
|----------|-----------|---------|--------|
| Framework | Next.js | 16.x | Confirmed (per TECH_SPEC, current stable) |
| Language | TypeScript | 5.7+ | Confirmed |
| UI | Tailwind CSS + shadcn/ui | 4.x | Confirmed |
| ORM | Drizzle ORM | Latest | Confirmed |
| Database | Neon PostgreSQL | Pro tier | Confirmed |
| Auth | Clerk + Azure AD | Latest | Confirmed |
| Queue | BullMQ + Upstash Redis | Latest | Confirmed (Phase 2) |
| Email | Resend | Latest | Confirmed |
| PDF | pdf-lib | Latest | Confirmed (Phase 2) |
| Signatures | signature_pad | 5.x | Confirmed |
| Monitoring | Sentry | Latest | Confirmed |
| Hosting (MVP) | Railway | N/A | Confirmed |
| CI/CD | GitHub Actions | N/A | Confirmed |

## Appendix B: Competitive Landscape

| Competitor | Focus | Pricing | D365 Integration |
|-----------|-------|---------|-----------------|
| OneTrust | Enterprise consent/privacy | $1,000-5,000+/mo | Partial (API) |
| Compliancy Group | HIPAA compliance | $299-499/mo | None |
| iubenda | Cookie/consent management | $29-199/mo | None |
| Osano | Data privacy platform | Custom | None |
| TrustArc | Privacy management | Custom | None |
| **ConsentHub** | **D365-native consent** | **$499-1,999/mo** | **Native** |

**ConsentHub's moat:** Native Dynamics 365 integration. No competitor offers this. Healthcare orgs already using D365 get consent management without leaving their CRM.

## Appendix C: Pricing Tiers (Recommended)

| Tier | Monthly | Annual (Save 20%) | Included |
|------|---------|-------------------|----------|
| **Starter** | $499 | $4,790/yr | 500 records/mo, 5 staff, 1 D365 connection |
| **Professional** | $999 | $9,590/yr | 2,500 records/mo, 25 staff, unlimited D365 |
| **Enterprise** | $1,999 | $19,190/yr | Unlimited, dedicated support, custom templates |

---

*Document generated February 23, 2026. Subject to revision based on client feedback and scope decisions.*
