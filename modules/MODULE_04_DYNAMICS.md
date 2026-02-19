# Module 04: Dynamics 365 Integration

## Prerequisites
- Module 03 complete — background jobs working

## Scope

Full bi-directional integration with Microsoft Dynamics 365 via Dataverse Web API. Contact sync in both directions, custom fields, webhook processing.

## Deliverables

### 1. Dynamics API Client (`lib/dynamics/`)
- OAuth 2.0 client credentials flow (server-to-server)
- Token acquisition from Azure AD (`POST /oauth2/v2.0/token`)
- Token caching in Redis (expires 1 hour)
- Auto-refresh on 401 responses
- Wrapper methods: `getContact()`, `updateContact()`, `listContacts()`
- Rate limiting awareness (Dynamics API limits)

### 2. Custom Fields on Dynamics Contact
Fields to be created in Dynamics (document for Chris):
| Field | Logical Name | Type | Description |
|-------|-------------|------|-------------|
| Marketing Email | `ch_marketing_email` | Boolean | Active email consent |
| Marketing SMS | `ch_marketing_sms` | Boolean | Active SMS consent |
| Marketing Phone | `ch_marketing_phone` | Boolean | Active phone consent |
| Marketing Mail | `ch_marketing_mail` | Boolean | Active mail consent |
| Consent Date | `ch_consent_date` | DateTime | Most recent grant |
| Consent Expires | `ch_consent_expires` | DateTime | Earliest expiration |
| Consent Status | `ch_consent_status` | OptionSet | Active/Partial/Expired/None |
| Last Sync | `ch_last_sync` | DateTime | Last ConsentHub sync |

### 3. Contact Sync (Dynamics → ConsentHub)
- **Contact Created** → Create patient in ConsentHub
- **Contact Updated** → Update patient fields
- Field mapping: `firstname`, `lastname`, `emailaddress1`, `telephone1`
- Store `dynamics_contact_id` on patient record
- Audit log for every sync event

### 4. Consent Sync (ConsentHub → Dynamics)
- **Consent Granted** → PATCH Contact with consent booleans + dates
- **Consent Revoked** → Clear relevant boolean, update status
- Target latency: < 5 seconds
- Runs via dynamics-sync BullMQ queue

### 5. Webhook Endpoint
- `POST /api/dynamics/webhook`
- Validate HMAC-SHA256 signature header (`X-Dynamics-Signature`)
- Handle events: Contact Create, Update, Delete
- Return 200 immediately, process async
- All events logged to audit trail

### 6. Health & Testing
- `GET /api/dynamics/status` — Connection health check
- `POST /api/dynamics/test` — Test credentials (returns org info)
- Connection status component for Settings page

## File Structure
```
lib/dynamics/
├── client.ts                  # OAuth client + API wrapper
├── auth.ts                    # Token management
├── contacts.ts                # Contact CRUD operations
├── sync.ts                    # Sync logic (both directions)
├── fields.ts                  # Custom field definitions
└── types.ts                   # Dynamics API types
app/api/dynamics/
├── webhook/route.ts           # Webhook receiver
├── status/route.ts            # Health check
└── test/route.ts              # Credential test
```

## Checklist
- [ ] OAuth token acquired from Azure AD
- [ ] Token cached in Redis, auto-refreshes
- [ ] `GET /api/dynamics/status` returns OK with org name
- [ ] Webhook validates HMAC-SHA256 signature
- [ ] Contact Created webhook → patient created in Neon database
- [ ] Contact Updated webhook → patient updated
- [ ] Consent grant → Dynamics Contact updated with consent fields
- [ ] Consent revocation → Dynamics Contact fields cleared
- [ ] Sync latency < 5 seconds (measure and log)
- [ ] All sync events in audit log
- [ ] Git commit: `'Module 4: Dynamics Integration complete'`

## Claude Code Prompt

```
Modules 0-3 are complete. Integrate with Dynamics 365.

FIRST: Read CLAUDE.md and modules/MODULE_04_DYNAMICS.md for specifications.
ALSO READ: docs/private/TECH_SPEC.md §4 Module 4 for detailed prompt.

Build:
1. Dynamics API client with OAuth 2.0 client credentials, token caching in Redis
2. Contact sync: Dynamics→ConsentHub via webhooks, ConsentHub→Dynamics via queue jobs
3. Webhook endpoint with HMAC-SHA256 validation
4. Custom field mapping (ch_marketing_email, ch_marketing_sms, etc.)
5. Health check and credential test endpoints
6. All sync events logged to audit trail

Target: <5 second sync latency.
Environment variables: DYNAMICS_ORG_URL, DYNAMICS_CLIENT_ID, DYNAMICS_CLIENT_SECRET, DYNAMICS_WEBHOOK_SECRET
```
