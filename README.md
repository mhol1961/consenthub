# ConsentHub

**HIPAA/GDPR Consent Management Platform for Microsoft Dynamics 365**

---

## Quick Start for Claude Code

### Step 1: Open this project in Claude Code
```bash
cd consenthub-project
claude  # or however you invoke Claude Code
```

### Step 2: Point Claude Code to CLAUDE.md
Every session should start with:
> "Read CLAUDE.md and the relevant module file before writing any code."

### Step 3: Build Module 0 (Demo) First
```
Read CLAUDE.md and modules/MODULE_00_DEMO.md. Build the demo/promo site.
```

### Step 4: Proceed through modules sequentially
After Module 0 is approved by Chris, proceed: Module 1 → 2 → 3 → 4 → 5 → 6 → 7

---

## Project Structure

```
├── CLAUDE.md                      ← Master guide (Claude Code reads this FIRST)
├── README.md                      ← You are here
├── docs/
│   ├── client/                    ← Safe to share with Chris
│   │   ├── PRD.md
│   │   └── PROPOSAL.md
│   ├── private/                   ← ⚠️ NEVER share with client
│   │   └── TECH_SPEC.md
│   └── architecture/
│       └── DIAGRAMS.md            ← Mermaid diagram source
├── modules/                       ← Build specifications (one per Claude Code session)
│   ├── MODULE_00_DEMO.md          ← START HERE
│   ├── MODULE_01_FOUNDATION.md
│   ├── MODULE_02_CONSENT.md
│   ├── MODULE_03_JOBS.md
│   ├── MODULE_04_DYNAMICS.md
│   ├── MODULE_05_ADMIN.md
│   ├── MODULE_06_PORTAL.md
│   └── MODULE_07_LAUNCH.md
└── demo/                          ← Demo site (built by Module 0)
```

---

## Build Order

| # | Module | What It Does | Time Estimate |
|---|--------|-------------|---------------|
| 0 | Demo/Promo Site | Interactive sales tool for Chris & Jacquelin | 1-2 days |
| 1 | Foundation | Database, auth, project structure | 1 week |
| 2 | Consent Engine | Capture, validate, sign, audit | 2 weeks |
| 3 | Background Jobs | Async processing (sync, email, PDF) | 1 week |
| 4 | Dynamics Integration | Bi-directional CRM sync | 2 weeks |
| 5 | Admin Dashboard | Full management interface | 2 weeks |
| 6 | Patient Portal | Self-service preferences | 1 week |
| 7 | Launch Prep | Testing, Docker, CI/CD, deploy | 2 weeks |

**Total: ~12 weeks**

---

## Key Rules for Claude Code

1. **Read the module file BEFORE coding** — each module has a detailed spec
2. **One module per session** — fresh context prevents drift
3. **Commit after each module** — clean git history
4. **Test before moving on** — checklists at the bottom of each module
5. **No mock data in production modules** — real Supabase only (demo excepted)
6. **TypeScript strict + Zod** — type safety everywhere
7. **Server timestamps for audit** — never trust the client

---

## For Mark: Pre-Build Checklist

Before starting Module 0 (Demo):
- [ ] Create a GitHub repository for `consenthub`
- [ ] Copy this entire project structure into the repo
- [ ] Push initial commit with docs and module specs

Before starting Module 1 (Foundation):
- [ ] Create Supabase project (free tier)
- [ ] Get Chris to create Azure AD app registration
- [ ] Collect all environment variables
- [ ] Create `.env.local` from the template in CLAUDE.md

Before starting Module 4 (Dynamics):
- [ ] Chris creates custom fields on Dynamics Contact entity
- [ ] Chris creates Azure AD app for server-to-server auth
- [ ] Chris configures webhook registration
- [ ] Get Dynamics org URL and credentials
