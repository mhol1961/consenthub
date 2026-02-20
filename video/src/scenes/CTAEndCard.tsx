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
import { COLORS } from "../lib/colors";
import { FONTS } from "../lib/fonts";

export const CTAEndCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  /* ── Headline entrance ── */
  const headlineProgress = spring({
    frame,
    fps,
    config: { damping: 200 },
  });
  const headlineOpacity = interpolate(headlineProgress, [0, 1], [0, 1]);
  const headlineY = interpolate(headlineProgress, [0, 1], [30, 0]);

  /* ── URL entrance (delay 0.8s) ── */
  const urlDelay = Math.round(0.8 * fps);
  const urlProgress = spring({
    frame: Math.max(0, frame - urlDelay),
    fps,
    config: { damping: 200 },
  });
  const urlOpacity = interpolate(urlProgress, [0, 1], [0, 1]);
  const urlY = interpolate(urlProgress, [0, 1], [20, 0]);

  /* ── Logo entrance (delay 1.2s) ── */
  const logoDelay = Math.round(1.2 * fps);
  const logoProgress = spring({
    frame: Math.max(0, frame - logoDelay),
    fps,
    config: { damping: 200 },
  });
  const logoOpacity = interpolate(logoProgress, [0, 1], [0, 1]);

  return (
    <AbsoluteFill>
      {/* Custom gradient background (teal-dark to navy) */}
      <div
        style={{
          width: "100%",
          height: "100%",
          background: `linear-gradient(135deg, ${COLORS.tealDark} 0%, ${COLORS.navy} 60%, ${COLORS.navy} 100%)`,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Subtle glow orb */}
        <div
          style={{
            position: "absolute",
            top: "20%",
            left: "30%",
            width: 600,
            height: 600,
            borderRadius: "50%",
            background: COLORS.teal,
            opacity: 0.08,
            filter: "blur(128px)",
          }}
        />

        {/* Content */}
        <AbsoluteFill
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 32,
          }}
        >
          {/* Headline */}
          <div
            style={{
              fontSize: 56,
              fontFamily: FONTS.serif,
              fontWeight: "bold",
              color: COLORS.white,
              textAlign: "center",
              lineHeight: 1.2,
              maxWidth: 900,
              opacity: headlineOpacity,
              transform: `translateY(${headlineY}px)`,
            }}
          >
            Ready to Modernize Your Consent Workflow?
          </div>

          {/* URL */}
          <div
            style={{
              fontSize: 28,
              fontFamily: FONTS.sans,
              fontWeight: 600,
              color: COLORS.tealLight,
              opacity: urlOpacity,
              transform: `translateY(${urlY}px)`,
            }}
          >
            consenthub.io
          </div>

          {/* Logo */}
          <div
            style={{
              marginTop: 24,
              opacity: logoOpacity,
            }}
          >
            <Img
              src={staticFile("logo-dark.png")}
              style={{ height: 48 }}
            />
          </div>
        </AbsoluteFill>
      </div>
    </AbsoluteFill>
  );
};
