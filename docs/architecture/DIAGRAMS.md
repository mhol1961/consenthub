# ConsentHub Architecture Diagrams

All diagrams in Mermaid format. Render in any Mermaid-compatible viewer or in the demo site's architecture page.

---

## 1. System Architecture

```mermaid
graph TB
    subgraph "Client Layer"
        PP[Patient Portal<br/>Next.js]
        AD[Admin Dashboard<br/>Next.js]
        D365[Dynamics 365<br/>Embedded Panel]
    end
    
    subgraph "API Layer - Next.js API Routes"
        AUTH[Auth API]
        CONSENT[Consent API]
        PATIENT[Patient API]
        AUDIT[Audit API]
        TEMPLATE[Template API]
        SYNC[Dynamics Sync]
    end
    
    subgraph "Services Layer"
        PDF[PDF Generator<br/>pdf-lib]
        EMAIL[Email Service<br/>Resend]
        QUEUE[Job Queue<br/>BullMQ]
        CACHE[Cache<br/>Redis]
    end
    
    subgraph "Data Layer - Neon PostgreSQL"
        DB[(PostgreSQL<br/>+ RLS)]
        STORAGE[Blob Storage<br/>Signed PDFs]
        REALTIME[Realtime<br/>Subscriptions]
    end
    
    subgraph "External"
        AZURE[Azure AD<br/>SSO]
        DYN[Dynamics 365<br/>Dataverse API]
    end
    
    PP --> AUTH
    PP --> CONSENT
    AD --> AUTH
    AD --> CONSENT
    AD --> PATIENT
    AD --> AUDIT
    AD --> TEMPLATE
    D365 --> CONSENT
    D365 --> SYNC
    
    AUTH --> AZURE
    AUTH --> DB
    CONSENT --> DB
    CONSENT --> PDF
    CONSENT --> QUEUE
    PATIENT --> DB
    AUDIT --> DB
    TEMPLATE --> DB
    SYNC --> DYN
    SYNC --> QUEUE
    
    PDF --> STORAGE
    QUEUE --> CACHE
    EMAIL --> QUEUE
    
    DB --> REALTIME
```

---

## 2. Consent Capture Flow

```mermaid
sequenceDiagram
    autonumber
    participant S as Staff
    participant D365 as Dynamics 365
    participant UI as ConsentHub UI
    participant API as API Server
    participant DB as PostgreSQL
    participant Q as Job Queue
    participant DYN as Dynamics API
    
    S->>D365: Open Contact record
    D365->>UI: Load embedded panel
    UI->>API: GET /api/patients/:id/consents
    API->>DB: Query consent status
    DB-->>API: No active consent
    API-->>UI: {status: "missing"}
    UI-->>D365: Show yellow warning
    
    S->>UI: Click "Request Consent"
    UI->>UI: Open consent form modal
    S->>UI: Select template + channels
    S->>UI: Hand tablet to patient
    
    Note over UI: Patient interaction
    UI->>UI: Patient signs on canvas
    UI->>UI: Patient clicks "I Agree"
    
    UI->>API: POST /api/consents
    Note right of API: Payload includes:<br/>signature_data, ip,<br/>user_agent, timestamp
    
    API->>DB: BEGIN TRANSACTION
    API->>DB: INSERT consent
    API->>DB: INSERT audit_log (SHA-256)
    API->>DB: COMMIT
    
    API->>Q: Queue PDF generation
    API->>Q: Queue Dynamics sync
    API-->>UI: {success: true, id: "..."}
    
    Q->>API: Generate PDF
    API->>DB: Store PDF path
    
    Q->>DYN: PATCH Contact
    Note right of DYN: Update ch_marketing_email,<br/>ch_marketing_sms, etc.
    DYN-->>Q: 200 OK
    Q->>DB: Update sync_status
    
    UI-->>D365: Refresh panel
    D365-->>S: Show green checkmark
```

---

## 3. Dynamics 365 Bi-Directional Sync

```mermaid
sequenceDiagram
    autonumber
    participant D365 as Dynamics 365
    participant WH as Webhook Endpoint
    participant API as ConsentHub API
    participant DB as PostgreSQL
    participant Q as Job Queue
    
    Note over D365,Q: Dynamics → ConsentHub (Contact Created)
    D365->>WH: POST /api/dynamics/webhook
    Note right of WH: Event: Contact Created
    WH->>WH: Validate webhook signature
    WH->>API: Process event
    API->>DB: INSERT patient
    API->>DB: INSERT audit_log
    API-->>WH: 200 OK
    
    Note over D365,Q: Dynamics → ConsentHub (Contact Updated)
    D365->>WH: POST /api/dynamics/webhook
    WH->>API: Process event
    API->>DB: UPDATE patient
    API->>DB: INSERT audit_log
    API-->>WH: 200 OK
    
    Note over D365,Q: ConsentHub → Dynamics (Consent Granted)
    API->>DB: INSERT consent
    API->>Q: Queue sync job
    Q->>D365: PATCH /contacts(id)
    Note right of D365: {ch_marketing_email: true,<br/>ch_consent_expires: "..."}
    D365-->>Q: 200 OK
    Q->>DB: UPDATE consent sync_status
    
    Note over D365,Q: ConsentHub → Dynamics (Consent Revoked)
    API->>DB: UPDATE consent status
    API->>Q: Queue sync job
    Q->>D365: PATCH /contacts(id)
    Note right of D365: {ch_marketing_sms: false}
    D365-->>Q: 200 OK
```

