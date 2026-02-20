import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { GradientBackground } from "../components/GradientBackground";
import { BrowserFrame } from "../components/BrowserFrame";
import { COLORS } from "../lib/colors";
import { FONTS } from "../lib/fonts";

/* ────────────────────────── audit entries ────────────────────────── */
interface AuditEntry {
  action: string;
  subject: string;
  iconColor: string;
  actor: string;
  time: string;
}

const ENTRIES: AuditEntry[] = [
  { action: "Consent Granted", subject: "Sarah Mitchell", iconColor: COLORS.teal, actor: "Dr. Chen", time: "2 min ago" },
  { action: "PDF Generated", subject: "Sarah Mitchell", iconColor: "#3B82F6", actor: "System", time: "2 min ago" },
  { action: "Dynamics Synced", subject: "Sarah Mitchell", iconColor: COLORS.indigo, actor: "System", time: "2 min ago" },
  { action: "Consent Revoked", subject: "James Rivera", iconColor: COLORS.red, actor: "Portal", time: "15 min ago" },
  { action: "Template Updated", subject: "", iconColor: "#F59E0B", actor: "Dr. Mitchell", time: "1 hr ago" },
];

/* ────────────────────────── hash string ────────────────────────── */
const FULL_HASH = "a3f7c9e2b1d4f8a6c3e7b2d5f9a1c4e8b3d6f2a7c5e9b4d8f1a3c6e2b5d9f4a8c7e1b6d3f5a9c2e4b8d7f6a1c3e5b9d2f8a2";

/* ====================================================================== */

export const AuditTrail: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  /* ── Entry rows stagger in from left ── */
  const rowStates = ENTRIES.map((entry, i) => {
    const delay = Math.round(0.5 * fps) + i * 8;
    const p = spring({
      frame: Math.max(0, frame - delay),
      fps,
      config: { damping: 200 },
    });
    const opacity = interpolate(p, [0, 1], [0, 1]);
    const translateX = interpolate(p, [0, 1], [-40, 0]);
    return { ...entry, opacity, translateX };
  });

  /* ── SHA-256 typewriter ── */
  const hashStart = Math.round(2.5 * fps);
  const charsPerFrame = 2;
  const hashCharsShown = Math.max(
    0,
    Math.min(FULL_HASH.length, Math.floor((frame - hashStart) * charsPerFrame)),
  );
  const displayHash = FULL_HASH.slice(0, hashCharsShown);
  const hashComplete = hashCharsShown >= FULL_HASH.length;

  /* ── "Verified" badge ── */
  const verifiedDelay = hashStart + Math.ceil(FULL_HASH.length / charsPerFrame) + 10;
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
  const allVerifiedOpacity = interpolate(allVerifiedProgress, [0, 1], [0, 1]);

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
          <div style={{ width: "100%", height: "100%" }}>
            <BrowserFrame url="app.consenthub.io/audit">
              <div
                style={{
                  backgroundColor: COLORS.slate900,
                  minHeight: 800,
                  padding: "28px 32px",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {/* ── Header ── */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    justifyContent: "space-between",
                    marginBottom: 20,
                  }}
                >
                  <span
                    style={{
                      fontSize: 24,
                      fontFamily: FONTS.serif,
                      fontWeight: "bold",
                      color: COLORS.white,
                    }}
                  >
                    Immutable Audit Log
                  </span>
                  <span
                    style={{
                      fontSize: 14,
                      fontFamily: FONTS.sans,
                      color: COLORS.slate400,
                    }}
                  >
                    2,847 entries
                  </span>
                </div>

                {/* ── Table header ── */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "10px 16px",
                    borderBottom: `1px solid ${COLORS.slate700}`,
                  }}
                >
                  <span
                    style={{
                      flex: 3,
                      fontSize: 12,
                      fontFamily: FONTS.sans,
                      fontWeight: 600,
                      color: COLORS.slate500,
                      textTransform: "uppercase" as const,
                      letterSpacing: 1,
                    }}
                  >
                    Action
                  </span>
                  <span
                    style={{
                      flex: 1,
                      fontSize: 12,
                      fontFamily: FONTS.sans,
                      fontWeight: 600,
                      color: COLORS.slate500,
                      textTransform: "uppercase" as const,
                      letterSpacing: 1,
                    }}
                  >
                    Actor
                  </span>
                  <span
                    style={{
                      flex: 1,
                      fontSize: 12,
                      fontFamily: FONTS.sans,
                      fontWeight: 600,
                      color: COLORS.slate500,
                      textTransform: "uppercase" as const,
                      letterSpacing: 1,
                      textAlign: "right",
                    }}
                  >
                    Time
                  </span>
                </div>

                {/* ── Rows ── */}
                {rowStates.map((row, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: "14px 16px",
                      opacity: row.opacity,
                      transform: `translateX(${row.translateX}px)`,
                      backgroundColor:
                        i % 2 === 1 ? `${COLORS.slate800}80` : "transparent",
                      borderBottom: `1px solid ${COLORS.slate800}`,
                    }}
                  >
                    {/* Action + subject */}
                    <div
                      style={{
                        flex: 3,
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                      }}
                    >
                      <div
                        style={{
                          width: 20,
                          height: 20,
                          borderRadius: "50%",
                          backgroundColor: `${row.iconColor}22`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <div
                          style={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            backgroundColor: row.iconColor,
                          }}
                        />
                      </div>
                      <span
                        style={{
                          fontSize: 14,
                          fontFamily: FONTS.sans,
                          color: COLORS.white,
                          fontWeight: 500,
                        }}
                      >
                        {row.action}
                        {row.subject && (
                          <span style={{ color: COLORS.slate400 }}>
                            {" \u2014 "}
                            {row.subject}
                          </span>
                        )}
                      </span>
                    </div>
                    {/* Actor */}
                    <span
                      style={{
                        flex: 1,
                        fontSize: 13,
                        fontFamily: FONTS.sans,
                        color: COLORS.slate400,
                      }}
                    >
                      {row.actor}
                    </span>
                    {/* Time */}
                    <span
                      style={{
                        flex: 1,
                        fontSize: 13,
                        fontFamily: FONTS.sans,
                        color: COLORS.slate500,
                        textAlign: "right",
                      }}
                    >
                      {row.time}
                    </span>
                  </div>
                ))}

                {/* ── SHA-256 Verification Box ── */}
                <div
                  style={{
                    marginTop: 28,
                    backgroundColor: COLORS.slate800,
                    borderRadius: 12,
                    padding: "20px 24px",
                    border: `1px solid ${COLORS.slate700}`,
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
                    <svg width={18} height={18} viewBox="0 0 24 24" fill="none">
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
                      wordBreak: "break-all",
                    }}
                  >
                    {displayHash}
                    {!hashComplete && hashCharsShown > 0 && (
                      <span style={{ opacity: frame % 15 < 8 ? 1 : 0 }}>|</span>
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
            </BrowserFrame>
          </div>
        </AbsoluteFill>
      </GradientBackground>
    </AbsoluteFill>
  );
};
