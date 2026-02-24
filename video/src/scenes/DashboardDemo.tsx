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
import { BrowserFrame } from "../components/BrowserFrame";
import { COLORS } from "../lib/colors";
import { FONTS } from "../lib/fonts";

/* ====================================================================== */

export const DashboardDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  /* ── Entire frame entrance (slide from right) ── */
  const enterProgress = spring({
    frame,
    fps,
    config: { damping: 200 },
  });
  const enterX = interpolate(enterProgress, [0, 1], [100, 0]);
  const enterOpacity = interpolate(enterProgress, [0, 1], [0, 1]);

  /* ── Ken Burns: slow zoom from 1.0 to 1.12 over full scene ── */
  const zoomScale = interpolate(
    frame,
    [0, 30 * fps],
    [1.0, 1.12],
    { extrapolateRight: "clamp" },
  );

  /* ── Slow vertical pan (slight upward drift) ── */
  const panY = interpolate(
    frame,
    [0, 30 * fps],
    [0, -20],
    { extrapolateRight: "clamp" },
  );

  /* ── Callout badges stagger in ── */
  const callouts = [
    { label: "1,247 Patients", x: "8%", y: "18%", color: "#3B82F6", delay: 1.5 },
    { label: "94.2% Compliant", x: "62%", y: "18%", color: "#10B981", delay: 2.0 },
    { label: "Real-Time Activity", x: "8%", y: "72%", color: COLORS.teal, delay: 2.5 },
  ];

  const calloutStates = callouts.map((c) => {
    const d = Math.round(c.delay * fps);
    const p = spring({
      frame: Math.max(0, frame - d),
      fps,
      config: { damping: 14, stiffness: 100 },
    });
    const scale = interpolate(p, [0, 1], [0.6, 1]);
    const opacity = interpolate(p, [0, 1], [0, 1]);
    return { ...c, scale, opacity };
  });

  return (
    <AbsoluteFill>
      <GradientBackground>
        <AbsoluteFill
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "40px 80px",
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              transform: `translateX(${enterX}px)`,
              opacity: enterOpacity,
            }}
          >
            <BrowserFrame url="app.consenthub.io/dashboard">
              <div
                style={{
                  position: "relative",
                  overflow: "hidden",
                  minHeight: 860,
                }}
              >
                {/* Real dashboard screenshot with Ken Burns effect */}
                <Img
                  src={staticFile("screenshots/dashboard-overview.png")}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transform: `scale(${zoomScale}) translateY(${panY}px)`,
                    transformOrigin: "center top",
                  }}
                />

                {/* Animated callout badges overlaying the screenshot */}
                {calloutStates.map((c, i) => (
                  <div
                    key={i}
                    style={{
                      position: "absolute",
                      left: c.x,
                      top: c.y,
                      opacity: c.opacity,
                      transform: `scale(${c.scale})`,
                      zIndex: 10,
                    }}
                  >
                    <div
                      style={{
                        backgroundColor: `${c.color}DD`,
                        color: COLORS.white,
                        fontSize: 14,
                        fontFamily: FONTS.sans,
                        fontWeight: 700,
                        padding: "6px 16px",
                        borderRadius: 9999,
                        whiteSpace: "nowrap",
                        boxShadow: `0 4px 20px ${c.color}44`,
                        border: `1px solid ${c.color}`,
                      }}
                    >
                      {c.label}
                    </div>
                  </div>
                ))}
              </div>
            </BrowserFrame>
          </div>
        </AbsoluteFill>
      </GradientBackground>
    </AbsoluteFill>
  );
};