---

## 4. Entity Relationship Diagram

```mermaid
erDiagram
    organizations ||--o{ users : has
    organizations ||--o{ patients : has
    organizations ||--o{ consent_templates : has
    organizations ||--o{ consents : has
    organizations ||--o{ audit_logs : has
    
    patients ||--o{ consents : has
    consent_templates ||--o{ consents : uses
    users ||--o{ consents : captures
    users ||--o{ audit_logs : performs
    consents ||--o{ audit_logs : generates
    patients ||--o{ audit_logs : involves
    
    organizations {
        uuid id PK
        string name
        string dynamics_org_id UK
        uuid azure_tenant_id
        jsonb settings
    }
    
    users {
        uuid id PK
        uuid organization_id FK
        string email UK
        uuid azure_ad_oid UK
        enum role
        string first_name
        string last_name
    }
    
    patients {
        uuid id PK
        uuid organization_id FK
        string dynamics_contact_id
        string email
        string phone
        string first_name
        string last_name
        date date_of_birth
    }
    
    consent_templates {
        uuid id PK
        uuid organization_id FK
        string name
        enum consent_type
        enum regulation_type
        text legal_text
        int version
        int expiration_days
        boolean is_active
    }
    
    consents {
        uuid id PK
        uuid patient_id FK
        uuid template_id FK
        uuid organization_id FK
        uuid captured_by_user_id FK
        enum status
        enum consent_type
        timestamp granted_at
        timestamp expires_at
        jsonb signature_data
        string dynamics_record_id
    }
    
    audit_logs {
        uuid id PK
        uuid organization_id FK
        uuid consent_id FK
        uuid patient_id FK
        uuid user_id FK
        enum action
        jsonb old_values
        jsonb new_values
        timestamp timestamp
        string checksum
    }
```

---

## 5. Consent Status State Machine

```mermaid
stateDiagram-v2
    [*] --> pending: Consent requested
    
    pending --> active: Patient signs
    pending --> [*]: Request expires (7 days)
    
    active --> revoked: Patient or staff revokes
    active --> expired: Expiration date reached
    
    revoked --> active: New consent granted
    expired --> active: New consent granted
    
    note right of pending
        Waiting for patient
        to complete form
    end note
    
    note right of active
        Valid consent
        Dynamics synced
    end note
    
    note right of revoked
        Manually revoked
        Audit logged
    end note
    
    note right of expired
        Auto-expired
        based on template
    end note
```

---

## 6. Deployment Architecture

```mermaid
graph TB
    subgraph "Developer Machine"
        CODE[Source Code]
        DOCKER[Docker Compose<br/>Local Dev]
    end
    
    subgraph "GitHub"
        REPO[Repository]
        ACTIONS[GitHub Actions<br/>CI/CD]
    end
    
    subgraph "Azure"
        subgraph "App Service"
            NEXT[Next.js App<br/>Container]
        end
        subgraph "Azure AD"
            SSO[SSO Provider]
        end
    end
    
    subgraph "Cloud Services"
        NEON_DB[(Neon PostgreSQL)]
        CLERK_AUTH[Clerk Auth]
        STORAGE_SVC[Blob Storage]
    end
    
    subgraph "External Services"
        RESEND[Resend<br/>Email]
        SENTRY[Sentry<br/>Errors]
        UPSTASH[Upstash Redis<br/>Queue + Cache]
    end
    
    subgraph "Microsoft"
        DYN365[Dynamics 365]
    end
    
    CODE --> DOCKER
    CODE --> REPO
    REPO --> ACTIONS
    ACTIONS -->|Deploy| NEXT
    
    NEXT --> SSO
    NEXT --> NEON_DB
    NEXT --> CLERK_AUTH
    NEXT --> STORAGE_SVC
    NEXT --> RESEND
    NEXT --> SENTRY
    NEXT --> UPSTASH
    NEXT <--> DYN365
```

---

## 7. Authentication Flows

```mermaid
sequenceDiagram
    autonumber
    participant U as User
    participant APP as ConsentHub
    participant SUPA as Clerk Auth
    participant AZURE as Azure AD
    participant DB as PostgreSQL
    
    Note over U,DB: Staff Login (Azure AD SSO)
    U->>APP: Click "Sign in with Microsoft"
    APP->>AZURE: Redirect to Azure AD
    AZURE->>U: Microsoft login page
    U->>AZURE: Enter credentials + MFA
    AZURE->>APP: Redirect with auth code
    APP->>AZURE: Exchange code for tokens
    AZURE-->>APP: access_token, id_token
    APP->>SUPA: Create/link user session
    APP->>DB: Upsert user record
    APP-->>U: Redirect to dashboard
    
    Note over U,DB: Patient Portal (Magic Link)
    U->>APP: Enter email on portal
    APP->>DB: Lookup patient by email
    DB-->>APP: Patient found
    APP->>SUPA: Generate magic link token
    APP->>APP: Send email via Resend
    APP-->>U: "Check your email"
    
    U->>APP: Click link in email
    APP->>SUPA: Validate token
    Note right of SUPA: Check: not expired,<br/>not used, valid patient
    SUPA-->>APP: Token valid
    APP->>DB: Create portal session
    APP-->>U: Redirect to preferences
```
