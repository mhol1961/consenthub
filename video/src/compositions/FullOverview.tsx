import React from "react";
import { AbsoluteFill, Sequence, staticFile } from "remotion";
import { Audio } from "@remotion/media";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { LogoIntro } from "../scenes/LogoIntro";
import { ProblemScene } from "../scenes/ProblemScene";
import { SolutionScene } from "../scenes/SolutionScene";
import { DashboardDemo } from "../scenes/DashboardDemo";
import { ConsentWizard } from "../scenes/ConsentWizard";
import { SyncVisualization } from "../scenes/SyncVisualization";
import { AuditTrail } from "../scenes/AuditTrail";
import { FeatureGrid } from "../scenes/FeatureGrid";
import { PricingComparison } from "../scenes/PricingComparison";
import { CTAEndCard } from "../scenes/CTAEndCard";
import { SectionTitle } from "../scenes/SectionTitle";

/**
 * FullOverview — Complete ~5-minute overview (tightened pacing)
 *
 * Scene durations = voiceover duration + ~100 frames (3.3s) breathing room.
 * No more 15-20 second dead air gaps.
 *
 * VO durations (frames):
 *   logo-intro: 202       → scene: 300 (intro gets extra time for logo animation)
 *   problem-scene: 795    → scene: 895
 *   solution-scene: 860   → scene: 960
 *   dashboard-demo: 822   → scene: 922
 *   consent-wizard: 1017  → scene: 1117
 *   sync-visualization: 827 → scene: 927
 *   audit-trail: 848      → scene: 948
 *   feature-grid: 946     → scene: 1046
 *   pricing-comparison: 963 → scene: 1063
 *   cta-endcard: 250      → scene: 350
 *   Section titles: 120f each (VO ~37-44f plays during them)
 *
 * Sum of sequences: 9368
 * Transitions: 16 x 20f = 320 overlap
 * Actual: 9368 - 320 = 9048 frames = 301.6s (~5 min)
 *
 * Scene start frames:
 *   LogoIntro:          0       (300f)
 *   TitleTheProblem:    280     (120f)
 *   ProblemScene:       380     (895f)
 *   TitleTheSolution:   1255    (120f)
 *   SolutionScene:      1355    (960f)
 *   TitleThePlatform:   2295    (120f)
 *   DashboardDemo:      2395    (922f)
 *   TitleHowItWorks:    3297    (120f)
 *   ConsentWizard:      3397    (1117f)
 *   SyncVisualization:  4494    (927f)
 *   AuditTrail:         5401    (948f)
 *   TitleKeyFeatures:   6329    (120f)
 *   FeatureGrid:        6429    (1046f)
 *   TitlePricing:       7455    (120f)
 *   PricingComparison:  7555    (1063f)
 *   TitleGetStarted:    8598    (120f)
 *   CTAEndCard:         8698    (350f)
 */

const TitleTheProblem: React.FC = () => <SectionTitle title="The Problem" />;
const TitleTheSolution: React.FC = () => <SectionTitle title="The Solution" />;
const TitleThePlatform: React.FC = () => <SectionTitle title="The Platform" />;
const TitleHowItWorks: React.FC = () => <SectionTitle title="How It Works" />;
const TitleKeyFeatures: React.FC = () => <SectionTitle title="Key Features" />;
const TitlePricing: React.FC = () => <SectionTitle title="Pricing" />;
const TitleGetStarted: React.FC = () => <SectionTitle title="Get Started" />;

