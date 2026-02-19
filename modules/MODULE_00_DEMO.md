# Module 00: Interactive Demo / Promo Site

## Purpose

Build a stunning, interactive demo site that shows Chris and Jacquelin what ConsentHub will look like and how it will work. This is a **sales tool** — it needs to impress, build confidence, and justify the investment.

**This module runs BEFORE the real build begins.** It uses simulated data and is a standalone Next.js app (or can be the same repo with a `/demo` route group).

---

## Design Direction

### Audience
- **Chris Johnson** — TAS Incorporated, technical, understands Dynamics 365 ecosystem
- **Jacquelin** — Business stakeholder, cares about ROI, ease of use, professional polish

### Aesthetic
- **Healthcare-professional meets modern SaaS** — Clean, trustworthy, authoritative
- **Color palette:** Deep navy/slate primary (#0F172A), teal accent (#0D9488), white surfaces, soft gray backgrounds
- **Typography:** Professional serif for headings (e.g., DM Serif Display), clean sans-serif for body (e.g., Plus Jakarta Sans)
- **Tone:** Confident, competent, "this is already built" energy
- **NO generic AI aesthetics** — No purple gradients, no Inter font, no cookie-cutter SaaS templates

### Key Impressions to Create
1. "This looks like a real product" — not a mockup
2. "This is exactly what our healthcare clients need"
3. "The Dynamics integration is seamless"
4. "This is worth the investment"

---

## Pages to Build

### 1. Landing / Marketing Page (`/`)

A single-page marketing site that sells ConsentHub to potential customers. Sections:

**Hero**
- Headline: "Patient Consent Management, Built for Dynamics 365"
- Subheadline: "HIPAA-compliant consent capture, real-time CRM sync, and immutable audit trails — at a fraction of enterprise pricing."
- CTA buttons: "See Demo" (scrolls to demo section), "View Pricing"
- Animated hero graphic showing consent flow (abstract, not screenshot)

**Problem / Solution**
- The consent management problem in healthcare
- Why existing solutions fail mid-market organizations
- How ConsentHub solves it

**Features Grid** (6 features with icons and descriptions)
1. Consent Engine — Digital signatures, templates, multi-channel
2. Dynamics 365 Integration — Real-time bi-directional sync
3. HIPAA Compliance — Immutable audit trail, SHA-256 checksums
4. Patient Portal — Self-service preference management
5. Admin Dashboard — Metrics, reports, compliance overview
6. Full API — REST API, Power Automate, Zapier, n8n

**How It Works** (3-step animated flow)
1. Staff opens contact in Dynamics → ConsentHub panel loads
2. Patient signs on tablet → Consent captured with digital signature
3. Dynamics syncs instantly → Audit trail created automatically

**Pricing Section**
- Show tier structure (Starter / Professional / Enterprise)
- Monthly pricing aligned with $600-2,000/month positioning
- Feature comparison table

**Testimonial Placeholder**
- Design the section but use placeholder content
- "Built for organizations like yours"

**CTA Section**
- "Ready to Modernize Your Consent Workflow?"
- Schedule demo button

**Footer**
- HIPAA compliance badges
- SOC2 mention
- Contact info

---

### 2. Interactive Admin Dashboard Demo (`/demo/dashboard`)

A fully interactive dashboard with **simulated data** that looks and feels like the real product. All navigation should work between demo pages.

**Sidebar Navigation:**
- Dashboard (active)
- Patients
- Consents
- Templates
- Audit Log
- Reports
- Settings

**Dashboard Content:**
- **Metric Cards** (animated counters on load):
  - Total Consents: 1,247
  - Active: 982
  - Expiring (30d): 43
  - Compliance Rate: 94.2%
- **Recent Activity Feed** — 10 realistic entries with timestamps
- **Consents by Type** — Donut/pie chart (use recharts or Chart.js)
- **Monthly Trend** — Line chart showing 6-month growth
- **Quick Actions** — "Capture Consent", "Generate Report", "View Audit"

---

### 3. Patient List Demo (`/demo/patients`)

- Table with 20+ realistic patient records (use healthcare-appropriate fake data)
- Search bar that actually filters
- Status filter dropdown (All, Active Consent, Expired, No Consent)
- Pagination controls
- Click a row → navigate to patient detail
- "Sync Status" column showing Dynamics sync indicators

---

### 4. Patient Detail Demo (`/demo/patients/[id]`)

- Patient info card (name, email, phone, MRN, Dynamics link)
- Consent history timeline
- Active consents with status badges
- "Request Consent" button → opens consent capture modal
- "View in Dynamics" external link (disabled in demo)
- Audit trail for this patient

---

### 5. Consent Capture Demo (`/demo/consent`)

The star of the show — a working consent capture flow:

1. **Select Template** — Dropdown with pre-built templates
2. **Review Legal Text** — Scrollable legal text with plain language summary
3. **Select Channels** — Checkboxes: Email, SMS, Phone, Mail
4. **Digital Signature** — Working signature_pad canvas where you can actually draw
5. **Typed Signature Fallback** — Toggle to type name instead
6. **Confirmation** — Summary of what was consented to
7. **Success State** — Green checkmark, "Consent captured. Syncing to Dynamics..."

This should be a multi-step wizard with smooth transitions.

---

### 6. Audit Log Demo (`/demo/audit`)

- Searchable table of audit events
- Columns: Timestamp, Action, Patient, User, Details
- Row expansion showing old_values / new_values JSON diff
- "Verify Checksum" button that shows SHA-256 verification animation
- Export CSV button (downloads sample CSV)

---

### 7. Patient Portal Demo (`/demo/portal`)

A completely separate design from the admin — simpler, patient-friendly:

- **Magic Link Entry** — Email input with "Send Login Link" button
- **Preference Toggles** — Email, SMS, Phone, Mail switches
- **Consent History** — Card layout with status badges
- **Download PDF** button on each consent card
- Clean, calming, mobile-first design

---

### 8. Architecture Overview (`/demo/architecture`)

Interactive page showing the technical architecture:

- Mermaid diagrams rendered (System Architecture, Consent Flow, ER Diagram)
- Clickable sections that expand with details
- Technology badges for each component
- This impresses technical stakeholders like Chris

---

## Technical Implementation

### Stack for Demo
```
Next.js 16 (App Router)
TypeScript
Tailwind CSS
shadcn/ui components
Framer Motion (animations)
recharts (charts)
signature_pad (signature canvas)
Lucide icons
```

> **Note:** Use `next.config.ts` (not `.js`) with `output: 'standalone'` for Railway deployment.

### Data Strategy
- Create a `demo/data/` folder with JSON files for all simulated data
- Patient names, consent records, audit logs — all realistic healthcare data
- Use `faker` or hand-crafted data that feels authentic
- NO obviously fake data like "John Doe" or "test@test.com"

### Simulated Data Files
```
demo/data/
├── patients.json         # 25 realistic patient records
├── consents.json         # 50+ consent records across patients
├── templates.json        # 5 consent templates (HIPAA, GDPR, etc.)
├── audit-logs.json       # 100+ audit log entries
├── dashboard-stats.json  # Pre-computed dashboard metrics
└── activity-feed.json    # Recent activity items
```

### Component Architecture
```
demo/components/
├── layout/
│   ├── DemoSidebar.tsx       # Admin sidebar navigation
│   ├── DemoHeader.tsx        # Top bar with user info
│   ├── PortalLayout.tsx      # Patient portal wrapper
│   └── MarketingLayout.tsx   # Landing page wrapper
├── dashboard/
│   ├── MetricCard.tsx        # Animated stat card
│   ├── ActivityFeed.tsx      # Recent events list
│   ├── ConsentChart.tsx      # Donut chart
│   └── TrendChart.tsx        # Line chart
├── patients/
│   ├── PatientTable.tsx      # Searchable/filterable table
│   ├── PatientDetail.tsx     # Full patient view
│   └── ConsentTimeline.tsx   # Consent history timeline
├── consent/
│   ├── ConsentWizard.tsx     # Multi-step capture flow
│   ├── SignaturePad.tsx      # Digital signature canvas
│   ├── TemplateSelector.tsx  # Template dropdown
│   └── ChannelPicker.tsx     # Channel checkboxes
├── audit/
│   ├── AuditTable.tsx        # Searchable audit log
│   └── ChecksumVerifier.tsx  # Verification animation
└── portal/
    ├── MagicLinkForm.tsx     # Email entry
    ├── PreferenceToggles.tsx # Channel switches
    └── ConsentHistory.tsx    # Patient consent cards
```

---

## Acceptance Criteria

Before this module is done:

- [ ] Landing page loads and looks professional — no broken layouts
- [ ] All 8 pages/sections are accessible and navigable
- [ ] Dashboard charts render with simulated data
- [ ] Patient table search and filter actually work
- [ ] Consent capture wizard completes full flow with real signature capture
- [ ] Signature pad works on desktop AND mobile (touch)
- [ ] Audit log shows expandable detail rows
- [ ] Patient portal has distinct, simpler design
- [ ] Architecture page renders Mermaid diagrams
- [ ] Mobile responsive — test at 375px, 768px, 1024px, 1440px
- [ ] Page transitions are smooth (Framer Motion)
- [ ] No console errors
- [ ] Lighthouse performance score > 80
- [ ] Git commit: `'Module 0: Demo/Promo site complete'`

---

## Claude Code Prompt

Copy this into a new Claude Code session:

```
I'm building ConsentHub, a HIPAA/GDPR consent management SaaS for Microsoft Dynamics 365.

FIRST: Read CLAUDE.md and modules/MODULE_00_DEMO.md for complete specifications.

Build an interactive demo/promo site that will be shown to our client (TAS Incorporated) to demonstrate the product before development begins.

Key requirements:
1. Next.js 16 with App Router, TypeScript, Tailwind CSS, shadcn/ui
2. Landing/marketing page at / with hero, features, pricing, how-it-works
3. Interactive admin dashboard demo at /demo/dashboard with charts and metrics
4. Patient list and detail pages with search/filter at /demo/patients
5. Working consent capture wizard with real signature_pad canvas at /demo/consent
6. Audit log with expandable rows at /demo/audit
7. Patient portal with preference toggles at /demo/portal
8. Architecture diagram viewer at /demo/architecture
9. All simulated data in demo/data/ JSON files — realistic healthcare data
10. Framer Motion animations, recharts for charts
11. Mobile responsive, beautiful design — NOT generic AI aesthetics

Design direction: Healthcare-professional meets modern SaaS. Deep navy/teal color scheme. 
Serif headings (DM Serif Display), sans-serif body (Plus Jakarta Sans).
This needs to look like a real, shipping product — not a prototype.

Start by creating the project structure and landing page, then build each demo page.
```

---

## Notes for Mark

- The demo is your **sales tool**. It should make Chris and Jacquelin say "when can we start?"
- The signature capture needs to work perfectly — that's the "wow" moment
- Keep the dashboard looking data-rich but not overwhelming
- The patient portal should feel completely different from the admin — simpler, calmer
- Architecture page is for Chris specifically — he'll want to see the technical depth
- You can deploy this to Railway during the sales phase
