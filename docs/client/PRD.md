# ConsentHub — Product Requirements Document

**HIPAA/GDPR Consent Management Platform for Microsoft Dynamics 365**

Prepared for: TAS Incorporated | Version 2.1 | February 2026

📎 See also: DIAGRAMS.md for interactive architecture diagrams

---

## 1. Executive Summary

### 1.1 Product Vision

**ConsentHub** enables healthcare organizations to capture, manage, validate, and audit patient consent with full HIPAA/GDPR compliance, seamlessly integrated into their existing Microsoft Dynamics 365 CRM workflow.

### 1.2 Market Opportunity

OneTrust dominates consent management at $1,000-5,000+/month but isn't healthcare-specific or Dynamics-native. Mid-market healthcare organizations need an affordable, purpose-built solution.

- **Price Point:** $600-2,000/month (60-80% below enterprise alternatives)
- **Target Market:** Healthcare organizations with 20-500 employees using Dynamics 365
- **TAS Advantage:** Existing healthcare client relationships and Dynamics expertise

### 1.3 Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| API Response Time | < 500ms P95 | Consent validation endpoint |
| Dynamics Sync Latency | < 5 seconds | Consent capture to CRM update |
| System Uptime | 99.9% | Monthly SLA |
| Audit Report Generation | < 30 seconds | 10,000 record export |

---

## 2. Infrastructure & Compliance

### 2.1 PHI vs PII: What ConsentHub Stores

| Data Type | Classification | HIPAA Status |
|-----------|---------------|--------------|
| Patient name, email, phone | PII | Not PHI |
| Marketing consent preferences | PII | Not PHI |
| Consent timestamps, signatures | PII | Not PHI |
| **NOT stored:** diagnoses, treatments, conditions | N/A | Would be PHI |

### 2.2 Phased Infrastructure

| Phase | Database Tier | Total Infra/mo | When |
|-------|--------------|----------------|------|
| Development | Free ($0) | ~$50 | Building & testing |
| Pilot | Pro ($25) | ~$135 | First customers |
| **Production** | **Team ($599)** | **~$710** | SOC2 required |

---

## 3. Technology Stack

| Category | Technology | Purpose |
|----------|-----------|---------|
| Frontend | Next.js 16, React 19, TypeScript 5, Tailwind + shadcn/ui | Full-stack framework |
| Backend | Next.js API Routes, Drizzle ORM, BullMQ, Upstash Redis, Zod | API + async processing |
| Database | PostgreSQL 15, Row Level Security, Database Triggers | Multi-tenant data store |
| Infrastructure | Docker, Azure App Service, GitHub Actions | Hosting + CI/CD |
| Integration | Dynamics Dataverse API, OAuth 2.0, Webhooks | CRM sync |

---

## 4. API Endpoints

### Authentication
- `GET /api/auth/azure` — Azure AD SSO
- `POST /api/portal/auth/magic-link` — Patient passwordless login

### Consent Management
- `POST /api/consents` — Capture consent with signature
- `POST /api/consents/validate` — Check consent validity
- `POST /api/consents/validate-bulk` — Bulk validation

### Dynamics 365
- `POST /api/dynamics/webhook` — Contact change notifications
- Custom fields: ch_marketing_email, ch_marketing_sms, ch_consent_date, ch_consent_expires, ch_consent_status

---

## 5. User Personas

- **Sarah Chen (Healthcare Staff)** — Captures consent at check-in
- **Michael Torres (Compliance Officer)** — Manages templates, generates audit reports
- **Maria Garcia (Patient)** — Self-service preference management via portal

---

## 6. Application Pages

### Admin Portal
/login, /dashboard, /patients, /patients/:id, /consents, /templates, /audit, /reports, /settings

### Patient Portal
/portal/verify, /portal/preferences, /portal/history

---

## 7. Development Timeline

12 weeks from kick-off to production. 7 modular build phases.
