# ConsentHub MVP Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a production-ready ConsentHub MVP with database, auth, consent engine, Dynamics 365 sync, admin dashboard, and deployment infrastructure.

**Architecture:** Next.js 16 App Router with Drizzle ORM on Neon PostgreSQL, Clerk authentication with Azure AD SSO, Upstash Redis for rate limiting, and Railway for hosting. App-level RLS enforcement (not Postgres-level) since Clerk doesn't integrate with Postgres auth context. All audit logs immutable with SHA-256 checksums.

**Tech Stack:** Next.js 16, TypeScript 5.7 strict, Tailwind CSS 4, shadcn/ui, Drizzle ORM, Neon PostgreSQL, Clerk Auth, Upstash Redis, Resend, Sentry, signature_pad, pdf-lib, Zod, Recharts

**Reference Files:**
- Design doc: `docs/plans/2026-02-23-consenthub-production-readiness-design.md`
- Module specs: `modules/MODULE_01_FOUNDATION.md` through `MODULE_07_LAUNCH.md`
- Tech spec: `docs/private/TECH_SPEC.md` (full SQL schema, package.json, Docker config)
- Demo components to reuse patterns from: `demo/src/components/`

**Prerequisites Chris Must Provide:**
- Neon database project URL (DATABASE_URL, DIRECT_URL)
- Clerk account keys (NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY, CLERK_SECRET_KEY)
- Azure AD app registration (AZURE_AD_CLIENT_ID, AZURE_AD_CLIENT_SECRET, AZURE_AD_TENANT_ID)
- Dynamics 365 sandbox (DYNAMICS_ORG_URL, DYNAMICS_CLIENT_ID, DYNAMICS_CLIENT_SECRET, DYNAMICS_WEBHOOK_SECRET)
- Resend API key (RESEND_API_KEY)
- Sentry DSN (SENTRY_DSN)

---

## Task 1: Project Scaffold & Configuration

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next.config.ts`
- Create: `tailwind.config.ts` (or CSS-based Tailwind 4 config)
- Create: `drizzle.config.ts`
- Create: `.env.local.example`
- Create: `src/app/layout.tsx`
- Create: `src/app/page.tsx`
- Create: `src/lib/utils.ts`

**Step 1: Initialize Next.js project at repo root**

Run: `npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --no-git`

If prompted about existing files, we need to be careful not to overwrite demo/ or docs/. Alternatively, manually create the scaffold:

```bash
npm init -y
npm install next@^16.0.0 react@^19 react-dom@^19
npm install drizzle-orm @neondatabase/serverless @clerk/nextjs zod date-fns uuid
npm install -D typescript @types/react @types/node tailwindcss drizzle-kit tsx
```

**Step 2: Configure TypeScript strict mode**

`tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules", "demo", "video"]
}
```

**Step 3: Configure Next.js for standalone output**

`next.config.ts`:
```typescript
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  experimental: {
    typedRoutes: true,
  },
  headers: async () => [
    {
      source: '/:path*',
      headers: [
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'X-XSS-Protection', value: '1; mode=block' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
      ],
    },
  ],
};

export default nextConfig;
```

**Step 4: Create .env.local.example**

```bash
# Database (Neon)
DATABASE_URL=postgresql://user:pass@xxxx.neon.tech/consenthub
DIRECT_URL=postgresql://user:pass@xxxx.neon.tech/consenthub

# Auth (Clerk)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_xxxx
CLERK_SECRET_KEY=sk_xxxx

# Redis (Upstash)
UPSTASH_REDIS_REST_URL=https://xxxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=xxxx

# Azure AD (configured in Clerk)
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
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=ConsentHub
```

**Step 5: Configure Drizzle**

`drizzle.config.ts`:
```typescript
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/lib/db/schema.ts',
  out: './drizzle/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
```

**Step 6: Install shadcn/ui and configure base components**

Run: `npx shadcn@latest init`

Then install core components:
```bash
npx shadcn@latest add button card badge input label select separator dialog dropdown-menu table tabs toast textarea checkbox
```

**Step 7: Create minimal layout and landing page**

`src/app/layout.tsx` — Root layout with Clerk provider, Tailwind, fonts (DM Serif Display + Plus Jakarta Sans to match demo).

`src/app/page.tsx` — Redirect to `/dashboard` or show a minimal landing.

**Step 8: Verify dev server starts**

Run: `npm run dev`
Expected: Server starts at http://localhost:3000 without errors.

**Step 9: Commit**

```bash
git add package.json tsconfig.json next.config.ts drizzle.config.ts .env.local.example src/
git commit -m "Task 1: Project scaffold with Next.js 15.3, TypeScript strict, Tailwind, shadcn/ui, Drizzle config"
```

---

## Task 2: Database Schema & Drizzle ORM

**Files:**
- Create: `src/lib/db/index.ts` (Drizzle client + Neon connection)
- Create: `src/lib/db/schema.ts` (All 6 tables + 5 enums in Drizzle format)
- Create: `drizzle/migrations/0001_initial_schema.sql` (Generated by Drizzle Kit)
- Create: `scripts/seed.ts` (Test data seeder)

**Step 1: Create Drizzle schema with all tables and enums**

`src/lib/db/schema.ts` — Define using Drizzle's pgTable, pgEnum:

```typescript
import { pgTable, pgEnum, uuid, varchar, text, boolean, integer, timestamp, inet, jsonb, date, uniqueIndex } from 'drizzle-orm/pg-core';

// Enums
export const consentTypeEnum = pgEnum('consent_type', [
  'marketing_email', 'marketing_sms', 'marketing_phone', 'marketing_mail',
  'treatment', 'research', 'data_sharing', 'hipaa_authorization',
]);

export const regulationTypeEnum = pgEnum('regulation_type', [
  'hipaa', 'gdpr', 'tcpa', 'ccpa', 'state_specific',
]);

export const consentStatusEnum = pgEnum('consent_status', [
  'pending', 'active', 'revoked', 'expired',
]);

export const auditActionEnum = pgEnum('audit_action', [
  'consent_granted', 'consent_revoked', 'consent_viewed', 'consent_exported',
  'patient_created', 'patient_updated', 'user_login', 'settings_changed',
  'dynamics_sync', 'report_generated',
]);

export const userRoleEnum = pgEnum('user_role', [
  'admin', 'staff', 'compliance', 'readonly',
]);

