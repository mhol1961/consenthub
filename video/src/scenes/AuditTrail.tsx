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

/* ────────────────────────── hash string ────────────────────────── */
const FULL_HASH =
  "a3f7c9e2b1d4f8a6c3e7b2d5f9a1c4e8b3d6f2a7c5e9b4d8f1a3c6e2b5d9f4a8c7e1b6d3f5a9c2e4b8d7f6a1c3e5b9d2f8a2";

/* ====================================================================== */

export const AuditTrail: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  /* ── Entrance animation ── */
  const enterProgress = spring({
    frame,
    fps,
    config: { damping: 200 },
  });
  const enterOpacity = interpolate(enterProgress, [0, 1], [0, 1]);
  const enterY = interpolate(enterProgress, [0, 1], [40, 0]);

  /* ── Ken Burns zoom on screenshot ── */
  const zoomScale = interpolate(
    frame,
    [0, 30 * fps],
    [1.0, 1.08],
    { extrapolateRight: "clamp" },
  );

  /* ── SHA-256 typewriter ── */
  const hashStart = Math.round(2.5 * fps);
  const charsPerFrame = 2;
  const hashCharsShown = Math.max(
    0,
    Math.min(
      FULL_HASH.length,
      Math.floor((frame - hashStart) * charsPerFrame),
    ),
  );
  const displayHash = FULL_HASH.slice(0, hashCharsShown);
  const hashComplete = hashCharsShown >= FULL_HASH.length;

  /* ── "Verified" badge ── */
  const verifiedDelay =
    hashStart + Math.ceil(FULL_HASH.length / charsPerFrame) + 10;
  const verifiedProgress = spring({
    frame: Math.max(0, frame - verifiedDelay),
    fps,
    config: { damping: 12, stiffness: 100 },
  });
  const verifiedScale = interpolate(verifiedProgress, [0, 1], [0.6, 1]);
  const verifiedOpacity = interpolate(verifiedProgress, [0, 1], [0, 1]);

  /* ── "All records verified" text ── */
  const allVerifiedDelay = verifiedDelay + 15;
  const allVerifiedProgress = spring({
    frame: Math.max(0, frame - allVerifiedDelay),
    fps,
    config: { damping: 200 },
  });
  const allVerifiedOpacity = interpolate(
    allVerifiedProgress,
    [0, 1],
    [0, 1],
  );

  /* ── SHA-256 box entrance ── */
  const hashBoxDelay = Math.round(2.0 * fps);
  const hashBoxProgress = spring({
    frame: Math.max(0, frame - hashBoxDelay),
    fps,
    config: { damping: 200 },
  });
  const hashBoxOpacity = interpolate(hashBoxProgress, [0, 1], [0, 1]);
  const hashBoxY = interpolate(hashBoxProgress, [0, 1], [30, 0]);

  return (
    <AbsoluteFill>
      <GradientBackground>
        <AbsoluteFill
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "40px 100px",
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              opacity: enterOpacity,
              transform: `translateY(${enterY}px)`,
            }}
          >
            <BrowserFrame url="app.consenthub.io/audit">
              <div
                style={{
                  position: "relative",
                  overflow: "hidden",
                  minHeight: 800,
                  backgroundColor: COLORS.slate900,
                }}
              >
                {/* ── Real audit log screenshot ── */}
                <Img
                  src={staticFile("screenshots/audit-log.png")}
                  style={{
                    width: "100%",
                    objectFit: "cover",
                    transform: `scale(${zoomScale})`,
                    transformOrigin: "center top",
                  }}
                />

                {/* ── SHA-256 Verification Box (overlay at bottom) ── */}
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: "0 24px 20px",
                    opacity: hashBoxOpacity,
                    transform: `translateY(${hashBoxY}px)`,
                    zIndex: 10,
                  }}
                >
                  {/* Gradient fade from transparent to dark */}
                  <div
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: 200,
                      background: `linear-gradient(to bottom, transparent, ${COLORS.navy}EE 40%, ${COLORS.navy} 100%)`,
                      zIndex: -1,
                    }}
                  />

                  <div
                    style={{
                      backgroundColor: `${COLORS.slate800}EE`,
                      borderRadius: 12,
                      padding: "20px 24px",
                      border: `1px solid ${COLORS.slate700}`,
                      backdropFilter: "blur(8px)",
                    }}
                  >
                    {/* Header */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        marginBottom: 14,
                      }}
                    >
                      {/* Lock icon */}
                      <svg
                        width={18}
                        height={18}
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <rect
                          x={3}
                          y={11}
                          width={18}
                          height={11}
                          rx={2}
                          stroke={COLORS.teal}
                          strokeWidth={2}
                        />
                        <path
                          d="M7 11V7a5 5 0 0 1 10 0v4"
                          stroke={COLORS.teal}
                          strokeWidth={2}
                          strokeLinecap="round"
                        />
                      </svg>
                      <span
                        style={{
                          fontSize: 14,
                          fontFamily: FONTS.sans,
                          fontWeight: 600,
                          color: COLORS.white,
                        }}
                      >
                        SHA-256 Integrity Check
                      </span>
                      {/* Verified badge */}
                      {hashComplete && (
                        <div
                          style={{
                            marginLeft: 12,
                            backgroundColor: "#10B98122",
                            color: "#10B981",
                            fontSize: 12,
                            fontFamily: FONTS.sans,
                            fontWeight: 700,
                            padding: "3px 12px",
                            borderRadius: 9999,
                            opacity: verifiedOpacity,
                            transform: `scale(${verifiedScale})`,
                          }}
                        >
                          Verified
                        </div>
                      )}
                    </div>

                    {/* Hash display */}
                    <div
                      style={{
                        fontFamily: "monospace",
                        fontSize: 13,
                        color: COLORS.tealLight,
                        backgroundColor: COLORS.slate900,
                        padding: "10px 16px",
                        borderRadius: 8,
                        letterSpacing: 1,
                        minHeight: 20,
                        wordBreak: "break-all" as const,
                      }}
                    >
                      {displayHash}
                      {!hashComplete && hashCharsShown > 0 && (
                        <span style={{ opacity: frame % 15 < 8 ? 1 : 0 }}>
                          |
                        </span>
                      )}
                    </div>

                    {/* All records verified text */}
                    {hashComplete && (
                      <span
                        style={{
                          display: "block",
                          marginTop: 12,
                          fontSize: 13,
                          fontFamily: FONTS.sans,
                          color: COLORS.slate400,
                          opacity: allVerifiedOpacity,
                        }}
                      >
                        All records verified — no tampering detected
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </BrowserFrame>
          </div>
        </AbsoluteFill>
      </GradientBackground>
    </AbsoluteFill>
  );
};
