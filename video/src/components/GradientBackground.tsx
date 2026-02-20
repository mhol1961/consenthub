import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { COLORS } from "../lib/colors";

export const GradientBackground: React.FC<{
  children?: React.ReactNode;
}> = ({ children }) => {
  const frame = useCurrentFrame();

  // Teal orb: top-left area, slow sine-like drift
  const tealX = interpolate(frame % 600, [0, 150, 300, 450, 600], [-5, 8, 3, -3, -5]);
  const tealY = interpolate(frame % 500, [0, 125, 250, 375, 500], [-3, 5, -2, 7, -3]);

  // Indigo orb: bottom-right area, opposite drift
  const indigoX = interpolate(frame % 550, [0, 137, 275, 412, 550], [5, -6, 2, -4, 5]);
  const indigoY = interpolate(frame % 650, [0, 162, 325, 487, 650], [3, -5, 4, -7, 3]);

  // Sky orb: center, subtle scale pulse
  const skyScale = interpolate(
    frame % 400,
    [0, 100, 200, 300, 400],
    [1.0, 1.15, 1.0, 1.08, 1.0],
  );

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: COLORS.navy,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Teal orb */}
      <div
        style={{
          position: "absolute",
          top: "10%",
          left: "10%",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: COLORS.teal,
          opacity: 0.15,
          filter: "blur(128px)",
          transform: `translate(${tealX}%, ${tealY}%)`,
        }}
      />

      {/* Indigo orb */}
      <div
        style={{
          position: "absolute",
          bottom: "5%",
          right: "5%",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: COLORS.indigo,
          opacity: 0.12,
          filter: "blur(128px)",
          transform: `translate(${indigoX}%, ${indigoY}%)`,
        }}
      />

      {/* Sky orb */}
      <div
        style={{
          position: "absolute",
          top: "30%",
          left: "35%",
          width: 450,
          height: 450,
          borderRadius: "50%",
          background: "#38BDF8",
          opacity: 0.08,
          filter: "blur(128px)",
          transform: `scale(${skyScale})`,
        }}
      />

      {/* Content layer */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          height: "100%",
        }}
      >
        {children}
      </div>
    </div>
  );
};