// Tables — see TECH_SPEC.md §3.2 for exact columns
export const organizations = pgTable('organizations', { /* ... full definition */ });
export const users = pgTable('users', { /* ... */ });
export const patients = pgTable('patients', { /* ... */ });
export const consentTemplates = pgTable('consent_templates', { /* ... */ });
export const consents = pgTable('consents', { /* ... */ });
export const auditLogs = pgTable('audit_logs', { /* ... */ });
```

Exact column definitions per TECH_SPEC.md §3.2. Include all foreign keys, defaults, and constraints.

**Step 2: Create Neon connection client**

`src/lib/db/index.ts`:
```typescript
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql, { schema });
```

**Step 3: Generate and push migration**

Run: `npx drizzle-kit push`
Expected: All 6 tables created in Neon. Verify in Neon dashboard.

**Step 4: Apply immutability triggers manually**

These cannot be expressed in Drizzle schema, so create a SQL migration:

`drizzle/migrations/0002_audit_immutability.sql`:
```sql
CREATE OR REPLACE FUNCTION prevent_audit_modification()
RETURNS TRIGGER AS $$
BEGIN
  RAISE EXCEPTION 'Audit logs are immutable. % not permitted.', TG_OP;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER audit_logs_no_update
  BEFORE UPDATE ON audit_logs
  FOR EACH ROW EXECUTE FUNCTION prevent_audit_modification();

CREATE TRIGGER audit_logs_no_delete
  BEFORE DELETE ON audit_logs
  FOR EACH ROW EXECUTE FUNCTION prevent_audit_modification();
```

Run manually via Neon SQL editor or `psql`.

**Step 5: Create seed script**

`scripts/seed.ts` — Creates:
- 1 test organization ("TAS Healthcare Demo")
- 2 test users (admin + staff)
- 5 test patients with realistic names
- 3 consent templates (HIPAA Marketing Auth, GDPR Data Processing, TCPA Phone Consent)
- 10 test consents across patients
- 20 audit log entries with valid SHA-256 checksums

Run: `npx tsx scripts/seed.ts`
Expected: Data visible in Neon dashboard.

**Step 6: Test audit immutability**

Run via Neon SQL editor:
```sql
UPDATE audit_logs SET action = 'consent_revoked' WHERE id = '<any-id>';
```
Expected: ERROR — "Audit logs are immutable. UPDATE not permitted."

**Step 7: Commit**

```bash
git add src/lib/db/ drizzle/ scripts/
git commit -m "Task 2: Database schema — 6 tables, 5 enums, RLS, immutability triggers, seed data"
```

---

## Task 3: Authentication & Security Middleware

**Files:**
- Create: `src/middleware.ts` (Clerk auth middleware + route protection)
- Create: `src/lib/auth/index.ts` (Auth utilities: getCurrentUser, requireRole)
- Create: `src/lib/auth/roles.ts` (RBAC constants and helpers)
- Create: `src/lib/security/rate-limit.ts` (Upstash rate limiter)
- Create: `src/lib/security/sanitize.ts` (PII scrubbing for logs)
- Create: `src/app/(auth)/sign-in/[[...sign-in]]/page.tsx` (Clerk sign-in page)
- Create: `src/app/(auth)/sign-up/[[...sign-up]]/page.tsx` (Clerk sign-up page)

**Step 1: Configure Clerk middleware**

`src/middleware.ts`:
```typescript
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/dynamics/webhook',  // Webhook uses its own HMAC auth
  '/api/health',
  '/',
]);

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: ['/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)'],
};
```

**Step 2: Create auth utilities**

`src/lib/auth/index.ts`:
```typescript
import { auth, currentUser } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function getCurrentDbUser() {
  const { userId } = await auth();
  if (!userId) return null;

  const [user] = await db.select().from(users).where(eq(users.clerkId, userId)).limit(1);
  return user ?? null;
}

export async function requireAuth() {
  const user = await getCurrentDbUser();
  if (!user) throw new Error('Unauthorized');
  return user;
}

export async function requireRole(allowedRoles: string[]) {
  const user = await requireAuth();
  if (!allowedRoles.includes(user.role)) {
    throw new Error('Forbidden');
  }
  return user;
}
```

Note: Schema needs a `clerk_id` column on `users` table to link Clerk sessions to DB users. Add this to schema.

**Step 3: Create rate limiter**

`src/lib/security/rate-limit.ts`:
```typescript
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export const rateLimiters = {
  api: new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(100, '1 m') }),
  consentCapture: new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(20, '1 h') }),
  magicLink: new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(3, '1 h') }),
};
```

**Step 4: Create PII sanitizer**

`src/lib/security/sanitize.ts`:
```typescript
const PII_FIELDS = ['email', 'phone', 'firstName', 'lastName', 'dateOfBirth', 'externalMrn', 'first_name', 'last_name', 'date_of_birth', 'external_mrn'];

export function sanitizeForLogging(obj: unknown): unknown {
  if (typeof obj !== 'object' || obj === null) return obj;
  const sanitized = { ...obj as Record<string, unknown> };
  for (const field of PII_FIELDS) {
    if (field in sanitized) sanitized[field] = '[REDACTED]';
  }
  return sanitized;
}
```

**Step 5: Create Clerk sign-in page**

`src/app/(auth)/sign-in/[[...sign-in]]/page.tsx`:
```tsx
import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <SignIn />
    </div>
  );
}
```

**Step 6: Verify auth flow**

Run: `npm run dev`
Navigate to `/dashboard` → should redirect to Clerk sign-in.
Sign in → should redirect back to `/dashboard`.

**Step 7: Commit**

```bash
git add src/middleware.ts src/lib/auth/ src/lib/security/ src/app/(auth)/
git commit -m "Task 3: Auth middleware, RBAC, rate limiting, PII sanitizer, Clerk sign-in"
```

---

## Task 4: Audit Logging System

**Files:**
- Create: `src/lib/audit.ts` (createAuditLog utility with SHA-256 checksums)
- Create: `src/lib/crypto.ts` (SHA-256 checksum generation)
- Create: `src/lib/audit.test.ts` (Unit tests for checksum generation)

**Step 1: Write the failing test**

`src/lib/__tests__/audit.test.ts`:
```typescript
import { generateChecksum } from '@/lib/crypto';

