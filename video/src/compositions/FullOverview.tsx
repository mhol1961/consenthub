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
 * FullOverview — Complete 7.5-minute overview
 * 450 seconds = 13500 frames at 30fps
 *
 * 17 sequences (10 scenes + 7 section titles)
 * 16 transitions at 20f each = 320 frames overlap
 *
 * Visual start frames:
 *   LogoIntro:          0       (300f)
 *   TitleTheProblem:    280     (120f)
 *   ProblemScene:       380     (1350f)
 *   TitleTheSolution:   1710    (120f)
 *   SolutionScene:      1810    (1350f)
 *   TitleThePlatform:   3140    (120f)
 *   DashboardDemo:      3240    (1950f)
 *   TitleHowItWorks:    5170    (120f)
 *   ConsentWizard:      5270    (1800f)
 *   SyncVisualization:  7050    (1470f)
 *   AuditTrail:         8500    (1470f)
 *   TitleKeyFeatures:   9950    (120f)
 *   FeatureGrid:        10050   (1320f)
 *   TitlePricing:       11350   (120f)
 *   PricingComparison:  11450   (1320f)
 *   TitleGetStarted:    12750   (120f)
 *   CTAEndCard:         12850   (650f)
 *
 * VO starts at SECTION TITLE frames (not scene frames) to eliminate dead air.
 * Title VO (~1.3s) plays during title card, then scene VO follows immediately.
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
      {/* Background music — loops for entire 7.5 minutes */}
      <Audio src={staticFile("background-music.mp3")} volume={0.12} loop />

      {/* Logo intro VO — starts immediately */}
      <Sequence from={0}>
        <Audio src={staticFile("audio/logo-intro.mp3")} volume={0.88} />
      </Sequence>

      {/* "The Problem" title VO at frame 280, then scene VO after title (~37f later) */}
      <Sequence from={280}>
        <Audio src={staticFile("audio/title-the-problem.mp3")} volume={0.88} />
      </Sequence>
      <Sequence from={320}>
        <Audio src={staticFile("audio/problem-scene.mp3")} volume={0.88} />
      </Sequence>

      {/* "The Solution" title VO at frame 1710, then scene VO */}
      <Sequence from={1710}>
        <Audio src={staticFile("audio/title-the-solution.mp3")} volume={0.88} />
      </Sequence>
      <Sequence from={1752}>
        <Audio src={staticFile("audio/solution-scene.mp3")} volume={0.88} />
      </Sequence>

      {/* "The Platform" title VO at frame 3140, then scene VO */}
      <Sequence from={3140}>
        <Audio src={staticFile("audio/title-the-platform.mp3")} volume={0.88} />
      </Sequence>
      <Sequence from={3182}>
        <Audio src={staticFile("audio/dashboard-demo.mp3")} volume={0.88} />
      </Sequence>

      {/* "How It Works" title VO at frame 5170, then scene VO */}
      <Sequence from={5170}>
        <Audio src={staticFile("audio/title-how-it-works.mp3")} volume={0.88} />
      </Sequence>
      <Sequence from={5215}>
        <Audio src={staticFile("audio/consent-wizard.mp3")} volume={0.88} />
      </Sequence>

      {/* Sync and Audit scenes (no title cards — flow from "How It Works") */}
      <Sequence from={7050}>
        <Audio src={staticFile("audio/sync-visualization.mp3")} volume={0.88} />
      </Sequence>
      <Sequence from={8500}>
        <Audio src={staticFile("audio/audit-trail.mp3")} volume={0.88} />
      </Sequence>

      {/* "Key Features" title VO at frame 9950, then scene VO */}
      <Sequence from={9950}>
        <Audio src={staticFile("audio/title-key-features.mp3")} volume={0.88} />
      </Sequence>
      <Sequence from={9996}>
        <Audio src={staticFile("audio/feature-grid.mp3")} volume={0.88} />
      </Sequence>

      {/* "Pricing" title VO at frame 11350, then scene VO */}
      <Sequence from={11350}>
        <Audio src={staticFile("audio/title-pricing.mp3")} volume={0.88} />
      </Sequence>
      <Sequence from={11387}>
        <Audio src={staticFile("audio/pricing-comparison.mp3")} volume={0.88} />
      </Sequence>

      {/* "Get Started" title VO at frame 12750, then CTA VO */}
      <Sequence from={12750}>
        <Audio src={staticFile("audio/title-get-started.mp3")} volume={0.88} />
      </Sequence>
      <Sequence from={12794}>
        <Audio src={staticFile("audio/cta-endcard.mp3")} volume={0.88} />
      </Sequence>

      {/* Visual content */}
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

        <TransitionSeries.Sequence durationInFrames={1350}>
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

        <TransitionSeries.Sequence durationInFrames={1350}>
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

        <TransitionSeries.Sequence durationInFrames={1950}>
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

        <TransitionSeries.Sequence durationInFrames={1800}>
          <ConsentWizard />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 20 })}
        />

        <TransitionSeries.Sequence durationInFrames={1470}>
          <SyncVisualization />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 20 })}
        />

        <TransitionSeries.Sequence durationInFrames={1470}>
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

        <TransitionSeries.Sequence durationInFrames={1320}>
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

        <TransitionSeries.Sequence durationInFrames={1320}>
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

        <TransitionSeries.Sequence durationInFrames={650}>
          <CTAEndCard />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
