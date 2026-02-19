# Module 02: Consent Engine

## Prerequisites
- Module 01 complete — database, auth, and project structure working

## Scope

Build the core consent management functionality: template CRUD, consent capture with digital signatures, validation endpoints, audit logging with SHA-256 checksums, and PDF generation.

## Deliverables

### 1. Zod Schemas (`lib/schemas/`)
- `consentCreate` — patient_id, template_id, channels[], signature_data
- `consentValidate` — patient_id, consent_type
- `consentValidateBulk` — array of validate requests (max 1000)
- `templateCreate/Update` — name, consent_type, regulation_type, legal_text, plain_language, expiration_days

### 2. Consent Templates CRUD
- `GET /api/templates` — List templates (filtered by org)
- `POST /api/templates` — Create template
- `PATCH /api/templates/:id` — Update template
- Admin UI: template list, create/edit form, preview mode
- Seed data: HIPAA Marketing Authorization template

### 3. Consent Capture
- `POST /api/consents` — Create consent record
- Consent form component with:
  - Template display (legal text + plain language summary toggle)
  - Channel checkboxes (email, SMS, phone, mail)
  - Digital signature using `signature_pad` library (canvas drawing)
  - Typed signature fallback option
- Server captures: UTC timestamp, IP address, user agent
- Signature stored as JSON with SVG data
- Status set to `active`, `granted_at` = server timestamp
- `expires_at` calculated from template's `expiration_days`

### 4. Consent Validation
- `POST /api/consents/validate` — Single validation
- `POST /api/consents/validate-bulk` — Bulk (up to 1000)
- Checks: record exists, status=active, not expired, type matches
- Returns: `{valid: boolean, expires_at?, reason?}`

### 5. Audit Logging
- Auto-created on: consent_granted, consent_revoked, consent_viewed
- SHA-256 checksum: `hash(id + action + timestamp + JSON(new_values))`
- Server-generated timestamps ONLY
- Utility function: `createAuditLog(params)` used everywhere

### 6. PDF Generation
- Use `pdf-lib` to generate signed consent document
- Contents: legal text, patient name, signature image, timestamp, consent ID, checksum
- Store in cloud storage bucket `consent-pdfs`
- Link stored as `pdf_storage_path` on consent record

## File Structure
```
app/api/
├── consents/
│   ├── route.ts              # POST create
│   ├── validate/route.ts     # POST validate
│   └── validate-bulk/route.ts
├── templates/
│   ├── route.ts              # GET list, POST create
│   └── [id]/route.ts         # PATCH update
components/consent/
├── ConsentForm.tsx            # Full capture form
├── SignaturePad.tsx            # Canvas signature component
├── TypedSignature.tsx         # Text signature fallback
├── TemplateViewer.tsx         # Legal text + plain language
└── ChannelPicker.tsx          # Channel checkboxes
lib/
├── schemas/consent.ts         # Zod schemas
├── audit.ts                   # createAuditLog utility
├── pdf.ts                     # PDF generation
└── crypto.ts                  # SHA-256 checksum generation
```

## Checklist
- [ ] Zod schemas validate correctly (test with invalid data)
- [ ] Template CRUD API returns proper responses
- [ ] HIPAA Marketing Authorization template seeded
- [ ] Consent capture form renders with signature canvas
- [ ] Signature works on desktop (mouse) and mobile (touch)
- [ ] `POST /api/consents` creates record with correct status and timestamps
- [ ] Validation endpoint returns correct results for active/expired/revoked
- [ ] Audit log created with valid SHA-256 checksum on every consent action
- [ ] PDF generated and stored in cloud storage
- [ ] Git commit: `'Module 2: Consent Engine complete'`

## Claude Code Prompt

```
Modules 0-1 are complete. Now build the Consent Engine.

FIRST: Read CLAUDE.md and modules/MODULE_02_CONSENT.md for specifications.
ALSO READ: docs/private/TECH_SPEC.md §4 Module 2 for detailed prompt.

Build:
1. Zod schemas for all consent-related requests/responses
2. Consent Templates CRUD (API + admin UI) — seed a HIPAA Marketing Authorization template
3. Consent Capture: form with signature_pad canvas, channel checkboxes, template viewer
4. Consent Validation: single + bulk endpoints
5. Audit Logging: SHA-256 checksums, server timestamps only
6. PDF Generation: pdf-lib, store in cloud storage

CRITICAL: Server timestamps only. Never trust client timestamps. 
All audit logs must have SHA-256 checksums.
Build on existing codebase. Real Neon database connection via Drizzle.
```