describe('Audit Checksum', () => {
  it('generates consistent SHA-256 for same input', () => {
    const hash1 = generateChecksum('abc123', 'consent_granted', '2026-01-01T00:00:00Z', '{}');
    const hash2 = generateChecksum('abc123', 'consent_granted', '2026-01-01T00:00:00Z', '{}');
    expect(hash1).toBe(hash2);
    expect(hash1).toHaveLength(64); // SHA-256 hex is 64 chars
  });

  it('produces different hash for different input', () => {
    const hash1 = generateChecksum('id1', 'consent_granted', '2026-01-01T00:00:00Z', '{}');
    const hash2 = generateChecksum('id2', 'consent_granted', '2026-01-01T00:00:00Z', '{}');
    expect(hash1).not.toBe(hash2);
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npx jest src/lib/__tests__/audit.test.ts`
Expected: FAIL — module not found.

**Step 3: Implement crypto utility**

`src/lib/crypto.ts`:
```typescript
import { createHash } from 'crypto';

export function generateChecksum(
  entityId: string,
  action: string,
  timestamp: string,
  newValues: string
): string {
  return createHash('sha256')
    .update(entityId + action + timestamp + newValues)
    .digest('hex');
}
```

**Step 4: Implement createAuditLog**

`src/lib/audit.ts`:
```typescript
import { db } from '@/lib/db';
import { auditLogs } from '@/lib/db/schema';
import { generateChecksum } from '@/lib/crypto';
import { sanitizeForLogging } from '@/lib/security/sanitize';

interface AuditInput {
  organizationId: string;
  action: typeof auditLogs.$inferInsert['action'];
  entityType: string;
  entityId?: string;
  consentId?: string;
  patientId?: string;
  userId?: string;
  oldValues?: Record<string, unknown>;
  newValues?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
}

export async function createAuditLog(input: AuditInput) {
  const now = new Date();
  const sanitizedOld = input.oldValues ? sanitizeForLogging(input.oldValues) : null;
  const sanitizedNew = input.newValues ? sanitizeForLogging(input.newValues) : null;

  const checksum = generateChecksum(
    input.entityId ?? '',
    input.action,
    now.toISOString(),
    JSON.stringify(sanitizedNew ?? {})
  );

  const [log] = await db.insert(auditLogs).values({
    organizationId: input.organizationId,
    action: input.action,
    entityType: input.entityType,
    entityId: input.entityId,
    consentId: input.consentId,
    patientId: input.patientId,
    userId: input.userId,
    oldValues: sanitizedOld,
    newValues: sanitizedNew,
    ipAddress: input.ipAddress,
    userAgent: input.userAgent,
    timestamp: now,
    checksum,
  }).returning();

  return log;
}
```

**Step 5: Run test to verify it passes**

Run: `npx jest src/lib/__tests__/audit.test.ts`
Expected: PASS.

**Step 6: Commit**

```bash
git add src/lib/audit.ts src/lib/crypto.ts src/lib/__tests__/
git commit -m "Task 4: Audit logging with SHA-256 checksums and PII sanitization"
```

---

## Task 5: Consent Templates API

**Files:**
- Create: `src/lib/schemas/consent.ts` (Zod schemas)
- Create: `src/app/api/templates/route.ts` (GET list, POST create)
- Create: `src/app/api/templates/[id]/route.ts` (PATCH update)

**Step 1: Write Zod schemas**

`src/lib/schemas/consent.ts`:
```typescript
import { z } from 'zod';

export const templateCreateSchema = z.object({
  name: z.string().min(1).max(255),
  consentType: z.enum(['marketing_email', 'marketing_sms', 'marketing_phone', 'marketing_mail', 'treatment', 'research', 'data_sharing', 'hipaa_authorization']),
  regulationType: z.enum(['hipaa', 'gdpr', 'tcpa', 'ccpa', 'state_specific']),
  legalText: z.string().min(10),
  plainLanguageSummary: z.string().min(10),
  expirationDays: z.number().int().positive().optional(),
  requiresWitness: z.boolean().default(false),
  customFields: z.array(z.record(z.unknown())).default([]),
});

export const templateUpdateSchema = templateCreateSchema.partial();

export const consentCreateSchema = z.object({
  patientId: z.string().uuid(),
  templateId: z.string().uuid(),
  channels: z.array(z.enum(['email', 'sms', 'phone', 'mail'])).min(1),
  signatureData: z.object({
    type: z.enum(['drawn', 'typed']),
    data: z.string().max(100000),
  }),
});

export const consentValidateSchema = z.object({
  patientId: z.string().uuid(),
  consentType: z.enum(['marketing_email', 'marketing_sms', 'marketing_phone', 'marketing_mail', 'treatment', 'research', 'data_sharing', 'hipaa_authorization']),
});

export const consentValidateBulkSchema = z.object({
  requests: z.array(consentValidateSchema).max(1000),
});

export const paginationSchema = z.object({
  cursor: z.string().uuid().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(25),
});
```

**Step 2: Build templates API routes**

`src/app/api/templates/route.ts`:
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { consentTemplates } from '@/lib/db/schema';
import { requireRole } from '@/lib/auth';
import { templateCreateSchema } from '@/lib/schemas/consent';
import { createAuditLog } from '@/lib/audit';
import { eq } from 'drizzle-orm';

export async function GET(req: NextRequest) {
  const user = await requireRole(['admin', 'staff', 'compliance', 'readonly']);
  const templates = await db.select()
    .from(consentTemplates)
    .where(eq(consentTemplates.organizationId, user.organizationId));
  return NextResponse.json({ data: templates });
}

export async function POST(req: NextRequest) {
  const user = await requireRole(['admin']);
  const body = await req.json();
  const validated = templateCreateSchema.parse(body);

  const [template] = await db.insert(consentTemplates).values({
    organizationId: user.organizationId,
    name: validated.name,
    consentType: validated.consentType,
    regulationType: validated.regulationType,
    legalText: validated.legalText,
    plainLanguageSummary: validated.plainLanguageSummary,
    expirationDays: validated.expirationDays,
    requiresWitness: validated.requiresWitness,
    customFields: validated.customFields,
  }).returning();

  await createAuditLog({
    organizationId: user.organizationId,
    action: 'settings_changed',
    entityType: 'consent_template',
    entityId: template.id,
    userId: user.id,
    newValues: { name: validated.name, consentType: validated.consentType },
    ipAddress: req.headers.get('x-forwarded-for') ?? undefined,
    userAgent: req.headers.get('user-agent') ?? undefined,
  });

  return NextResponse.json({ data: template }, { status: 201 });
}
```

`src/app/api/templates/[id]/route.ts` — PATCH handler with `templateUpdateSchema` validation, audit log, org isolation check.

**Step 3: Verify API works**

Run: `npm run dev`
Test: `curl -X GET http://localhost:3000/api/templates` (with auth cookie)
Expected: JSON response with template list.

**Step 4: Commit**

```bash
git add src/lib/schemas/ src/app/api/templates/
git commit -m "Task 5: Consent templates API — CRUD with Zod validation and audit logging"
```

---

## Task 6: Consent Capture API & Signature Component

**Files:**
- Create: `src/app/api/consents/route.ts` (POST create)
- Create: `src/app/api/consents/validate/route.ts` (POST single validation)
- Create: `src/app/api/consents/validate-bulk/route.ts` (POST bulk validation)
- Create: `src/app/api/patients/route.ts` (GET list, POST create)
- Create: `src/app/api/patients/[id]/route.ts` (GET detail)
- Create: `src/app/api/patients/[id]/consents/route.ts` (GET patient consents)
- Create: `src/components/consent/SignaturePad.tsx`
- Create: `src/components/consent/ConsentForm.tsx`

**Step 1: Build consent creation endpoint**

`src/app/api/consents/route.ts`:
- Validate with `consentCreateSchema`
- Verify patient belongs to user's org (app-level RLS)
- Verify template belongs to user's org
- Calculate `expires_at` from template's `expirationDays`
- Set `status: 'active'`, `granted_at: new Date()` (server timestamp)
- Store signature data as JSONB
- Capture `ip_address` and `user_agent` from request headers
- Create audit log with `consent_granted` action
- Return created consent

**Step 2: Build consent validation endpoint**

`src/app/api/consents/validate/route.ts`:
- Accept `patientId` + `consentType`
- Query: `WHERE patient_id = ? AND consent_type = ? AND status = 'active' AND (expires_at IS NULL OR expires_at > NOW())`
- Return: `{ valid: boolean, consent?: { id, grantedAt, expiresAt }, reason?: string }`

**Step 3: Build bulk validation endpoint**

`src/app/api/consents/validate-bulk/route.ts`:
- Accept array of `{ patientId, consentType }` (max 1000)
- Run all validations in a single query with `IN` clause
- Return array of results

**Step 4: Build patients API**

`src/app/api/patients/route.ts`:
- GET: List patients for org with cursor pagination, search by name/email/MRN
- POST: Create patient with org isolation

`src/app/api/patients/[id]/route.ts`:
- GET: Patient detail with org isolation check

`src/app/api/patients/[id]/consents/route.ts`:
- GET: All consents for this patient (with org isolation)

**Step 5: Build SignaturePad component**

`src/components/consent/SignaturePad.tsx`:
```tsx
'use client';
import { useRef, useEffect } from 'react';
import SignaturePadLib from 'signature_pad';

interface Props {
  onSignature: (data: { type: 'drawn'; data: string }) => void;
  onClear: () => void;
}

export function SignaturePad({ onSignature, onClear }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const padRef = useRef<SignaturePadLib | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      padRef.current = new SignaturePadLib(canvasRef.current, {
        backgroundColor: 'rgb(255, 255, 255)',
      });
    }
    return () => padRef.current?.off();
  }, []);

  const handleSave = () => {
    if (padRef.current && !padRef.current.isEmpty()) {
      onSignature({ type: 'drawn', data: padRef.current.toDataURL('image/svg+xml') });
    }
  };

  const handleClear = () => {
    padRef.current?.clear();
    onClear();
  };

  return (
    <div>
      <canvas ref={canvasRef} className="border rounded-lg w-full h-48" />
      <div className="flex gap-2 mt-2">
        <button onClick={handleClear}>Clear</button>
        <button onClick={handleSave}>Accept Signature</button>
      </div>
    </div>
  );
}
```

**Step 6: Build ConsentForm component**

`src/components/consent/ConsentForm.tsx` — Multi-step form similar to demo's ConsentWizard:
1. Template select
2. Legal text review with checkbox
3. Channel selection (checkboxes)
4. Signature capture (drawn or typed)
5. Confirmation summary
6. Submit → POST /api/consents

Reference `demo/src/components/demo/consent/ConsentWizard.tsx` for UI patterns but use real API calls instead of mock data.

**Step 7: Verify consent capture flow**

Run: `npm run dev`
Navigate to consent form, select template, sign, submit.
Check Neon DB: consent record exists with correct status, timestamps, signature data.
Check audit_logs: `consent_granted` entry with valid checksum.

**Step 8: Commit**

```bash
git add src/app/api/consents/ src/app/api/patients/ src/components/consent/
git commit -m "Task 6: Consent capture API, validation endpoints, signature component"
```

---

## Task 7: Dynamics 365 Integration (Basic One-Way Sync)

**Files:**
- Create: `src/lib/dynamics/client.ts` (OAuth client + Dataverse API wrapper)
- Create: `src/lib/dynamics/auth.ts` (Token management with caching)
- Create: `src/lib/dynamics/sync.ts` (Sync logic: ConsentHub → Dynamics)
- Create: `src/lib/dynamics/types.ts` (Dynamics API types)
- Create: `src/app/api/dynamics/webhook/route.ts` (Webhook receiver)
- Create: `src/app/api/dynamics/status/route.ts` (Health check)
- Create: `src/app/api/dynamics/test/route.ts` (Credential test)

**Step 1: Build OAuth token manager**

`src/lib/dynamics/auth.ts`:
```typescript
interface TokenCache {
  accessToken: string;
  expiresAt: number;
}

let tokenCache: TokenCache | null = null;

export async function getDynamicsToken(): Promise<string> {
  if (tokenCache && tokenCache.expiresAt > Date.now() + 60000) {
    return tokenCache.accessToken;
  }

  const response = await fetch(
    `https://login.microsoftonline.com/${process.env.AZURE_AD_TENANT_ID}/oauth2/v2.0/token`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: process.env.DYNAMICS_CLIENT_ID!,
        client_secret: process.env.DYNAMICS_CLIENT_SECRET!,
        scope: `${process.env.DYNAMICS_ORG_URL}/.default`,
        grant_type: 'client_credentials',
      }),
    }
  );

  const data = await response.json();
  tokenCache = {
    accessToken: data.access_token,
    expiresAt: Date.now() + (data.expires_in * 1000),
  };

  return tokenCache.accessToken;
}
```

**Step 2: Build Dataverse API client**

`src/lib/dynamics/client.ts`:
```typescript
import { getDynamicsToken } from './auth';

