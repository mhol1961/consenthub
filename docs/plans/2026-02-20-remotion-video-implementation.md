# ConsentHub Remotion Video Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a Remotion project that renders 6 promotional videos (4 x 30s clips, 1 x 2min demo, 1 x 7-8min overview) from a shared scene component library.

**Architecture:** Standalone Remotion project at `video/` using shared scene components assembled into compositions via `<TransitionSeries>`. All animation driven by `useCurrentFrame()` + `interpolate()`/`spring()`. No CSS animations.

**Tech Stack:** Remotion 4, TypeScript strict, Tailwind (layout only), @remotion/google-fonts, @remotion/transitions, lucide-react

---

## Task 1: Scaffold Remotion Project

**Files:**
- Create: `video/` (entire project via CLI)

**Step 1: Create the Remotion project**

```bash
cd /mnt/c/tas-saas-consenthub
npx create-video@latest video --template blank --package-manager npm
```

When prompted, accept defaults. This creates the base Remotion project.

**Step 2: Install additional dependencies**

```bash
cd /mnt/c/tas-saas-consenthub/video
npx remotion add @remotion/google-fonts
npx remotion add @remotion/transitions
npm install lucide-react
```

**Step 3: Install and configure Tailwind**

Fetch Remotion's Tailwind setup docs and follow them:
```bash
npx remotion add @remotion/tailwind
npm install tailwindcss @tailwindcss/vite
```

Then update `remotion.config.ts` (or `vite.config.ts` if Remotion v5+) to enable Tailwind.

Create `video/src/style.css`:
```css
@import "tailwindcss";
```

Import it in `video/src/Root.tsx`:
```tsx
import "./style.css";
```

**Step 4: Copy logo assets**

```bash
cp /mnt/c/tas-saas-consenthub/consethub-logo-transparent-background-light-mode.png /mnt/c/tas-saas-consenthub/video/public/logo-light.png
cp /mnt/c/tas-saas-consenthub/consethub-logo-transparent-background-dark-mode.png /mnt/c/tas-saas-consenthub/video/public/logo-dark.png
```

**Step 5: Verify Remotion Studio opens**

```bash
cd /mnt/c/tas-saas-consenthub/video
npx remotion studio
```

Expected: Browser opens with Remotion Studio showing the blank composition.

**Step 6: Commit**

```bash
cd /mnt/c/tas-saas-consenthub
git add video/
git commit -m "Task 1: Scaffold Remotion video project with deps"
```

---

## Task 2: Brand Constants, Fonts, and Shared Primitives

**Files:**
- Create: `video/src/lib/colors.ts`
- Create: `video/src/lib/fonts.ts`
- Create: `video/src/components/GradientBackground.tsx`
- Create: `video/src/components/AnimatedText.tsx`
- Create: `video/src/components/BrowserFrame.tsx`
- Create: `video/src/components/Badge.tsx`

**Step 1: Create brand colors**

`video/src/lib/colors.ts`:
```typescript
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
  slate200: '#E2E8F0',
  slate300: '#CBD5E1',
  slate400: '#94A3B8',
  slate500: '#64748B',
  slate600: '#475569',
  slate700: '#334155',
  slate800: '#1E293B',
  slate900: '#0F172A',
  slate950: '#020617',
} as const;
```

**Step 2: Create font loader**

`video/src/lib/fonts.ts`:
```typescript
import { loadFont as loadDMSerif } from "@remotion/google-fonts/DMSerifDisplay";
import { loadFont as loadJakarta } from "@remotion/google-fonts/PlusJakartaSans";

const { fontFamily: serifFamily } = loadDMSerif();
const { fontFamily: sansFamily } = loadJakarta("normal", {
  weights: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

export const FONTS = {
  serif: serifFamily,
  sans: sansFamily,
} as const;
```

**Step 3: Create GradientBackground**

