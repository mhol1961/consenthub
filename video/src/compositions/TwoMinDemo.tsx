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

/**
 * TwoMinDemo — Full 2-minute product demo
 * 120 seconds = 3600 frames at 30fps
 *
 * All 10 scenes in sequence with fade(15f) transitions.
 * 9 transitions x 15f = 135 frames overlap
 * Total sequence frames needed: 3600 + 135 = 3735
 *
 * Scene durations:
 *   LogoIntro:          135f  (4.5s)
 *   ProblemScene:       360f  (12s)
 *   SolutionScene:      360f  (12s)
 *   DashboardDemo:      540f  (18s)
 *   ConsentWizard:      450f  (15s)
 *   SyncVisualization:  390f  (13s)
 *   AuditTrail:         360f  (12s)
 *   FeatureGrid:        360f  (12s)
 *   PricingComparison:  360f  (12s)
 *   CTAEndCard:         420f  (14s)
 *
 * Sum: 135+360+360+540+450+390+360+360+360+420 = 3735
 * Actual: 3735 - 135 = 3600
 *
 * Audio start frames (cumulative - transitions):
 *   LogoIntro:          0
 *   ProblemScene:       135 - 15 = 120
 *   SolutionScene:      120 + 360 - 15 = 465
 *   DashboardDemo:      465 + 360 - 15 = 810
 *   ConsentWizard:      810 + 540 - 15 = 1335
 *   SyncVisualization:  1335 + 450 - 15 = 1770
 *   AuditTrail:         1770 + 390 - 15 = 2145
 *   FeatureGrid:        2145 + 360 - 15 = 2490
 *   PricingComparison:  2490 + 360 - 15 = 2835
 *   CTAEndCard:         2835 + 360 - 15 = 3180
 */
export const TwoMinDemo: React.FC = () => {
  return (
    <AbsoluteFill>
      {/* Background music — loops for entire 2 minutes */}
      <Audio src={staticFile("background-music.mp3")} volume={0.12} loop />

      {/* Brief voiceover per scene */}
      <Sequence from={0}>
        <Audio src={staticFile("audio/logo-intro-brief.mp3")} volume={0.88} />
      </Sequence>
      <Sequence from={120}>
        <Audio src={staticFile("audio/problem-scene-brief.mp3")} volume={0.88} />
      </Sequence>
      <Sequence from={465}>
        <Audio src={staticFile("audio/solution-scene-brief.mp3")} volume={0.88} />
      </Sequence>
      <Sequence from={810}>
        <Audio src={staticFile("audio/dashboard-demo-brief.mp3")} volume={0.88} />
      </Sequence>
      <Sequence from={1335}>
        <Audio src={staticFile("audio/consent-wizard-brief.mp3")} volume={0.88} />
      </Sequence>
      <Sequence from={1770}>
        <Audio src={staticFile("audio/sync-visualization-brief.mp3")} volume={0.88} />
      </Sequence>
      <Sequence from={2145}>
        <Audio src={staticFile("audio/audit-trail-brief.mp3")} volume={0.88} />
      </Sequence>
      <Sequence from={2490}>
        <Audio src={staticFile("audio/feature-grid-brief.mp3")} volume={0.88} />
      </Sequence>
      <Sequence from={2835}>
        <Audio src={staticFile("audio/pricing-comparison-brief.mp3")} volume={0.88} />
      </Sequence>
      <Sequence from={3180}>
        <Audio src={staticFile("audio/cta-endcard-brief.mp3")} volume={0.88} />
      </Sequence>

      {/* Visual content */}
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={135}>
          <LogoIntro />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 15 })}
        />

        <TransitionSeries.Sequence durationInFrames={360}>
          <ProblemScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 15 })}
        />

        <TransitionSeries.Sequence durationInFrames={360}>
          <SolutionScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 15 })}
        />

        <TransitionSeries.Sequence durationInFrames={540}>
          <DashboardDemo />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 15 })}
        />

        <TransitionSeries.Sequence durationInFrames={450}>
          <ConsentWizard />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 15 })}
        />

        <TransitionSeries.Sequence durationInFrames={390}>
          <SyncVisualization />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 15 })}
        />

        <TransitionSeries.Sequence durationInFrames={360}>
          <AuditTrail />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 15 })}
        />

        <TransitionSeries.Sequence durationInFrames={360}>
          <FeatureGrid />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 15 })}
        />

        <TransitionSeries.Sequence durationInFrames={360}>
          <PricingComparison />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 15 })}
        />

        <TransitionSeries.Sequence durationInFrames={420}>
          <CTAEndCard />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