export const FullOverview: React.FC = () => {
  return (
    <AbsoluteFill>
      {/* Background music — loops for entire video */}
      <Audio src={staticFile("background-music.mp3")} volume={0.12} loop />

      {/* Logo intro */}
      <Sequence from={0}>
        <Audio src={staticFile("audio/logo-intro.mp3")} volume={0.88} />
      </Sequence>

      {/* "The Problem" — title VO then scene VO immediately after */}
      <Sequence from={280}>
        <Audio src={staticFile("audio/title-the-problem.mp3")} volume={0.88} />
      </Sequence>
      <Sequence from={320}>
        <Audio src={staticFile("audio/problem-scene.mp3")} volume={0.88} />
      </Sequence>

      {/* "The Solution" */}
      <Sequence from={1255}>
        <Audio src={staticFile("audio/title-the-solution.mp3")} volume={0.88} />
      </Sequence>
      <Sequence from={1297}>
        <Audio src={staticFile("audio/solution-scene.mp3")} volume={0.88} />
      </Sequence>

      {/* "The Platform" */}
      <Sequence from={2295}>
        <Audio src={staticFile("audio/title-the-platform.mp3")} volume={0.88} />
      </Sequence>
      <Sequence from={2337}>
        <Audio src={staticFile("audio/dashboard-demo.mp3")} volume={0.88} />
      </Sequence>

      {/* "How It Works" */}
      <Sequence from={3297}>
        <Audio src={staticFile("audio/title-how-it-works.mp3")} volume={0.88} />
      </Sequence>
      <Sequence from={3342}>
        <Audio src={staticFile("audio/consent-wizard.mp3")} volume={0.88} />
      </Sequence>

      {/* Sync and Audit — flow from "How It Works", no title cards */}
      <Sequence from={4494}>
        <Audio src={staticFile("audio/sync-visualization.mp3")} volume={0.88} />
      </Sequence>
      <Sequence from={5401}>
        <Audio src={staticFile("audio/audit-trail.mp3")} volume={0.88} />
      </Sequence>

      {/* "Key Features" */}
      <Sequence from={6329}>
        <Audio src={staticFile("audio/title-key-features.mp3")} volume={0.88} />
      </Sequence>
      <Sequence from={6375}>
        <Audio src={staticFile("audio/feature-grid.mp3")} volume={0.88} />
      </Sequence>

      {/* "Pricing" */}
      <Sequence from={7455}>
        <Audio src={staticFile("audio/title-pricing.mp3")} volume={0.88} />
      </Sequence>
      <Sequence from={7492}>
        <Audio src={staticFile("audio/pricing-comparison.mp3")} volume={0.88} />
      </Sequence>

      {/* "Get Started" */}
      <Sequence from={8598}>
        <Audio src={staticFile("audio/title-get-started.mp3")} volume={0.88} />
      </Sequence>
      <Sequence from={8642}>
        <Audio src={staticFile("audio/cta-endcard.mp3")} volume={0.88} />
      </Sequence>

      {/* Visual content — tightened scene durations */}
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={300}>
          <LogoIntro />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 20 })}
        />

        <TransitionSeries.Sequence durationInFrames={120}>
          <TitleTheProblem />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 20 })}
        />

        <TransitionSeries.Sequence durationInFrames={895}>
          <ProblemScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 20 })}
        />

        <TransitionSeries.Sequence durationInFrames={120}>
          <TitleTheSolution />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 20 })}
        />

        <TransitionSeries.Sequence durationInFrames={960}>
          <SolutionScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 20 })}
        />

        <TransitionSeries.Sequence durationInFrames={120}>
          <TitleThePlatform />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 20 })}
        />

        <TransitionSeries.Sequence durationInFrames={922}>
          <DashboardDemo />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 20 })}
        />

        <TransitionSeries.Sequence durationInFrames={120}>
          <TitleHowItWorks />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 20 })}
        />

        <TransitionSeries.Sequence durationInFrames={1117}>
          <ConsentWizard />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 20 })}
        />

        <TransitionSeries.Sequence durationInFrames={927}>
          <SyncVisualization />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 20 })}
        />

        <TransitionSeries.Sequence durationInFrames={948}>
          <AuditTrail />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 20 })}
        />

        <TransitionSeries.Sequence durationInFrames={120}>
          <TitleKeyFeatures />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 20 })}
        />

        <TransitionSeries.Sequence durationInFrames={1046}>
          <FeatureGrid />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 20 })}
        />

        <TransitionSeries.Sequence durationInFrames={120}>
          <TitlePricing />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 20 })}
        />

        <TransitionSeries.Sequence durationInFrames={1063}>
          <PricingComparison />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 20 })}
        />

        <TransitionSeries.Sequence durationInFrames={120}>
          <TitleGetStarted />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 20 })}
        />

        <TransitionSeries.Sequence durationInFrames={350}>
          <CTAEndCard />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