`video/src/components/GradientBackground.tsx`:
```tsx
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { AbsoluteFill } from "remotion";
import { COLORS } from "../lib/colors";

export const GradientBackground: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Orb 1 — teal, drifts slowly
  const orb1X = interpolate(frame, [0, 10 * fps, 20 * fps], [-200, -100, -200], {
    extrapolateRight: "extend",
  });
  const orb1Y = interpolate(frame, [0, 8 * fps, 16 * fps], [-150, -50, -150], {
    extrapolateRight: "extend",
  });

  // Orb 2 — indigo, opposite drift
  const orb2X = interpolate(frame, [0, 12 * fps, 24 * fps], [800, 900, 800], {
    extrapolateRight: "extend",
  });
  const orb2Y = interpolate(frame, [0, 10 * fps, 20 * fps], [400, 300, 400], {
    extrapolateRight: "extend",
  });

  // Orb 3 — sky, center pulse
  const orb3Scale = interpolate(frame, [0, 6 * fps, 12 * fps], [1, 1.15, 1], {
    extrapolateRight: "extend",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.navy }}>
      {/* Teal orb */}
      <div
        style={{
          position: "absolute",
          left: orb1X,
          top: orb1Y,
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: COLORS.teal,
          opacity: 0.15,
          filter: "blur(128px)",
        }}
      />
      {/* Indigo orb */}
      <div
        style={{
          position: "absolute",
          left: orb2X,
          top: orb2Y,
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: COLORS.indigo,
          opacity: 0.12,
          filter: "blur(128px)",
        }}
      />
      {/* Sky orb */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: "#38BDF8",
          opacity: 0.08,
          filter: "blur(100px)",
          transform: `translate(-50%, -50%) scale(${orb3Scale})`,
        }}
      />
    </AbsoluteFill>
  );
};
```

**Step 4: Create AnimatedText**

`video/src/components/AnimatedText.tsx`:
```tsx
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { FONTS } from "../lib/fonts";
import { COLORS } from "../lib/colors";

type AnimatedTextProps = {
  text: string;
  delay?: number;
  fontSize?: number;
  color?: string;
  fontFamily?: "serif" | "sans";
  fontWeight?: string | number;
  align?: "left" | "center" | "right";
};

export const AnimatedText: React.FC<AnimatedTextProps> = ({
  text,
  delay = 0,
  fontSize = 48,
  color = COLORS.white,
  fontFamily = "serif",
  fontWeight = "bold",
  align = "center",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 200 },
  });

  const opacity = interpolate(progress, [0, 1], [0, 1]);
  const y = interpolate(progress, [0, 1], [30, 0]);

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${y}px)`,
        fontSize,
        color,
        fontFamily: fontFamily === "serif" ? FONTS.serif : FONTS.sans,
        fontWeight,
        textAlign: align,
        lineHeight: 1.15,
      }}
    >
      {text}
    </div>
  );
};
```

**Step 5: Create BrowserFrame**

`video/src/components/BrowserFrame.tsx`:
```tsx
import { COLORS } from "../lib/colors";
import { FONTS } from "../lib/fonts";

type BrowserFrameProps = {
  url: string;
  children: React.ReactNode;
};

export const BrowserFrame: React.FC<BrowserFrameProps> = ({ url, children }) => {
  return (
    <div
      style={{
        borderRadius: 16,
        overflow: "hidden",
        border: `1px solid ${COLORS.slate700}`,
        boxShadow: `0 25px 50px -12px rgba(0,0,0,0.4), 0 0 60px -12px rgba(13,148,136,0.2)`,
      }}
    >
      {/* Chrome bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "12px 16px",
          background: COLORS.slate800,
          borderBottom: `1px solid ${COLORS.slate700}`,
        }}
      >
        {/* Traffic lights */}
        <div style={{ display: "flex", gap: 6 }}>
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#F87171" }} />
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#FBBF24" }} />
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#34D399" }} />
        </div>
        {/* URL bar */}
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: COLORS.slate900,
            borderRadius: 8,
            padding: "4px 12px",
          }}
        >
          <span
            style={{
              fontSize: 13,
              color: COLORS.slate400,
              fontFamily: FONTS.sans,
            }}
          >
            {url}
          </span>
        </div>
      </div>
      {/* Content */}
      <div style={{ background: COLORS.slate900 }}>{children}</div>
    </div>
  );
};
```

**Step 6: Create Badge**

`video/src/components/Badge.tsx`:
```tsx
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { FONTS } from "../lib/fonts";

type BadgeProps = {
  text: string;
  bg: string;
  color: string;
  delay?: number;
  fontSize?: number;
};

