# Module 05: Admin Dashboard

## Prerequisites
- Module 04 complete — Dynamics integration working

## Scope

Full admin dashboard with all management pages. Uses shadcn/ui components and real Neon database data via Drizzle ORM.

## Deliverables

### 1. Layout
- Collapsible sidebar navigation (icons + labels, icon-only on collapse)
- Top header: organization name, user avatar dropdown (profile, logout)
- Responsive: sidebar becomes bottom nav or drawer on mobile
- Breadcrumb navigation

### 2. Dashboard (`/dashboard`)
- **Metric Cards** — Total consents, active, expiring in 30d, compliance rate %
- **Recent Activity Feed** — Last 20 audit log entries
- **Consents by Type** — Donut chart (recharts)
- **Monthly Trend** — Line chart showing consents over 6 months
- **Quick Actions** — Capture Consent, Generate Report, View Audit

### 3. Patients (`/patients`, `/patients/:id`)
- **List**: Searchable table, filter by consent status, pagination (25/page)
- **Detail**: Demographics card, consent history timeline, audit trail tab
- "Request Consent" button → opens consent capture modal
- "View in Dynamics" link (opens Dynamics URL)
- Sync status indicator per patient

### 4. Consents (`/consents`)
- List with filters: status, type, date range, search by patient name
- Click row → detail modal: legal text, signature image, metadata, audit trail
- Revoke button with confirmation dialog + reason field
- Download PDF button
- "Retry Sync" button for failed Dynamics syncs

### 5. Templates (`/templates`)
- List with active/inactive toggle
- Create/Edit form: name, consent_type, regulation_type, legal_text, plain_language, expiration_days
- Preview mode: shows how template appears to patients
- Version indicator

### 6. Audit Log (`/audit`)
- Full-text search across action, patient name, user
- Filter by: action type, date range, user
- Expandable rows showing old_values / new_values diff (JSON)
- "Verify Checksums" button — batch verification with progress bar
- Export: CSV and PDF buttons

### 7. Reports (`/reports`)
- Report types: Full Audit Trail, HIPAA Compliance Summary, Consent Statistics
- Date range picker
- Generate button with progress indicator
- Download as PDF or ZIP (multiple reports)
- Report history list

### 8. Settings (`/settings`)
- **Tabs**: Organization, Users, Dynamics, Email, Notifications
- Organization: name, logo upload, timezone
- Users: list, invite, role management (admin/staff/compliance/readonly)
- Dynamics: connection config, test button, sync status
- Email: from address, template customization
- Notifications: alert preferences

## Checklist
- [ ] Layout renders with sidebar, header, responsive design
- [ ] Dashboard shows real metrics from Neon database
- [ ] Charts render with real data
- [ ] Patient list: search works, filter works, pagination works
- [ ] Patient detail: consent history loads, audit trail loads
- [ ] Consent capture modal completes full flow
- [ ] Consent revocation workflow with audit trail
- [ ] Template CRUD with preview
- [ ] Audit log search and checksum verification
- [ ] Reports generate and download
- [ ] Settings tabs all functional
- [ ] Mobile responsive at 375px
- [ ] Git commit: `'Module 5: Admin Dashboard complete'`

## Claude Code Prompt

```
Modules 0-4 are complete. Build the admin dashboard.

FIRST: Read CLAUDE.md and modules/MODULE_05_ADMIN.md for specifications.
ALSO READ: docs/private/TECH_SPEC.md §4 Module 5 for detailed prompt.

Build all admin pages using shadcn/ui with REAL data from Neon via Drizzle:
1. Layout: collapsible sidebar, header with user dropdown, responsive
2. Dashboard: metric cards, activity feed, charts (recharts)
3. Patients: list (search/filter/paginate), detail with consent history
4. Consents: list with filters, detail modal, revoke workflow, PDF download
5. Templates: CRUD with preview mode
6. Audit: searchable log, expandable rows, checksum verification, export
7. Reports: generate and download PDF/ZIP
8. Settings: org, users, Dynamics config, email, notifications

Every page uses real Drizzle ORM queries against Neon. No mock data.
```
