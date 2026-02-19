# Module 07: Launch Prep

## Prerequisites
- Modules 01-06 complete — all features working

## Scope

Production readiness: automated testing, security review, Docker containerization, CI/CD pipeline, Azure deployment, monitoring, and documentation.

## Deliverables

### 1. Testing

**Unit Tests (Jest):**
- Consent validation logic (active, expired, revoked, missing)
- Audit checksum generation and verification
- Zod schema validation (valid + invalid inputs)
- Date/expiration calculations
- Field mapping (Dynamics ↔ ConsentHub)

**E2E Tests (Playwright):**
- Full consent capture flow (select template → sign → confirm)
- Patient portal: login → change preference → verify in DB
- Admin: search patients → view detail → download PDF
- Audit log checksum verification

**Integration Tests:**
- Audit log immutability (UPDATE/DELETE blocked by triggers)
- RLS isolation (user A cannot see org B data)
- Dynamics sync in both directions (with mock Dynamics API)

### 2. Security Review
- [ ] RLS policies verified: cross-org queries return empty
- [ ] All `/dashboard/*` routes require authentication
- [ ] All `/api/*` routes (except webhooks) require auth
- [ ] Webhook signature validation tested with invalid signatures
- [ ] No PHI in URLs, console logs, or error messages
- [ ] Rate limiting on: magic link, consent capture, validation
- [ ] CORS configured for production domain only
- [ ] Content Security Policy headers set
- [ ] No sensitive data in client-side JavaScript bundles

### 3. Docker
- **Dockerfile**: Multi-stage build (deps → build → runner)
- **docker-compose.yml**: Local dev with Redis
- Container builds and runs with `docker compose up`
- Health check endpoint: `GET /api/health`

### 4. CI/CD (GitHub Actions)
```yaml
# .github/workflows/deploy.yml
on push to main:
  1. Install dependencies
  2. Run linter (next lint)
  3. Run unit tests (jest)
  4. Run E2E tests (playwright)
  5. Build Docker image
  6. Push to Azure Container Registry
  7. Deploy to Azure App Service
```

### 5. Production Deployment
- Azure App Service configured for container hosting
- Custom domain + SSL certificate
- All production environment variables set
- Production Neon database (Pro tier minimum)
- Upstash Redis production instance
- Resend production domain verified
- Sentry production project

### 6. Monitoring
- Sentry error tracking with source maps
- Health check endpoint for uptime monitoring
- Structured logging (JSON format for log aggregation)
- Performance monitoring for API response times

### 7. Documentation
- **API Documentation**: OpenAPI/Swagger spec auto-generated
- **Deployment Guide**: Step-by-step Azure setup
- **Admin User Guide**: How to use each feature
- **README.md**: Project overview, setup instructions, architecture

## Checklist
- [ ] All unit tests passing (`npm run test`)
- [ ] All E2E tests passing (`npm run test:e2e`)
- [ ] Security review completed — all items checked
- [ ] Docker build succeeds and container runs
- [ ] CI/CD pipeline runs green on push to main
- [ ] Production deployed to Azure App Service
- [ ] Custom domain resolves with valid SSL
- [ ] Sentry receiving error reports
- [ ] Health check returns 200
- [ ] API documentation accessible
- [ ] Deployment guide complete
- [ ] Admin user guide complete
- [ ] Git tag: `v1.0.0`
- [ ] Git commit: `'Module 7: Production ready'`

## Claude Code Prompt

```
Modules 0-6 are complete. Prepare for production launch.

FIRST: Read CLAUDE.md and modules/MODULE_07_LAUNCH.md for specifications.
ALSO READ: docs/private/TECH_SPEC.md §4 Module 7 for detailed prompt.

Build:
1. Jest unit tests: consent validation, checksum gen, Zod schemas, date calcs
2. Playwright E2E: consent capture flow, portal preference change, audit verification
3. Security review: RLS verification, auth checks, no PHI leaks, rate limiting, CORS, CSP
4. Docker: multi-stage Dockerfile + docker-compose.yml + health check
5. GitHub Actions CI/CD: lint → test → build → deploy to Azure
6. Sentry configuration with source maps
7. Documentation: OpenAPI spec, deployment guide, admin user guide, README

This is the final module. Everything must be production-ready.
```
