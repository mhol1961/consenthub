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
 * Total sequence frames: 13500 + 320 = 13820
 *
 * Audio start frames (cumulative - transitions):
 *   LogoIntro:          0
 *   TitleTheProblem:    300 - 20 = 280       (no VO)
 *   ProblemScene:       280 + 120 - 20 = 380
 *   TitleTheSolution:   380 + 1350 - 20 = 1710  (no VO)
 *   SolutionScene:      1710 + 120 - 20 = 1810
 *   TitleThePlatform:   1810 + 1350 - 20 = 3140  (no VO)
 *   DashboardDemo:      3140 + 120 - 20 = 3240
 *   TitleHowItWorks:    3240 + 1950 - 20 = 5170  (no VO)
 *   ConsentWizard:      5170 + 120 - 20 = 5270
 *   SyncVisualization:  5270 + 1800 - 20 = 7050
 *   AuditTrail:         7050 + 1470 - 20 = 8500
 *   TitleKeyFeatures:   8500 + 1470 - 20 = 9950  (no VO)
 *   FeatureGrid:        9950 + 120 - 20 = 10050
 *   TitlePricing:       10050 + 1320 - 20 = 11350  (no VO)
 *   PricingComparison:  11350 + 120 - 20 = 11450
 *   TitleGetStarted:    11450 + 1320 - 20 = 12750  (no VO)
 *   CTAEndCard:         12750 + 120 - 20 = 12850
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

      {/* Full voiceover per scene (section titles have no VO) */}
      <Sequence from={0}>
        <Audio src={staticFile("audio/logo-intro.mp3")} volume={0.88} />
      </Sequence>
      <Sequence from={380}>
        <Audio src={staticFile("audio/problem-scene.mp3")} volume={0.88} />
      </Sequence>
      <Sequence from={1810}>
        <Audio src={staticFile("audio/solution-scene.mp3")} volume={0.88} />
      </Sequence>
      <Sequence from={3240}>
        <Audio src={staticFile("audio/dashboard-demo.mp3")} volume={0.88} />
      </Sequence>
      <Sequence from={5270}>
        <Audio src={staticFile("audio/consent-wizard.mp3")} volume={0.88} />
      </Sequence>
      <Sequence from={7050}>
        <Audio src={staticFile("audio/sync-visualization.mp3")} volume={0.88} />
      </Sequence>
      <Sequence from={8500}>
        <Audio src={staticFile("audio/audit-trail.mp3")} volume={0.88} />
      </Sequence>
      <Sequence from={10050}>
        <Audio src={staticFile("audio/feature-grid.mp3")} volume={0.88} />
      </Sequence>
      <Sequence from={11450}>
        <Audio src={staticFile("audio/pricing-comparison.mp3")} volume={0.88} />
      </Sequence>
      <Sequence from={12850}>
        <Audio src={staticFile("audio/cta-endcard.mp3")} volume={0.88} />
      </Sequence>

      {/* Visual content */}
      <TransitionSeries>
        {/* Logo intro */}
        <TransitionSeries.Sequence durationInFrames={300}>
          <LogoIntro />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 20 })}
        />

        {/* Section: The Problem */}
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

        {/* Section: The Solution */}
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

        {/* Section: The Platform */}
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

        {/* Section: How It Works */}
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

        {/* Sync & Audit (no section title — flows from "How It Works") */}
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

        {/* Section: Key Features */}
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

        {/* Section: Pricing */}
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

        {/* Section: Get Started */}
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
