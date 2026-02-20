import React from "react";
import { AbsoluteFill, Sequence, staticFile } from "remotion";
import { Audio } from "@remotion/media";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { LogoIntro } from "../scenes/LogoIntro";
import { AuditTrail } from "../scenes/AuditTrail";
import { ConsentWizard } from "../scenes/ConsentWizard";
import { CTAEndCard } from "../scenes/CTAEndCard";

/**
 * ShortClip3 — "HIPAA Compliance, Guaranteed"
 * 30 seconds = 900 frames at 30fps
 *
 * Scenes: LogoIntro -> AuditTrail -> ConsentWizard -> CTAEndCard
 * Transitions: fade(15f), slide(from-right, 15f), fade(15f)
 * Duration math: 105 + 300 + 360 + 180 = 945 sequence frames
 *               945 - (3 * 15) = 900 actual frames
 *
 * Audio start frames:
 *   LogoIntro:      0
 *   AuditTrail:     105 - 15 = 90
 *   ConsentWizard:  90 + 300 - 15 = 375
 *   CTAEndCard:     375 + 360 - 15 = 720
 */
export const ShortClip3: React.FC = () => {
  return (
    <AbsoluteFill>
      {/* Background music */}
      <Audio src={staticFile("background-music.mp3")} volume={0.12} loop />

      {/* Voiceover per scene */}
      <Sequence from={0}>
        <Audio src={staticFile("audio/clip3-intro.mp3")} volume={0.88} />
      </Sequence>
      <Sequence from={90}>
        <Audio src={staticFile("audio/clip3-audit.mp3")} volume={0.88} />
      </Sequence>
      <Sequence from={375}>
        <Audio src={staticFile("audio/clip3-wizard.mp3")} volume={0.88} />
      </Sequence>
      <Sequence from={720}>
        <Audio src={staticFile("audio/clip3-cta.mp3")} volume={0.88} />
      </Sequence>

      {/* Visual content */}
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={105}>
          <LogoIntro />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 15 })}
        />

        <TransitionSeries.Sequence durationInFrames={300}>
          <AuditTrail />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={slide({ direction: "from-right" })}
          timing={linearTiming({ durationInFrames: 15 })}
        />

        <TransitionSeries.Sequence durationInFrames={360}>
          <ConsentWizard />
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
