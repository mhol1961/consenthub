import React from "react";
import { AbsoluteFill } from "remotion";
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
 * Scene durations:
 *   LogoIntro:            300f  (10s)
 *   "The Problem":        120f  (4s)
 *   ProblemScene:        1350f  (45s)
 *   "The Solution":       120f  (4s)
 *   SolutionScene:       1350f  (45s)
 *   "The Platform":       120f  (4s)
 *   DashboardDemo:       1950f  (65s)
 *   "How It Works":       120f  (4s)
 *   ConsentWizard:       1800f  (60s)
 *   SyncVisualization:   1470f  (49s)
 *   AuditTrail:          1470f  (49s)
 *   "Key Features":       120f  (4s)
 *   FeatureGrid:         1320f  (44s)
 *   "Pricing":            120f  (4s)
 *   PricingComparison:   1320f  (44s)
 *   "Get Started":        120f  (4s)
 *   CTAEndCard:           650f  (21.7s)
 *
 * Sum: 13820 sequence frames
 * Actual: 13820 - 320 = 13500
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
