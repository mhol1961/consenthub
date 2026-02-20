import React from "react";
import {
  AbsoluteFill,
  Img,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { GradientBackground } from "../components/GradientBackground";
import { Badge } from "../components/Badge";
import { COLORS } from "../lib/colors";

export const LogoIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Logo entrance: spring-based opacity and scale
  const logoProgress = spring({
    frame,
    fps,
    config: {
      damping: 200,
    },
  });

  const logoOpacity = interpolate(logoProgress, [0, 1], [0, 1]);
  const logoScale = interpolate(logoProgress, [0, 1], [0.9, 1]);

  // Glow behind logo: opacity animates 0 -> 0.3 -> 0.15 over 2s (60 frames at 30fps)
  const glowOpacity = interpolate(
    frame,
    [0, 30, 60],
    [0, 0.3, 0.15],
    { extrapolateRight: "clamp" },
  );

  // Badge delay
  const badgeDelay = Math.round(0.6 * fps);

  return (
    <AbsoluteFill>
      <GradientBackground>
        <AbsoluteFill
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 24,
          }}
        >
          {/* Glow behind logo */}
          <div
            style={{
              position: "absolute",
              width: 400,
              height: 400,
              borderRadius: "50%",
              backgroundColor: COLORS.teal,
              filter: "blur(80px)",
              opacity: glowOpacity,
            }}
          />

          {/* Logo */}
          <Img
            src={staticFile("logo-dark.png")}
            style={{
              height: 80,
              opacity: logoOpacity,
              transform: `scale(${logoScale})`,
            }}
          />

          {/* Trust badge */}
          <Badge
            text="HIPAA Compliant  \u00b7  SOC 2 Type II"
            bg="rgba(13, 148, 136, 0.15)"
            color={COLORS.tealLight}
            delay={badgeDelay}
            fontSize={16}
          />
        </AbsoluteFill>
      </GradientBackground>
    </AbsoluteFill>
  );
};
