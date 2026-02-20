import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { GradientBackground } from "../components/GradientBackground";
import { COLORS } from "../lib/colors";
import { FONTS } from "../lib/fonts";

export const SectionTitle: React.FC<{ title: string }> = ({ title }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const lineScale = spring({
    frame,
    fps,
    config: { damping: 200 },
    delay: 10,
  });

  const textY = interpolate(
    spring({ frame, fps, config: { damping: 200 }, delay: 20 }),
    [0, 1],
    [40, 0],
  );

  const textOpacity = spring({
    frame,
    fps,
    config: { damping: 200 },
    delay: 20,
  });

  return (
    <AbsoluteFill>
      <GradientBackground />
      <AbsoluteFill
        style={{ justifyContent: "center", alignItems: "center" }}
      >
        <div
          style={{
            width: 200,
            height: 2,
            backgroundColor: COLORS.teal,
            transform: `scaleX(${lineScale})`,
            marginBottom: 32,
          }}
        />
        <div
          style={{
            fontFamily: FONTS.serif,
            fontSize: 56,
            color: COLORS.white,
            transform: `translateY(${textY}px)`,
            opacity: textOpacity,
            textAlign: "center",
          }}
        >
          {title}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