const BASE_URL = process.env.DYNAMICS_ORG_URL!;

async function dynamicsRequest(path: string, options: RequestInit = {}) {
  const token = await getDynamicsToken();
  const response = await fetch(`${BASE_URL}/api/data/v9.2${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'OData-MaxVersion': '4.0',
      'OData-Version': '4.0',
      ...options.headers,
    },
  });

  if (response.status === 401) {
    // Token expired, clear cache and retry once
    tokenCache = null;
    return dynamicsRequest(path, options);
  }

  return response;
}

export async function getContact(contactId: string) {
  const res = await dynamicsRequest(`/contacts(${contactId})`);
  return res.json();
}

export async function updateContact(contactId: string, fields: Record<string, unknown>) {
  return dynamicsRequest(`/contacts(${contactId})`, {
    method: 'PATCH',
    body: JSON.stringify(fields),
  });
}
```

**Step 3: Build consent → Dynamics sync function**

`src/lib/dynamics/sync.ts`:
```typescript
import { updateContact } from './client';
import { db } from '@/lib/db';
import { patients, consents } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { createAuditLog } from '@/lib/audit';

export async function syncConsentToDynamics(consentId: string) {
  // Fetch consent + patient + determine fields to update
  // Map consent type → Dynamics custom field (ch_marketing_email, etc.)
  // PATCH Dynamics Contact with updated boolean fields + dates
  // Update consent.dynamics_sync_status = 'synced'
  // Create audit log entry
}
```

Field mapping (per MODULE_04):
- `marketing_email` → `ch_marketing_email: true/false`
- `marketing_sms` → `ch_marketing_sms: true/false`
- `marketing_phone` → `ch_marketing_phone: true/false`
- `marketing_mail` → `ch_marketing_mail: true/false`
- Consent date → `ch_consent_date`
- Expiration → `ch_consent_expires`
- Status → `ch_consent_status`
- Sync timestamp → `ch_last_sync`

**Step 4: Build webhook receiver**

`src/app/api/dynamics/webhook/route.ts`:
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { createHmac, timingSafeEqual } from 'crypto';
import { createAuditLog } from '@/lib/audit';

function validateSignature(body: string, signature: string): boolean {
  const expected = createHmac('sha256', process.env.DYNAMICS_WEBHOOK_SECRET!)
    .update(body)
    .digest('hex');
  try {
    return timingSafeEqual(Buffer.from(signature, 'hex'), Buffer.from(expected, 'hex'));
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  const signature = req.headers.get('x-dynamics-signature');
  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 401 });
  }

  const body = await req.text();
  if (!validateSignature(body, signature)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  const event = JSON.parse(body);
  // Process: Contact Created → create patient, Contact Updated → update patient
  // Return 200 immediately

  return NextResponse.json({ received: true });
}
```

**Step 5: Build health check and test endpoints**

`src/app/api/dynamics/status/route.ts` — GET, returns connection status.
`src/app/api/dynamics/test/route.ts` — POST, tests credentials, returns org info.

**Step 6: Add sync call to consent creation**

In `src/app/api/consents/route.ts`, after creating consent:
```typescript
// Trigger Dynamics sync (synchronous for MVP, async in Phase 2)
if (patient.dynamicsContactId) {
  try {
    await syncConsentToDynamics(consent.id);
  } catch (error) {
    // Log but don't fail the consent creation
    console.error('[Dynamics Sync Failed]', error instanceof Error ? error.message : 'Unknown');
    // Mark sync as failed for retry
    await db.update(consents).set({ dynamicsSyncStatus: 'failed' }).where(eq(consents.id, consent.id));
  }
}
```

**Step 7: Verify integration**

Test: Create consent for patient with `dynamics_contact_id` → verify Dynamics Contact updated.
Test: Send webhook with valid signature → verify patient created/updated in Neon.
Test: Send webhook with invalid signature → verify 401 returned.

**Step 8: Commit**

```bash
git add src/lib/dynamics/ src/app/api/dynamics/
git commit -m "Task 7: Dynamics 365 integration — OAuth, sync, webhook with HMAC validation"
```

---

## Task 8: Admin Dashboard Layout & Navigation

**Files:**
- Create: `src/app/(admin)/layout.tsx` (Authenticated admin layout)
- Create: `src/components/admin/Sidebar.tsx` (Collapsible sidebar)
- Create: `src/components/admin/Header.tsx` (Top header with user dropdown)
- Create: `src/components/admin/Breadcrumb.tsx`

**Step 1: Build admin layout**

`src/app/(admin)/layout.tsx`:
```tsx
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { Sidebar } from '@/components/admin/Sidebar';
import { Header } from '@/components/admin/Header';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
```

**Step 2: Build Sidebar component**

Reference `demo/src/components/demo/DemoSidebar.tsx` for UI patterns but adapt for production:
- Navigation items: Dashboard, Patients, Consents, Templates, Audit Log, Reports, Settings
- Collapsible with smooth animation
- Active route indicator
- Mobile responsive (drawer overlay)
- "Demo Mode" badge removed, replace with org name

**Step 3: Build Header component**

Reference `demo/src/components/demo/DemoHeader.tsx`:
- User avatar dropdown (from Clerk's `<UserButton />`)
- Organization name badge
- Mobile menu toggle
- Breadcrumb below header

**Step 4: Verify layout**

Run: `npm run dev`
Navigate to `/dashboard` → should see sidebar + header + empty content area.
Sidebar links work, responsive on mobile, user dropdown shows.

**Step 5: Commit**

```bash
git add src/app/(admin)/ src/components/admin/
git commit -m "Task 8: Admin layout — sidebar, header, breadcrumb, responsive design"
```

---

## Task 9: Dashboard Page with Real Data

**Files:**
- Create: `src/app/(admin)/dashboard/page.tsx`
- Create: `src/components/admin/dashboard/MetricCards.tsx`
- Create: `src/components/admin/dashboard/MonthlyTrendChart.tsx`
- Create: `src/components/admin/dashboard/ActivityFeed.tsx`
- Create: `src/components/admin/dashboard/ConsentsByTypeChart.tsx`
- Create: `src/app/api/dashboard/stats/route.ts` (Aggregation queries)

**Step 1: Build dashboard stats API**

`src/app/api/dashboard/stats/route.ts`:
```typescript
// Query Neon for real metrics:
// - Total patients (count from patients where org_id = ?)
// - Active consents (count from consents where status = 'active' and org_id = ?)
// - Expiring in 30 days (count where expires_at BETWEEN NOW() AND NOW() + 30 days)
// - Compliance rate (active / (active + expired + revoked) * 100)
// - Monthly trend (group by month, last 6 months)
// - Consents by type (group by consent_type)
// - Recent activity (last 20 audit_logs)
```

**Step 2: Build MetricCards**

Reference `demo/src/components/demo/dashboard/MetricCards.tsx` for animated counter pattern but fetch from API.

**Step 3: Build charts**

Install recharts: `npm install recharts`

Reference `demo/src/components/demo/dashboard/MonthlyTrendChart.tsx` and `ConsentsByTypeChart.tsx` but wire to real data.

**Step 4: Build ActivityFeed**

Reference `demo/src/components/demo/dashboard/ActivityFeed.tsx` but fetch from `/api/dashboard/stats`.

**Step 5: Verify dashboard**

Run: `npm run dev`
Navigate to `/dashboard` → should see real metrics from seeded data.
Charts should render with correct data.

**Step 6: Commit**

```bash
git add src/app/(admin)/dashboard/ src/components/admin/dashboard/ src/app/api/dashboard/
git commit -m "Task 9: Dashboard with real metrics, charts, and activity feed"
```

---

## Task 10: Patient Management Pages

**Files:**
- Create: `src/app/(admin)/patients/page.tsx` (Patient list)
- Create: `src/app/(admin)/patients/[id]/page.tsx` (Patient detail)
- Create: `src/components/admin/patients/PatientTable.tsx`
- Create: `src/components/admin/patients/PatientDetail.tsx`
- Create: `src/components/admin/patients/ConsentTimeline.tsx`

**Step 1: Build patient list page**

Reference `demo/src/components/demo/patients/PatientTable.tsx` for:
- Search input with debounce
- Status filter dropdown
- Consent type filter
- Paginated table with cursor pagination
- Mobile card layout
- Skeleton loading states

Wire to `GET /api/patients?search=&status=&cursor=&limit=25`.

**Step 2: Build patient detail page**

Reference `demo/src/app/demo/patients/[id]/PatientDetailClient.tsx` for:
- Patient info card (name, email, DOB, MRN, Dynamics link)
- Consent history timeline
- Audit trail tab
- "Request Consent" button → opens ConsentForm dialog

Wire to `GET /api/patients/[id]` and `GET /api/patients/[id]/consents`.

**Step 3: Verify patient pages**

Run: `npm run dev`
Navigate to `/patients` → should see seeded patients.
Search works. Click patient → detail page loads with consent history.

**Step 4: Commit**

```bash
git add src/app/(admin)/patients/ src/components/admin/patients/
git commit -m "Task 10: Patient list and detail pages with search, filters, consent history"
```

---

## Task 11: Consent Management & Audit Log Pages

**Files:**
- Create: `src/app/(admin)/consents/page.tsx`
- Create: `src/app/(admin)/templates/page.tsx`
- Create: `src/app/(admin)/audit/page.tsx`
- Create: `src/components/admin/consents/ConsentTable.tsx`
- Create: `src/components/admin/consents/ConsentDetailModal.tsx`
- Create: `src/components/admin/consents/RevokeDialog.tsx`
- Create: `src/components/admin/audit/AuditLogTable.tsx`
- Create: `src/app/api/audit/route.ts` (GET with search, filter, pagination)
- Create: `src/app/api/audit/verify/route.ts` (POST batch checksum verification)

**Step 1: Build consents page**

- Table with filters: status, type, date range, search
- Click row → detail modal showing: legal text, signature image, metadata, full audit trail
- Revoke button → confirmation dialog with reason field → `PATCH /api/consents/[id]/revoke`
- "Retry Sync" button for failed Dynamics syncs

**Step 2: Build templates page**

- Template list with active/inactive toggle
- Create/Edit form using Zod schema for validation
- Preview mode showing how template appears to patients

**Step 3: Build audit log page**

Reference `demo/src/components/demo/audit/AuditLogTable.tsx` for:
- Full-text search
- Action type filter
- Date range filter
- Expandable rows with old/new values diff
- "Verify Checksums" button → batch verification with progress
- Export CSV button

`src/app/api/audit/route.ts` — GET with search, filters, cursor pagination.
`src/app/api/audit/verify/route.ts` — POST, takes date range, verifies checksums, returns results.

**Step 4: Verify all pages**

Run: `npm run dev`
Navigate to `/consents` → table with seeded data, filters work.
Navigate to `/templates` → CRUD works.
Navigate to `/audit` → search works, verify checksums works.

**Step 5: Commit**

```bash
git add src/app/(admin)/consents/ src/app/(admin)/templates/ src/app/(admin)/audit/ src/components/admin/consents/ src/components/admin/audit/ src/app/api/audit/
git commit -m "Task 11: Consent management, templates, audit log with checksum verification"
```

---

## Task 12: Settings Page

**Files:**
- Create: `src/app/(admin)/settings/page.tsx`
- Create: `src/components/admin/settings/OrganizationSettings.tsx`
- Create: `src/components/admin/settings/UserManagement.tsx`
- Create: `src/components/admin/settings/DynamicsSettings.tsx`
- Create: `src/app/api/settings/route.ts` (GET/PATCH org settings)
- Create: `src/app/api/users/route.ts` (GET list, POST invite)

**Step 1: Build settings tabs**

- **Organization**: Name, timezone, logo upload (store as URL)
- **Users**: List current users, invite new (email + role), remove
- **Dynamics**: Connection config display, test button using `/api/dynamics/test`, sync status
- **Notifications**: Alert preferences (placeholder for Phase 2)

**Step 2: Build user management**

- List users with roles
- Invite form: email + role dropdown
- Role change for existing users (admin only)
- Remove user (admin only, cannot remove self)

**Step 3: Verify settings**

Run: `npm run dev`
Navigate to `/settings` → tabs work, org update saves, user invite works.
Dynamics test button shows connection status.

**Step 4: Commit**

```bash
git add src/app/(admin)/settings/ src/components/admin/settings/ src/app/api/settings/ src/app/api/users/
git commit -m "Task 12: Settings — organization, users, Dynamics config"
```

---

## Task 13: Health Check, Error Handling & API Hardening

**Files:**
- Create: `src/app/api/health/route.ts`
- Create: `src/lib/errors.ts` (Standard error classes and response helper)
- Modify: All API routes to use consistent error handling

**Step 1: Build health check endpoint**

`src/app/api/health/route.ts`:
```typescript
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sql } from 'drizzle-orm';

