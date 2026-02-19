# Module 03: Background Jobs

## Prerequisites
- Module 02 complete — consent engine, PDF generation working

## Scope

Add asynchronous job processing for Dynamics sync, email delivery, and PDF generation using BullMQ + Upstash Redis.

## Deliverables

### 1. BullMQ Setup
- Three queues: `dynamics-sync`, `email`, `pdf-generation`
- Connected to Upstash Redis
- Configurable concurrency per queue

### 2. Job Processors
- **dynamics-sync**: Update Dynamics 365 Contact custom fields with consent status
- **email**: Send transactional emails via Resend (magic links, confirmations, notifications)
- **pdf-generation**: Generate consent PDF and store in cloud storage

### 3. Retry & Error Handling
- 3 retries with exponential backoff (1s, 5s, 30s)
- Failed jobs logged to Sentry with full context
- Dead letter queue for permanently failed jobs

### 4. Integration
- After consent capture → enqueue: dynamics-sync, pdf-generation
- After magic link request → enqueue: email
- After consent revocation → enqueue: dynamics-sync, email (notification)
- Track `dynamics_sync_status` on consent record: pending → synced | failed

### 5. Admin Visibility
- `GET /api/admin/queues` — Queue status (waiting, active, completed, failed counts)
- Simple queue status component for admin dashboard

## File Structure
```
lib/
├── queue/
│   ├── client.ts              # BullMQ + Redis connection
│   ├── dynamics-sync.ts       # Dynamics sync processor
│   ├── email.ts               # Email processor
│   └── pdf-generation.ts      # PDF processor
app/api/admin/
└── queues/route.ts            # Queue status endpoint
```

## Checklist
- [ ] BullMQ connects to Upstash Redis
- [ ] Consent capture triggers dynamics-sync and pdf-generation jobs
- [ ] Email queue sends via Resend
- [ ] Failed jobs retry 3 times with backoff
- [ ] Failed jobs appear in Sentry
- [ ] `dynamics_sync_status` updates on consent record
- [ ] Queue status endpoint returns correct counts
- [ ] Git commit: `'Module 3: Background Jobs complete'`

## Claude Code Prompt

```
Modules 0-2 are complete. Add background job processing.

FIRST: Read CLAUDE.md and modules/MODULE_03_JOBS.md for specifications.
ALSO READ: docs/private/TECH_SPEC.md §4 Module 3 for detailed prompt.

Build:
1. BullMQ + Upstash Redis setup with 3 queues (dynamics-sync, email, pdf-generation)
2. Job processors for each queue
3. 3 retries with exponential backoff, Sentry logging on failure
4. Update consent capture to enqueue jobs after save
5. Track dynamics_sync_status on consent records
6. Admin queue status endpoint

Environment variables: UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN, RESEND_API_KEY
```
