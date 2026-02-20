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
 * Scene start frames (cumulative - transitions):
 *   LogoIntro:          0      (dur 135f)
 *   ProblemScene:       120    (dur 360f)
 *   SolutionScene:      465    (dur 360f)
 *   DashboardDemo:      810    (dur 540f)
 *   ConsentWizard:      1335   (dur 450f)
 *   SyncVisualization:  1770   (dur 390f)
 *   AuditTrail:         2145   (dur 360f)
 *   FeatureGrid:        2490   (dur 360f)
 *   PricingComparison:  2835   (dur 360f)
 *   CTAEndCard:         3180   (dur 420f)
 *
 * Brief VO durations: 42, 272, 241, 226, 254, 255, 245, 281, 185, 103 frames
 * Logo intro brief (42f) fits in 135f scene — no overlap.
 * All other VOs are shorter than their scenes — no overlaps.
 */
export const TwoMinDemo: React.FC = () => {
  return (
    <AbsoluteFill>
      {/* Background music — loops for entire 2 minutes */}
      <Audio src={staticFile("background-music.mp3")} volume={0.12} loop />

      {/* Brief voiceover per scene — starts when each scene begins */}
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