export async function GET() {
  try {
    await db.execute(sql`SELECT 1`);
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version ?? '1.0.0',
    });
  } catch {
    return NextResponse.json({ status: 'unhealthy' }, { status: 503 });
  }
}
```

**Step 2: Create standard error handler**

`src/lib/errors.ts`:
```typescript
import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

export function handleApiError(error: unknown): NextResponse {
  if (error instanceof ZodError) {
    return NextResponse.json(
      { error: 'Validation failed', details: error.errors.map(e => ({ field: e.path.join('.'), message: e.message })) },
      { status: 400 }
    );
  }

  if (error instanceof Error) {
    if (error.message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (error.message === 'Forbidden') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    if (error.message === 'Not Found') return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  // Never expose internal errors to client
  console.error('[API Error]', error instanceof Error ? error.message : 'Unknown');
  return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
}
```

**Step 3: Add rate limiting to consent endpoints**

Wrap `POST /api/consents` and `POST /api/consents/validate-bulk` with rate limiter.

**Step 4: Verify error handling**

Test: POST invalid JSON to `/api/consents` → 400 with Zod error details.
Test: Access `/api/templates` without auth → 401.
Test: Access `/api/health` → 200 with healthy status.

**Step 5: Commit**

```bash
git add src/app/api/health/ src/lib/errors.ts
git commit -m "Task 13: Health check, standard error handling, rate limiting on consent endpoints"
```

---

## Task 14: Docker & CI/CD

**Files:**
- Create: `Dockerfile`
- Create: `docker-compose.yml`
- Modify: `.github/workflows/deploy.yml` (Add production deploy job)
- Create: `.dockerignore`

**Step 1: Create Dockerfile**

Per TECH_SPEC.md §4 — multi-stage build:
```dockerfile
FROM node:20-alpine AS base

FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => { if(r.statusCode!==200) throw new Error() })"
CMD ["node", "server.js"]
```

**Step 2: Create docker-compose.yml**

```yaml
version: "3.8"
services:
  app:
    build: .
    ports:
      - "3000:3000"
    env_file:
      - .env.local
    depends_on:
      - redis
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
```

**Step 3: Create .dockerignore**

```
node_modules
.next
demo/node_modules
demo/.next
demo/out
video/node_modules
video/out
.git
*.md
docs/
modules/
```

**Step 4: Update CI/CD for production**

Add to `.github/workflows/deploy.yml`:
```yaml
  deploy-production:
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    needs: [test]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run lint
      - run: npm run build
      # Railway deploy (or Docker push for Azure)
```

**Step 5: Verify Docker builds**

Run: `docker build -t consenthub .`
Expected: Image builds successfully.

Run: `docker compose up`
Expected: App starts, health check passes.

**Step 6: Commit**

```bash
git add Dockerfile docker-compose.yml .dockerignore .github/
git commit -m "Task 14: Docker multi-stage build, docker-compose, CI/CD pipeline"
```

---

## Task 15: Core Tests

**Files:**
- Create: `jest.config.ts`
- Create: `src/lib/__tests__/crypto.test.ts` (already partially done in Task 4)
- Create: `src/lib/__tests__/schemas.test.ts` (Zod validation tests)
- Create: `src/lib/__tests__/consent-validation.test.ts` (Business logic tests)

**Step 1: Configure Jest**

```typescript
// jest.config.ts
import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testMatch: ['**/__tests__/**/*.test.ts'],
};

