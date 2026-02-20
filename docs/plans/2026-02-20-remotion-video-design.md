# ConsentHub Remotion Video Design

**Date:** 2026-02-20
**Status:** Approved
**Author:** Mark Holland + Claude

## Overview

Build a modular Remotion video project that produces 6 video outputs from a shared scene component library. Videos serve three purposes: shareable short clips for sales/LinkedIn, a 2-minute embedded demo for the landing page, and a comprehensive 7-8 minute product overview.

## Deliverables

| Video | Duration | Purpose | Resolution |
|-------|----------|---------|------------|
| Clip 1: "Why Consent Is Broken" | 30s | LinkedIn/email share | 1920x1080 |
| Clip 2: "Dynamics 365 Integration" | 30s | LinkedIn/email share | 1920x1080 |
| Clip 3: "HIPAA Compliance" | 30s | LinkedIn/email share | 1920x1080 |
| Clip 4: "Enterprise Power, Startup Pricing" | 30s | LinkedIn/email share | 1920x1080 |
| 2-Minute Demo | 120s | Landing page modal (YouTube embed) | 1920x1080 |
| Full Overview | ~450s | Detailed walkthrough (YouTube embed) | 1920x1080 |

All videos uploaded to YouTube. Landing page gets a "See 2 Minute Demo" CTA button that opens a modal with the YouTube embed, plus a secondary "See Detailed Overview" link to the full video.

## Project Structure

```
video/
├── src/
│   ├── Root.tsx              # All compositions registered
│   ├── scenes/               # Reusable scene components
│   │   ├── LogoIntro.tsx
│   │   ├── ProblemScene.tsx
│   │   ├── SolutionScene.tsx
│   │   ├── DashboardDemo.tsx
│   │   ├── ConsentWizard.tsx
│   │   ├── SyncVisualization.tsx
│   │   ├── AuditTrail.tsx
│   │   ├── PricingComparison.tsx
│   │   ├── FeatureGrid.tsx
│   │   └── CTAEndCard.tsx
│   ├── components/           # Shared primitives
│   │   ├── AnimatedText.tsx
│   │   ├── BrowserFrame.tsx
│   │   ├── GradientBackground.tsx
│   │   └── Badge.tsx
│   ├── lib/
│   │   ├── colors.ts         # Brand palette constants
│   │   └── fonts.ts          # Font loading
│   ├── compositions/         # Video assemblies
│   │   ├── ShortClip1.tsx
│   │   ├── ShortClip2.tsx
│   │   ├── ShortClip3.tsx
│   │   ├── ShortClip4.tsx
│   │   ├── TwoMinDemo.tsx
│   │   └── FullOverview.tsx
│   └── public/               # Static assets (logos)
├── package.json
└── tsconfig.json
```

## Technology

- **Remotion** — React-based video framework
- **TypeScript** — Strict mode
- **Tailwind CSS** — Layout/styling only (NO animate-* or transition-* classes)
- **@remotion/google-fonts** — DM Serif Display (headlines), Plus Jakarta Sans (body)
- **@remotion/transitions** — Scene transitions (fade, slide, wipe)
- **30fps** — All compositions

## Brand Constants

```typescript
// colors.ts
export const COLORS = {
  navy: '#0F172A',
  navyLight: '#1E293B',
  teal: '#0D9488',
  tealLight: '#14B8A6',
  tealDark: '#0F766E',
  indigo: '#6366F1',
  success: '#15803D',
  warning: '#B45309',
  red: '#EF4444',
  white: '#FFFFFF',
  slate50: '#F8FAFC',
  slate100: '#F1F5F9',
  slate400: '#94A3B8',
  slate500: '#64748B',
  slate600: '#475569',
  slate900: '#0F172A',
};
```

## Scene Component Library

### 1. LogoIntro (3-4s)
- Dark navy background with animated teal + indigo gradient orbs
- ConsentHub logo fades in center with glow effect
- "HIPAA Compliant · SOC 2 Type II" badge springs in below
- Animation: orb positions via interpolate(), logo via spring({ damping: 200 }), badge via spring({ damping: 10, delay: 15 })

### 2. ProblemScene (8-10s)
- Header: "Consent Management Is Broken" (DM Serif, slide up)
- 4 bullet points with red X icons, staggered entrance (spring, 8-frame delay each)
- Each pain point text fades in alongside its icon
- Red gradient accent bar at top
- Content:
  1. "Paper forms get lost, misfiled, or expire without notice"
  2. "Manual Dynamics entry creates data errors and compliance gaps"
  3. "No audit trail means failed HIPAA audits and real legal risk"
  4. "Patients can't manage their own preferences"

### 3. SolutionScene (8-10s)
- Header: "ConsentHub Changes Everything" (DM Serif, slide up)
- 4 bullet points with teal checkmark icons, staggered entrance
- Teal gradient accent bar at top
- Content:
  1. "Digital consent capture with legally-binding e-signatures"
  2. "Real-time bi-directional Dynamics 365 sync"
  3. "Immutable audit trail with SHA-256 checksums"
  4. "Self-service patient portal for preference management"