export const Badge: React.FC<BadgeProps> = ({
  text,
  bg,
  color,
  delay = 0,
  fontSize = 14,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  const scale = interpolate(progress, [0, 1], [0.8, 1]);
  const opacity = interpolate(progress, [0, 1], [0, 1]);

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "8px 20px",
        borderRadius: 999,
        background: bg,
        opacity,
        transform: `scale(${scale})`,
      }}
    >
      <span
        style={{
          fontSize,
          fontWeight: 600,
          color,
          fontFamily: FONTS.sans,
          letterSpacing: "0.05em",
          textTransform: "uppercase" as const,
        }}
      >
        {text}
      </span>
    </div>
  );
};
```

**Step 7: Verify in Remotion Studio**

Create a simple test composition in `video/src/Root.tsx` that renders `<GradientBackground />` with `<AnimatedText text="Test" />`. Open Remotion Studio and verify the orbs animate and text fades in.

**Step 8: Commit**

```bash
git add video/src/lib/ video/src/components/
git commit -m "Task 2: Brand constants, fonts, and shared components"
```

---

## Task 3: LogoIntro Scene

**Files:**
- Create: `video/src/scenes/LogoIntro.tsx`

**Step 1: Build LogoIntro**

`video/src/scenes/LogoIntro.tsx`:
```tsx
import { useCurrentFrame, useVideoConfig, spring, interpolate, Img, staticFile } from "remotion";
import { AbsoluteFill } from "remotion";
import { GradientBackground } from "../components/GradientBackground";
import { Badge } from "../components/Badge";
import { COLORS } from "../lib/colors";

export const LogoIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Logo entrance
  const logoProgress = spring({ frame, fps, config: { damping: 200 } });
  const logoOpacity = interpolate(logoProgress, [0, 1], [0, 1]);
  const logoScale = interpolate(logoProgress, [0, 1], [0.9, 1]);

  // Glow pulse
  const glowOpacity = interpolate(
    frame,
    [0, 1 * fps, 2 * fps],
    [0, 0.3, 0.15],
    { extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill>
      <GradientBackground />
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 24,
        }}
      >
        {/* Glow behind logo */}
        <div
          style={{
            position: "absolute",
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: COLORS.teal,
            opacity: glowOpacity,
            filter: "blur(80px)",
          }}
        />
        {/* Logo */}
        <div
          style={{
            opacity: logoOpacity,
            transform: `scale(${logoScale})`,
            position: "relative",
          }}
        >
          <Img
            src={staticFile("logo-dark.png")}
            style={{ height: 80, width: "auto" }}
          />
        </div>
        {/* Trust badge */}
        <Badge
          text="HIPAA Compliant  ·  SOC 2 Type II"
          bg="rgba(13, 148, 136, 0.15)"
          color={COLORS.tealLight}
          delay={Math.round(0.6 * fps)}
          fontSize={16}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
```

**Step 2: Register in Root.tsx and preview**

Add a test composition for LogoIntro in `Root.tsx`, preview in Studio.

**Step 3: Commit**

```bash
git add video/src/scenes/LogoIntro.tsx
git commit -m "Task 3: LogoIntro scene"
```

---

## Task 4: ProblemScene + SolutionScene

**Files:**
- Create: `video/src/scenes/ProblemScene.tsx`
- Create: `video/src/scenes/SolutionScene.tsx`

**Step 1: Build ProblemScene**

`video/src/scenes/ProblemScene.tsx`:
```tsx
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { AbsoluteFill } from "remotion";
import { GradientBackground } from "../components/GradientBackground";
import { AnimatedText } from "../components/AnimatedText";
import { COLORS } from "../lib/colors";
import { FONTS } from "../lib/fonts";

const PROBLEMS = [
  "Paper forms get lost, misfiled, or expire without notice",
  "Manual Dynamics entry creates data errors and compliance gaps",
  "No audit trail means failed HIPAA audits and real legal risk",
  "Patients can't manage their own preferences",
];