export default config;
```

**Step 2: Write Zod schema tests**

`src/lib/__tests__/schemas.test.ts`:
```typescript
import { consentCreateSchema, templateCreateSchema, consentValidateSchema } from '@/lib/schemas/consent';

describe('consentCreateSchema', () => {
  it('accepts valid consent creation', () => {
    const result = consentCreateSchema.safeParse({
      patientId: '550e8400-e29b-41d4-a716-446655440000',
      templateId: '550e8400-e29b-41d4-a716-446655440001',
      channels: ['email', 'sms'],
      signatureData: { type: 'drawn', data: 'data:image/svg+xml;base64,...' },
    });
    expect(result.success).toBe(true);
  });

  it('rejects empty channels', () => {
    const result = consentCreateSchema.safeParse({
      patientId: '550e8400-e29b-41d4-a716-446655440000',
      templateId: '550e8400-e29b-41d4-a716-446655440001',
      channels: [],
      signatureData: { type: 'drawn', data: 'test' },
    });
    expect(result.success).toBe(false);
  });

  it('rejects invalid UUID for patientId', () => {
    const result = consentCreateSchema.safeParse({
      patientId: 'not-a-uuid',
      templateId: '550e8400-e29b-41d4-a716-446655440001',
      channels: ['email'],
      signatureData: { type: 'drawn', data: 'test' },
    });
    expect(result.success).toBe(false);
  });

  it('rejects oversized signature data', () => {
    const result = consentCreateSchema.safeParse({
      patientId: '550e8400-e29b-41d4-a716-446655440000',
      templateId: '550e8400-e29b-41d4-a716-446655440001',
      channels: ['email'],
      signatureData: { type: 'drawn', data: 'x'.repeat(100001) },
    });
    expect(result.success).toBe(false);
  });
});
```

**Step 3: Run all tests**

Run: `npm run test`
Expected: All tests PASS.

**Step 4: Commit**

```bash
git add jest.config.ts src/lib/__tests__/
git commit -m "Task 15: Core test suite — checksums, Zod schemas, consent validation logic"
```

---

## Task 16: Sentry Monitoring & Final Hardening

**Files:**
- Create: `src/lib/sentry.ts` (Sentry initialization with PII filtering)
- Create: `sentry.client.config.ts`
- Create: `sentry.server.config.ts`
- Modify: `next.config.ts` (Add Sentry webpack plugin)

**Step 1: Install Sentry**

Run: `npx @sentry/wizard@latest -i nextjs`

This auto-configures Sentry for Next.js including:
- `sentry.client.config.ts`
- `sentry.server.config.ts`
- `next.config.ts` modifications
- Source map upload

**Step 2: Add PII filtering**

In `sentry.server.config.ts`:
```typescript
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 0.1,
  beforeSend(event) {
    // Remove request body (may contain PII)
    if (event.request?.data) delete event.request.data;
    if (event.request?.cookies) delete event.request.cookies;
    // Scrub emails from error messages
    if (event.exception?.values) {
      event.exception.values.forEach(e => {
        if (e.value) e.value = e.value.replace(/[\w.-]+@[\w.-]+/g, '[EMAIL]');
      });
    }
    return event;
  },
});
```

**Step 3: Verify Sentry captures test error**

Add temporary test:
```typescript
// In any API route, temporarily:
throw new Error('Sentry test error');
```
Check Sentry dashboard — error should appear without PII.
Remove test error.

**Step 4: Final security verification**

Run through checklist:
- [ ] All `/api/*` routes (except health, webhook) require auth
- [ ] Webhook validates HMAC signature
- [ ] Rate limiting active on consent + validation endpoints
- [ ] Security headers present (check with `curl -I`)
- [ ] No PII in console.log or Sentry events
- [ ] Audit logs have valid checksums
- [ ] Audit UPDATE/DELETE blocked by trigger

**Step 5: Commit**

```bash
git add sentry.*.config.ts src/lib/sentry.ts
git commit -m "Task 16: Sentry monitoring with PII filtering, final security hardening"
```

---

## Task 17: Production Deployment

**Step 1: Deploy to Railway**

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and link project
railway login
railway init

# Set environment variables
railway variables set DATABASE_URL="..."
railway variables set CLERK_SECRET_KEY="..."
# ... all env vars from .env.local.example

# Deploy
railway up
```

**Step 2: Configure custom domain**

In Railway dashboard:
- Add custom domain
- Configure DNS (CNAME record)
- SSL auto-provisioned

**Step 3: Verify production deployment**

- Health check: `curl https://your-domain.com/api/health` → 200
- Sign in: Navigate to `/sign-in` → Azure AD SSO works
- Dashboard: Real metrics load
- Consent capture: Full flow works end-to-end
- Dynamics sync: Consent → Dynamics Contact updated

**Step 4: Commit and tag**

```bash
git add .
git commit -m "Task 17: Production deployment to Railway"
git tag v1.0.0-mvp
```

---

## Post-MVP Phase 2 Tasks (Future Sessions)

These are documented for planning but NOT part of the MVP build:

### Phase 2A: Patient Portal (Module 06)
- Magic link authentication flow
- Patient self-service consent preferences
- Consent history view
- GDPR data export endpoint
- Consent revocation from portal

### Phase 2B: Background Jobs (Module 03)
- BullMQ + Upstash Redis integration
- Async Dynamics sync queue
- Email notification queue (consent granted, expiring, revoked)
- PDF generation queue
- Consent expiration checker (daily cron)
- Dead letter queue for failed jobs

### Phase 2C: Advanced Features
- Bi-directional Dynamics sync
- PDF consent document generation (pdf-lib)
- Compliance report generator (PDF/CSV)
- Bulk consent validation optimization
- Template versioning
- Advanced audit log chain verification
- Multi-language consent templates
- API key management for third-party integrations
- Webhook health dashboard

### Phase 2D: Full Launch Prep (Module 07 Complete)
- Playwright E2E test suite
- Load testing
- Security penetration testing
- OpenAPI/Swagger documentation
- Admin user guide
- Deployment guide for Azure App Service
- SOC 2 control documentation

---

## Quick Reference: File Structure (After All Tasks Complete)

```
consenthub/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── sign-in/[[...sign-in]]/page.tsx
│   │   │   └── sign-up/[[...sign-up]]/page.tsx
│   │   ├── (admin)/
│   │   │   ├── layout.tsx
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── patients/page.tsx
│   │   │   ├── patients/[id]/page.tsx
│   │   │   ├── consents/page.tsx
│   │   │   ├── templates/page.tsx
│   │   │   ├── audit/page.tsx
│   │   │   ├── reports/page.tsx
│   │   │   └── settings/page.tsx
│   │   ├── api/
│   │   │   ├── health/route.ts
│   │   │   ├── dashboard/stats/route.ts
│   │   │   ├── consents/route.ts
│   │   │   ├── consents/validate/route.ts
│   │   │   ├── consents/validate-bulk/route.ts
│   │   │   ├── consents/[id]/revoke/route.ts
│   │   │   ├── patients/route.ts
│   │   │   ├── patients/[id]/route.ts
│   │   │   ├── patients/[id]/consents/route.ts
│   │   │   ├── templates/route.ts
│   │   │   ├── templates/[id]/route.ts
│   │   │   ├── audit/route.ts
│   │   │   ├── audit/verify/route.ts
│   │   │   ├── dynamics/webhook/route.ts
│   │   │   ├── dynamics/status/route.ts
│   │   │   ├── dynamics/test/route.ts
│   │   │   ├── settings/route.ts
│   │   │   └── users/route.ts
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── admin/
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── Breadcrumb.tsx
│   │   │   ├── dashboard/
│   │   │   │   ├── MetricCards.tsx
│   │   │   │   ├── MonthlyTrendChart.tsx
│   │   │   │   ├── ConsentsByTypeChart.tsx
│   │   │   │   └── ActivityFeed.tsx
│   │   │   ├── patients/
│   │   │   │   ├── PatientTable.tsx
│   │   │   │   ├── PatientDetail.tsx
│   │   │   │   └── ConsentTimeline.tsx
│   │   │   ├── consents/
│   │   │   │   ├── ConsentTable.tsx
│   │   │   │   ├── ConsentDetailModal.tsx
│   │   │   │   └── RevokeDialog.tsx
│   │   │   ├── audit/
│   │   │   │   └── AuditLogTable.tsx
│   │   │   └── settings/
│   │   │       ├── OrganizationSettings.tsx
│   │   │       ├── UserManagement.tsx
│   │   │       └── DynamicsSettings.tsx
│   │   ├── consent/
│   │   │   ├── ConsentForm.tsx
│   │   │   └── SignaturePad.tsx
│   │   └── ui/ (shadcn components)
│   ├── lib/
│   │   ├── db/
│   │   │   ├── index.ts
│   │   │   └── schema.ts
│   │   ├── auth/
│   │   │   ├── index.ts
│   │   │   └── roles.ts
│   │   ├── dynamics/
│   │   │   ├── client.ts
│   │   │   ├── auth.ts
│   │   │   ├── sync.ts
│   │   │   └── types.ts
│   │   ├── schemas/
│   │   │   └── consent.ts
│   │   ├── security/
│   │   │   ├── rate-limit.ts
│   │   │   └── sanitize.ts
│   │   ├── __tests__/
│   │   │   ├── audit.test.ts
│   │   │   ├── crypto.test.ts
│   │   │   └── schemas.test.ts
│   │   ├── audit.ts
│   │   ├── crypto.ts
│   │   ├── errors.ts
│   │   ├── sentry.ts
│   │   └── utils.ts
│   └── middleware.ts
├── drizzle/
│   └── migrations/
├── scripts/
│   └── seed.ts
├── Dockerfile
├── docker-compose.yml
├── .dockerignore
├── .env.local.example
├── jest.config.ts
├── drizzle.config.ts
├── next.config.ts
├── tsconfig.json
├── package.json
└── sentry.*.config.ts
```

---

## Parallel Execution Strategy

Tasks can be parallelized where there are no dependencies:

```
Sequential (must be in order):
Task 1 → Task 2 → Task 3 → Task 4

Then parallel:
├── Task 5 (Templates API) ──────────┐
├── Task 6 (Consent API + Signature) ─┤──→ Task 7 (Dynamics)
                                      │
├── Task 8 (Admin Layout) ────────────┤
                                      │
                                      ├──→ Task 9 (Dashboard)
                                      ├──→ Task 10 (Patients)
                                      ├──→ Task 11 (Consents + Audit)
                                      └──→ Task 12 (Settings)

Then sequential:
Task 13 (Hardening) → Task 14 (Docker) → Task 15 (Tests) → Task 16 (Sentry) → Task 17 (Deploy)
```

**Optimal execution with 4 parallel subagents:**
- Batch 1: Tasks 1-4 (sequential, ~1 session)
- Batch 2: Tasks 5+6+8 in parallel (~1 session)
- Batch 3: Task 7 + Tasks 9+10+11+12 in parallel (~1 session)
- Batch 4: Tasks 13-17 (sequential, ~1 session)

**Total: ~4 focused sessions = ~2 days of work**
