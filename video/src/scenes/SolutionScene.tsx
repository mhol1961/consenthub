import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { GradientBackground } from "../components/GradientBackground";
import { AnimatedText } from "../components/AnimatedText";
import { COLORS } from "../lib/colors";
import { FONTS } from "../lib/fonts";

const BULLETS = [
  "Digital consent capture with legally-binding e-signatures",
  "Real-time bi-directional Dynamics 365 sync",
  "Immutable audit trail with SHA-256 checksums",
  "Self-service patient portal for preference management",
];

const TealCheckIcon: React.FC = () => (
  <svg
    width={28}
    height={28}
    viewBox="0 0 28 28"
    fill="none"
    style={{ flexShrink: 0 }}
  >
    <circle cx={14} cy={14} r={12} stroke={COLORS.teal} strokeWidth={2.5} fill="none" />
    <polyline
      points="9,14.5 12.5,18 19,10.5"
      stroke={COLORS.teal}
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
);

export const SolutionScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Teal accent bar width animates 0% -> 100% over 0.8s
  const barWidth = interpolate(
    frame,
    [0, Math.round(0.8 * fps)],
    [0, 100],
    { extrapolateRight: "clamp" },
  );

  return (
    <AbsoluteFill>
      <GradientBackground>
        <AbsoluteFill
          style={{
            padding: "80px 120px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
          }}
        >
          {/* Teal accent bar */}
          <div
            style={{
              width: `${barWidth}%`,
              height: 4,
              borderRadius: 2,
              background: `linear-gradient(90deg, ${COLORS.teal}, transparent)`,
              marginBottom: 40,
            }}
          />

          {/* Header */}
          <AnimatedText
            text="ConsentHub Changes Everything"
            fontSize={64}
            align="left"
            delay={Math.round(0.3 * fps)}
          />

          {/* Bullet points */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 28,
              marginTop: 48,
            }}
          >
            {BULLETS.map((text, i) => {
              const bulletDelay = Math.round((0.8 + i * 0.4) * fps);
              const bulletProgress = spring({
                frame: Math.max(0, frame - bulletDelay),
                fps,
                config: {
                  damping: 200,
                },
              });

              const bulletOpacity = interpolate(bulletProgress, [0, 1], [0, 1]);
              const bulletTranslateX = interpolate(bulletProgress, [0, 1], [-30, 0]);

              return (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    opacity: bulletOpacity,
                    transform: `translateX(${bulletTranslateX}px)`,
                  }}
                >
                  <TealCheckIcon />
                  <span
                    style={{
                      fontSize: 26,
                      color: COLORS.slate300,
                      fontFamily: FONTS.sans,
                      lineHeight: 1.5,
                    }}
                  >
                    {text}
                  </span>
                </div>
              );
            })}
          </div>
        </AbsoluteFill>
      </GradientBackground>
    </AbsoluteFill>
  );
};