export const ProblemScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Red accent bar
  const barWidth = interpolate(frame, [0, 0.8 * fps], [0, 100], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <GradientBackground />
      <AbsoluteFill style={{ padding: "80px 120px" }}>
        {/* Red accent bar */}
        <div
          style={{
            width: `${barWidth}%`,
            height: 4,
            background: `linear-gradient(to right, ${COLORS.red}, transparent)`,
            borderRadius: 2,
            marginBottom: 40,
          }}
        />

        {/* Header */}
        <AnimatedText
          text="Consent Management Is Broken"
          fontSize={64}
          color={COLORS.white}
          fontFamily="serif"
          align="left"
          delay={Math.round(0.3 * fps)}
        />

        {/* Bullet points */}
        <div style={{ marginTop: 48, display: "flex", flexDirection: "column", gap: 28 }}>
          {PROBLEMS.map((text, i) => {
            const itemDelay = Math.round((0.8 + i * 0.4) * fps);
            const progress = spring({
              frame: frame - itemDelay,
              fps,
              config: { damping: 200 },
            });
            const opacity = interpolate(progress, [0, 1], [0, 1]);
            const x = interpolate(progress, [0, 1], [-30, 0]);

            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 16,
                  opacity,
                  transform: `translateX(${x}px)`,
                }}
              >
                {/* Red X icon */}
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={COLORS.red}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  style={{ flexShrink: 0, marginTop: 4 }}
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M15 9l-6 6M9 9l6 6" />
                </svg>
                <span
                  style={{
                    fontSize: 26,
                    color: COLORS.slate300,
                    fontFamily: FONTS.sans,
                    lineHeight: 1.5,
                  }}
                >
                  {text}
                </span>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
```

**Step 2: Build SolutionScene** (mirrors ProblemScene but teal + checkmarks)

`video/src/scenes/SolutionScene.tsx`:
```tsx
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { AbsoluteFill } from "remotion";
import { GradientBackground } from "../components/GradientBackground";
import { AnimatedText } from "../components/AnimatedText";
import { COLORS } from "../lib/colors";
import { FONTS } from "../lib/fonts";

const SOLUTIONS = [
  "Digital consent capture with legally-binding e-signatures",
  "Real-time bi-directional Dynamics 365 sync",
  "Immutable audit trail with SHA-256 checksums",
  "Self-service patient portal for preference management",
];

export const SolutionScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const barWidth = interpolate(frame, [0, 0.8 * fps], [0, 100], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <GradientBackground />
      <AbsoluteFill style={{ padding: "80px 120px" }}>
        {/* Teal accent bar */}
        <div
          style={{
            width: `${barWidth}%`,
            height: 4,
            background: `linear-gradient(to right, ${COLORS.teal}, transparent)`,
            borderRadius: 2,
            marginBottom: 40,
          }}
        />

        <AnimatedText
          text="ConsentHub Changes Everything"
          fontSize={64}
          color={COLORS.white}
          fontFamily="serif"
          align="left"
          delay={Math.round(0.3 * fps)}
        />

        <div style={{ marginTop: 48, display: "flex", flexDirection: "column", gap: 28 }}>
          {SOLUTIONS.map((text, i) => {
            const itemDelay = Math.round((0.8 + i * 0.4) * fps);
            const progress = spring({
              frame: frame - itemDelay,
              fps,
              config: { damping: 200 },
            });
            const opacity = interpolate(progress, [0, 1], [0, 1]);
            const x = interpolate(progress, [0, 1], [-30, 0]);

            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 16,
                  opacity,
                  transform: `translateX(${x}px)`,
                }}
              >
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={COLORS.teal}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  style={{ flexShrink: 0, marginTop: 4 }}
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M8 12l3 3 5-5" />
                </svg>
                <span
                  style={{
                    fontSize: 26,
                    color: COLORS.slate300,
                    fontFamily: FONTS.sans,
                    lineHeight: 1.5,
                  }}
                >
                  {text}
                </span>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
```

**Step 3: Preview both in Studio, commit**

```bash
git add video/src/scenes/ProblemScene.tsx video/src/scenes/SolutionScene.tsx
git commit -m "Task 4: ProblemScene and SolutionScene"
```

---

## Task 5: DashboardDemo Scene

**Files:**
- Create: `video/src/scenes/DashboardDemo.tsx`

This is the most complex scene. It renders a browser-framed dashboard with animated metrics, charts, and activity feed. Build the component with inline SVG charts and staggered metric card entrances.

Key animations:
- Browser frame slides in from right (spring, damping: 200)
- 4 metric cards pop in one-by-one (spring, 10-frame stagger)
- Donut chart SVG arcs animate via interpolated stroke-dasharray
- Line chart polyline draws left-to-right via stroke-dashoffset
- Activity feed items stagger in from bottom

Reference the existing `DashboardMockup` in `demo/src/components/landing/Hero.tsx` for layout/data but convert all CSS animations to `useCurrentFrame()` driven.

**Commit:**
```bash
git commit -m "Task 5: DashboardDemo scene with animated metrics and charts"
```

---

## Task 6: ConsentWizard Scene

**Files:**
- Create: `video/src/scenes/ConsentWizard.tsx`

3-step flow inside a BrowserFrame:
1. **Template Selection** (frames 0 to 3s): 3 template cards slide in, HIPAA Treatment gets selected (teal ring)
2. **Signature** (frames 3s to 7s): Signature pad area, SVG handwriting path draws via interpolated pathLength
3. **Success** (frames 7s to end): Green circle scales in (spring, damping: 10), checkmark SVG path draws, 3 confirmation lines stagger in

**Commit:**
```bash
git commit -m "Task 6: ConsentWizard scene with 3-step animated flow"
```

---

## Task 7: SyncVisualization Scene

**Files:**
- Create: `video/src/scenes/SyncVisualization.tsx`

Layout: ConsentHub shield icon on left, Dynamics 365 globe icon on right, dashed track between them.

Animated data packets move along the track (interpolated x position from 0% to 100% or reverse). 5 packets with staggered delays. Status bar with interpolated green dot opacity. Latency counter.

**Commit:**
```bash
git commit -m "Task 7: SyncVisualization scene with animated data packets"
```

---

## Task 8: AuditTrail Scene

**Files:**
- Create: `video/src/scenes/AuditTrail.tsx`

Audit log table inside BrowserFrame. 5 entries stagger in from left (spring, 8-frame delay each). Each has a color-coded icon circle. SHA-256 hash string typewriter-types character by character. Verify button "presses" → spinner rotates (interpolated rotation) → green "Verified" badge springs in.

**Commit:**
```bash
git commit -m "Task 8: AuditTrail scene with hash verification"
```

---

## Task 9: PricingComparison Scene

**Files:**
- Create: `video/src/scenes/PricingComparison.tsx`

3 pricing cards slide up with spring stagger. Professional card (center) scales to 1.05 with teal border glow. Price numbers count up using interpolate (0 → target over 1s). "Most Popular" badge springs in. Bottom tagline slides in.

**Commit:**
```bash
git commit -m "Task 9: PricingComparison scene with animated cards"
```

---

## Task 10: FeatureGrid + CTAEndCard Scenes

**Files:**
- Create: `video/src/scenes/FeatureGrid.tsx`
- Create: `video/src/scenes/CTAEndCard.tsx`

**FeatureGrid:** 2x3 grid, each card has colored accent bar + icon + title. Staggered spring entrance (6 cards, 6-frame delay each).

**CTAEndCard:** Teal-to-navy gradient bg. Headline fades in. URL springs in. Logo fades in at bottom.

**Commit:**
```bash
git commit -m "Task 10: FeatureGrid and CTAEndCard scenes"
```

---

## Task 11: Short Clip Compositions (4 clips)

**Files:**
- Create: `video/src/compositions/ShortClip1.tsx`
- Create: `video/src/compositions/ShortClip2.tsx`
- Create: `video/src/compositions/ShortClip3.tsx`
- Create: `video/src/compositions/ShortClip4.tsx`
- Modify: `video/src/Root.tsx`

Each clip uses `<TransitionSeries>` to assemble scenes with fade/slide transitions.

**ShortClip1 — "Why Consent Management Is Broken" (30s = 900 frames)**

```tsx
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { LogoIntro } from "../scenes/LogoIntro";
import { ProblemScene } from "../scenes/ProblemScene";
import { SolutionScene } from "../scenes/SolutionScene";
import { CTAEndCard } from "../scenes/CTAEndCard";

const FADE = linearTiming({ durationInFrames: 15 });

export const ShortClip1: React.FC = () => {
  return (
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={105}>
        <LogoIntro />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={FADE} />
      <TransitionSeries.Sequence durationInFrames={300}>
        <ProblemScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={FADE} />
      <TransitionSeries.Sequence durationInFrames={300}>
        <SolutionScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={FADE} />
      <TransitionSeries.Sequence durationInFrames={240}>
        <CTAEndCard />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};
// Total: 105 + 300 + 300 + 240 - 3*15 = 900 frames = 30s
```

**ShortClip2, 3, 4** follow same pattern with different scenes per the design doc.

**Register all in Root.tsx:**
```tsx
import { Composition, Folder } from "remotion";
import { ShortClip1 } from "./compositions/ShortClip1";
import { ShortClip2 } from "./compositions/ShortClip2";
import { ShortClip3 } from "./compositions/ShortClip3";
import { ShortClip4 } from "./compositions/ShortClip4";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Folder name="Short-Clips">
        <Composition id="clip-1-broken-consent" component={ShortClip1} durationInFrames={900} fps={30} width={1920} height={1080} />
        <Composition id="clip-2-dynamics-sync" component={ShortClip2} durationInFrames={900} fps={30} width={1920} height={1080} />
        <Composition id="clip-3-hipaa-compliance" component={ShortClip3} durationInFrames={900} fps={30} width={1920} height={1080} />
        <Composition id="clip-4-pricing" component={ShortClip4} durationInFrames={900} fps={30} width={1920} height={1080} />
      </Folder>
    </>
  );
};
```

**Preview all 4 in Studio, commit:**
```bash
git commit -m "Task 11: Four 30-second short clip compositions"
```

---

## Task 12: TwoMinDemo Composition

**Files:**
- Create: `video/src/compositions/TwoMinDemo.tsx`
- Modify: `video/src/Root.tsx`

Assembles all 10 scenes in sequence with fade transitions. Total: 120s = 3600 frames.

```
LogoIntro (135f/4.5s) → fade → ProblemScene (300f/10s) → fade →
SolutionScene (300f/10s) → fade → DashboardDemo (450f/15s) → fade →
ConsentWizard (420f/14s) → fade → SyncVisualization (360f/12s) → fade →
AuditTrail (300f/10s) → fade → FeatureGrid (360f/12s) → fade →
PricingComparison (360f/12s) → fade → CTAEndCard (180f/6s)
= 3165f + 9*15f transitions overlap... adjust to hit 3600
```

Register as `two-min-demo` composition at 3600 frames.

**Commit:**
```bash
git commit -m "Task 12: Two-minute demo composition"
```

---

## Task 13: FullOverview Composition

**Files:**
- Create: `video/src/scenes/SectionTitle.tsx` (new: title card between segments)
- Create: `video/src/compositions/FullOverview.tsx`
- Modify: `video/src/Root.tsx`

**SectionTitle** scene: Simple centered text on gradient background with a thin teal line above. Used to create title cards like "The Problem", "The Platform", "Key Features", etc.

**FullOverview** uses same scenes with 2-3x longer durations plus SectionTitle cards between segments. Target ~13500 frames (7.5 min at 30fps).

Register as `full-overview` composition.

**Commit:**
```bash
git commit -m "Task 13: Full overview composition (7-8 minutes)"
```

---

## Task 14: Render All Videos

**Step 1: Render short clips**

```bash
cd /mnt/c/tas-saas-consenthub/video
npx remotion render src/index.ts clip-1-broken-consent out/clip-1-broken-consent.mp4
npx remotion render src/index.ts clip-2-dynamics-sync out/clip-2-dynamics-sync.mp4
npx remotion render src/index.ts clip-3-hipaa-compliance out/clip-3-hipaa-compliance.mp4
npx remotion render src/index.ts clip-4-pricing out/clip-4-pricing.mp4
```

**Step 2: Render 2-minute demo**

```bash
npx remotion render src/index.ts two-min-demo out/two-min-demo.mp4
```

**Step 3: Render full overview**

```bash
npx remotion render src/index.ts full-overview out/full-overview.mp4
```

**Step 4: Verify all 6 MP4 files play correctly**

```bash
ls -la out/
```

Expected: 6 MP4 files.

**Step 5: Add out/ to .gitignore, commit**

```bash
echo "out/" >> video/.gitignore
git add video/.gitignore
git commit -m "Task 14: Add render output gitignore"
```

---

## Task 15: Landing Page YouTube Modal

**Files:**
- Create: `demo/src/components/landing/VideoModal.tsx`
- Modify: `demo/src/components/landing/Hero.tsx`

After user uploads videos to YouTube and provides URLs, build a modal component with YouTube iframe embed. Add "Watch Demo" CTA button to Hero section that opens the modal.

**This task is deferred** until the user provides YouTube URLs after uploading the rendered videos.

---

## Execution Notes

- **WSL2 Warning:** The previous session crashed during `npx create-video` due to WSL2 filesystem issues. If the interactive CLI freezes, try: `npm init video@latest -- --template blank` instead, or create the project structure manually.
- **Render time:** Each 30s clip takes ~1-3 minutes to render. The 2-minute demo takes ~5-10 minutes. The 7-8 minute overview may take 20-40 minutes.
- **Memory:** Remotion rendering is memory-intensive. Close other applications during renders.
- **Remotion Studio:** Use `npx remotion studio` to preview compositions before rendering. This is the primary "testing" mechanism.
