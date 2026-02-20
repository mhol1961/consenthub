import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { FONTS } from "../lib/fonts";

interface BadgeProps {
  text: string;
  bg: string;
  color: string;
  delay?: number;
  fontSize?: number;
}

export const Badge: React.FC<BadgeProps> = ({
  text,
  bg,
  color,
  delay = 0,
  fontSize = 14,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const delayedFrame = Math.max(0, frame - delay);

  const progress = spring({
    frame: delayedFrame,
    fps,
    config: {
      damping: 12,
      stiffness: 100,
    },
  });

  const scale = interpolate(progress, [0, 1], [0.8, 1]);
  const opacity = interpolate(progress, [0, 1], [0, 1]);

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: bg,
        color,
        fontSize,
        fontFamily: FONTS.sans,
        fontWeight: 600,
        padding: "6px 16px",
        borderRadius: 9999,
        opacity,
        transform: `scale(${scale})`,
        whiteSpace: "nowrap",
      }}
    >
      {text}
    </div>
  );
};
