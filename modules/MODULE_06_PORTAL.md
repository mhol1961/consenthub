# Module 06: Patient Portal

## Prerequisites
- Module 05 complete — admin dashboard working

## Scope

Patient-facing self-service portal. Completely separate design from admin — simpler, mobile-first, calming healthcare aesthetic. Separate auth context using magic links.

## Deliverables

### 1. Magic Link Authentication
- `POST /api/portal/auth/magic-link` — Send login email
- `POST /api/portal/auth/verify` — Validate token
- Token: 7-day expiry OR single use (whichever first)
- Email sent via Resend with organization branding
- Rate limit: 3 requests per email per hour

### 2. Portal Layout
- Clean, simple design — NOT admin complexity
- Mobile-first responsive (most patients use phones)
- Organization branding: logo, primary color from org settings
- Minimal navigation: Preferences, History, Export, Logout
- Accessible: WCAG 2.1 AA compliance

### 3. Preferences (`/portal/preferences`)
- Current consent status per channel (email, SMS, phone, mail)
- Toggle switches with clear on/off states
- Confirmation modal on disable ("Are you sure you want to revoke SMS consent?")
- Success toast after save
- Confirmation email sent on changes
- All changes sync to Dynamics via background job
- Audit log entry for every change

### 4. History (`/portal/history`)
- Card list of all consent records
- Status badge: Active (green), Revoked (red), Expired (gray)
- Expand card → shows: template name, granted date, expires date, channels
- Download PDF button per consent
- Revoke button with confirmation + reason field

### 5. GDPR Data Export
- `GET /api/portal/export` — Download all patient data as JSON
- Includes: personal info, all consents, all audit log entries
- Streamed download for large datasets
- Audit log entry: data_exported

### 6. Security
- Separate auth context from admin (no cross-contamination)
- Patient can ONLY see their own data
- Rate limiting on all portal endpoints
- No admin functionality accessible from portal

## File Structure
```
app/(portal)/
├── portal/
│   ├── layout.tsx             # Portal layout (separate from admin)
│   ├── page.tsx               # Magic link entry
│   ├── verify/page.tsx        # Token verification
│   ├── preferences/page.tsx   # Channel toggles
│   ├── history/page.tsx       # Consent history
│   └── export/page.tsx        # GDPR export
components/portal/
├── PortalLayout.tsx
├── MagicLinkForm.tsx
├── PreferenceToggle.tsx
├── ConsentCard.tsx
└── ExportButton.tsx
app/api/portal/
├── auth/
│   ├── magic-link/route.ts
│   └── verify/route.ts
└── export/route.ts
```

## Checklist
- [ ] Magic link email sends and contains valid token
- [ ] Token verification works (valid token → logged in)
- [ ] Expired/used tokens rejected
- [ ] Portal layout is visually distinct from admin
- [ ] Mobile responsive at 375px width
- [ ] Preference toggles save and sync to Dynamics
- [ ] Confirmation modal appears on revocation
- [ ] History shows all consent records with correct status badges
- [ ] PDF download works from history
- [ ] GDPR export downloads complete JSON
- [ ] Patient cannot access other patients' data
- [ ] Rate limiting active on magic link endpoint
- [ ] Git commit: `'Module 6: Patient Portal complete'`

## Claude Code Prompt

```
Modules 0-5 are complete. Build the patient self-service portal.

FIRST: Read CLAUDE.md and modules/MODULE_06_PORTAL.md for specifications.
ALSO READ: docs/private/TECH_SPEC.md §4 Module 6 for detailed prompt.

Build:
1. Magic link auth (send email via Resend, verify token, rate limit)
2. Portal layout — simple, mobile-first, calming healthcare design (NOT admin style)
3. Preference toggles with confirmation modals, Dynamics sync via queue
4. Consent history cards with PDF download and revocation
5. GDPR data export endpoint

CRITICAL: Separate auth context from admin. Patient sees ONLY their data.
The portal design should feel completely different from the admin dashboard — simpler, calmer, patient-friendly.
```
