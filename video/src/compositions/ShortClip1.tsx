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
 * ShortClip1 — "Why Consent Management Is Broken"
 * 30 seconds = 900 frames at 30fps
 *
 * Scenes: LogoIntro -> ProblemScene -> SolutionScene -> CTAEndCard
 * Transitions: 3x fade(15f)
 * Duration math: 120 + 300 + 300 + 225 = 945 sequence frames
 *               945 - (3 * 15) = 900 actual frames
 *
 * Audio start frames (scene_start = cumulative - transitions):
 *   LogoIntro:     0
 *   ProblemScene:  120 - 15 = 105
 *   SolutionScene: 105 + 300 - 15 = 390
 *   CTAEndCard:    390 + 300 - 15 = 675
 */
export const ShortClip1: React.FC = () => {
  return (
    <AbsoluteFill>
      {/* Background music — loops for entire clip */}
      <Audio src={staticFile("background-music.mp3")} volume={0.12} loop />

      {/* Voiceover per scene */}
      <Sequence from={0}>
        <Audio src={staticFile("audio/clip1-intro.mp3")} volume={0.88} />
      </Sequence>
      <Sequence from={105}>
        <Audio src={staticFile("audio/clip1-problem.mp3")} volume={0.88} />
      </Sequence>
      <Sequence from={390}>
        <Audio src={staticFile("audio/clip1-solution.mp3")} volume={0.88} />
      </Sequence>
      <Sequence from={675}>
        <Audio src={staticFile("audio/clip1-cta.mp3")} volume={0.88} />
      </Sequence>

      {/* Visual content */}
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
