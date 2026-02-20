import React from "react";
import { AbsoluteFill, Sequence, staticFile } from "remotion";
import { Audio } from "@remotion/media";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { LogoIntro } from "../scenes/LogoIntro";
import { ProblemScene } from "../scenes/ProblemScene";
import { SolutionScene } from "../scenes/SolutionScene";
import { CTAEndCard } from "../scenes/CTAEndCard";

/**
 * ShortClipAuF — Australian Female Voice test (Clip 1 layout)
 * 30 seconds = 900 frames at 30fps
 * Voice: en-AU-NatashaNeural
 */
export const ShortClipAuF: React.FC = () => {
  return (
    <AbsoluteFill>
      <Audio src={staticFile("background-music.mp3")} volume={0.12} loop />

      <Sequence from={0}>
        <Audio src={staticFile("audio/clip1-intro-au-f.mp3")} volume={0.88} />
      </Sequence>
      <Sequence from={105}>
        <Audio src={staticFile("audio/clip1-problem-au-f.mp3")} volume={0.88} />
      </Sequence>
      <Sequence from={390}>
        <Audio src={staticFile("audio/clip1-solution-au-f.mp3")} volume={0.88} />
      </Sequence>
      <Sequence from={675}>
        <Audio src={staticFile("audio/clip1-cta-au-f.mp3")} volume={0.88} />
      </Sequence>

      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={120}>
          <LogoIntro />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 15 })}
        />

        <TransitionSeries.Sequence durationInFrames={300}>
          <ProblemScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 15 })}
        />

        <TransitionSeries.Sequence durationInFrames={300}>
          <SolutionScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 15 })}
        />

        <TransitionSeries.Sequence durationInFrames={225}>
          <CTAEndCard />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
