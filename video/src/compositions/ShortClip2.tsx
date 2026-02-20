import React from "react";
import { AbsoluteFill } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { LogoIntro } from "../scenes/LogoIntro";
import { SyncVisualization } from "../scenes/SyncVisualization";
import { DashboardDemo } from "../scenes/DashboardDemo";
import { CTAEndCard } from "../scenes/CTAEndCard";

/**
 * ShortClip2 — "Real-Time Dynamics 365 Integration"
 * 30 seconds = 900 frames at 30fps
 *
 * Scenes: LogoIntro -> SyncVisualization -> DashboardDemo -> CTAEndCard
 * Transitions: fade(15f), slide(from-right, 15f), fade(15f)
 * Duration math: 105 + 300 + 360 + 180 = 945 sequence frames
 *               945 - (3 * 15) = 900 actual frames
 */
export const ShortClip2: React.FC = () => {
  return (
    <AbsoluteFill>
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={105}>
          <LogoIntro />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 15 })}
        />

        <TransitionSeries.Sequence durationInFrames={300}>
          <SyncVisualization />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={slide({ direction: "from-right" })}
          timing={linearTiming({ durationInFrames: 15 })}
        />

        <TransitionSeries.Sequence durationInFrames={360}>
          <DashboardDemo />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 15 })}
        />

        <TransitionSeries.Sequence durationInFrames={180}>
          <CTAEndCard />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