### 4. DashboardDemo (12-15s)
- Browser frame slides in from right with spring animation
- Inside: ConsentHub dashboard mockup
  - Metric cards pop in one-by-one (Total Patients: 1,247 / Active Consents: 982 / Pending Review: 43 / Compliance: 94.2%)
  - Donut chart segments animate in (SVG arc interpolation)
  - Line chart draws left-to-right
  - Activity feed items stagger in from bottom
- URL bar shows "app.consenthub.io/dashboard"

### 5. ConsentWizard (10-15s)
- 3-step animated flow in browser frame:
  - Step 1: Template cards slide in (HIPAA Treatment highlighted with teal ring)
  - Step 2: Signature pad — animated handwriting SVG path draws
  - Step 3: Success — green circle springs in, checkmark path draws, confirmations stagger ("Recorded", "PDF generated", "Dynamics 365 synced")

### 6. SyncVisualization (8-12s)
- ConsentHub shield logo on left, Dynamics 365 globe on right
- Dashed track connecting them
- Animated data packets flow between (interpolated x-position):
  - Right: "Consent Record", "PDF Document", "Audit Entry"
  - Left: "Contact Update", "Preference Change"
- Status bar: pulsing green dot + "Bi-directional sync active"
- Counter: "< 200ms latency"

### 7. AuditTrail (8-10s)
- Audit log table in browser frame
- 5 entries stagger in from left with color-coded icons
- SHA-256 hash typewriter-types below
- "Verify" button press animation → spinner → green "Verified" badge springs in
- Text: "All records verified — no tampering detected"

### 8. PricingComparison (8-12s)
- 3 pricing cards slide up with stagger (spring, damping: 200)
- Professional (center) scales up 5% with teal border glow
- Price numbers count up: $600 → $1,200 → $2,000
- "Most Popular" badge springs in on Professional
- Bottom: "60-80% less than enterprise alternatives" badge slides in

### 9. FeatureGrid (10-12s)
- 2×3 grid of feature cards
- Each card slides in with colored accent bar
- Icons: FileSignature, ArrowLeftRight, ShieldCheck, Smartphone, LayoutDashboard, Plug
- Colors: teal, blue, emerald, violet, amber, indigo
- Staggered entrance (spring, 6-frame delay each)

### 10. CTAEndCard (4-6s)
- Teal-to-navy gradient background
- "Ready to Modernize Your Consent Workflow?" fades in (DM Serif)
- "consenthub.io" URL springs in below
- ConsentHub logo lockup fades in bottom

## Composition Assembly

### Short Clip 1 — "Why Consent Management Is Broken" (30s / 900 frames)
```
LogoIntro (3s) → fade(15f) → ProblemScene (8s) → fade(15f) → SolutionScene (8s) → fade(15f) → CTAEndCard (4s)
Total: 90 + 240 + 240 + 120 - 45 = 645 frames... adjust scene durations to hit 900
```

### Short Clip 2 — "Real-Time Dynamics 365 Integration" (30s)
```
LogoIntro (3s) → fade → SyncVisualization (10s) → slide → DashboardDemo (12s) → fade → CTAEndCard (4s)
```

### Short Clip 3 — "HIPAA Compliance, Guaranteed" (30s)
```
LogoIntro (3s) → fade → AuditTrail (10s) → slide → ConsentWizard (10s) → fade → CTAEndCard (4s)
```

### Short Clip 4 — "Enterprise Power, Startup Pricing" (30s)
```
LogoIntro (3s) → fade → PricingComparison (10s) → slide → FeatureGrid (10s) → fade → CTAEndCard (4s)
```

### 2-Minute Demo (120s / 3600 frames)
```
LogoIntro (4s) → ProblemScene (10s) → SolutionScene (10s) → DashboardDemo (15s) →
ConsentWizard (15s) → SyncVisualization (12s) → AuditTrail (10s) →
FeatureGrid (12s) → PricingComparison (12s) → CTAEndCard (6s)
All with fade transitions (15 frames each = 9 transitions = 135 frames overlap)
```

### Full Overview (7-8 min / ~13500 frames)
Same scenes with expanded timing:
- Each scene 2-3× longer with additional text callouts
- Section title cards between major segments ("The Problem", "The Platform", "Key Features", "How It Works", "Pricing", "Get Started")
- Slower transitions (20-frame fades)
- DashboardDemo split into sub-beats (metrics → charts → activity)
- ConsentWizard shown step-by-step with explanatory text

## Visual Style Guide

- **Backgrounds:** Navy (#0F172A) with animated gradient orbs (teal + indigo, position interpolated)
- **Text:** White for headlines, slate-300 for body, teal for accents
- **Cards/Frames:** Slate-900 bg with slate-700 borders, rounded-2xl
- **Icons:** Lucide React icons in brand colors
- **Transitions:** fade() for most, slide({ direction: 'from-right' }) for demo sequences
- **Motion:** spring({ damping: 200 }) for smooth reveals, spring({ damping: 10 }) for bouncy entrances
- **All animation via useCurrentFrame() + interpolate()/spring() — NO CSS animations**

## Landing Page Integration

After videos are rendered and uploaded to YouTube:
1. Add "Watch Demo" CTA button to Hero section
2. Button opens a modal with YouTube iframe (2-min video)
3. Modal includes secondary link: "See Detailed Overview (8 min)" → opens full video
4. User provides YouTube URLs after upload
