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

/* ────────────────────────── packet data ────────────────────────── */
interface Packet {
  label: string;
  direction: "right" | "left";
  color: string;
  delaySec: number;
}

const PACKETS: Packet[] = [
  { label: "Consent Record", direction: "right", color: COLORS.teal, delaySec: 0.5 },
  { label: "PDF Document", direction: "right", color: COLORS.teal, delaySec: 1.8 },
  { label: "Contact Update", direction: "left", color: COLORS.indigo, delaySec: 3.2 },
  { label: "Audit Entry", direction: "right", color: COLORS.teal, delaySec: 4.5 },
  { label: "Preference Change", direction: "left", color: COLORS.indigo, delaySec: 5.8 },
];

/* ────────────────────────── icons (inline SVGs) ────────────────── */
const ShieldIcon: React.FC = () => (
  <svg width={32} height={32} viewBox="0 0 24 24" fill="none">
    <path
      d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
      stroke={COLORS.white}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <polyline
      points="9,12 11,14 15,10"
      stroke={COLORS.white}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
);

const GlobeIcon: React.FC = () => (
  <svg width={32} height={32} viewBox="0 0 24 24" fill="none">
    <circle cx={12} cy={12} r={10} stroke={COLORS.white} strokeWidth={2} />
    <ellipse cx={12} cy={12} rx={4} ry={10} stroke={COLORS.white} strokeWidth={2} />
    <line x1={2} y1={12} x2={22} y2={12} stroke={COLORS.white} strokeWidth={2} />
  </svg>
);

/* ====================================================================== */

export const SyncVisualization: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  /* ── Endpoint entrance ── */
  const leftEnter = spring({
    frame,
    fps,
    config: { damping: 200 },
  });
  const leftX = interpolate(leftEnter, [0, 1], [-60, 0]);
  const leftOpacity = interpolate(leftEnter, [0, 1], [0, 1]);

  const rightEnter = spring({
    frame: Math.max(0, frame - 5),
    fps,
    config: { damping: 200 },
  });
  const rightX = interpolate(rightEnter, [0, 1], [60, 0]);
  const rightOpacity = interpolate(rightEnter, [0, 1], [0, 1]);

  /* ── Track fade in ── */
  const trackOpacity = interpolate(
    frame,
    [Math.round(0.3 * fps), Math.round(0.6 * fps)],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  /* ── Packets ── */
  const TRACK_WIDTH = 700; // px between endpoints
  const packetAnimDuration = Math.round(1.2 * fps);

  const packetStates = PACKETS.map((pkt) => {
    const delay = Math.round(pkt.delaySec * fps);
    const progress = interpolate(
      frame,
      [delay, delay + packetAnimDuration],
      [0, 1],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
    );

    let xPos: number;
    if (pkt.direction === "right") {
      xPos = interpolate(progress, [0, 1], [0, TRACK_WIDTH]);
    } else {
      xPos = interpolate(progress, [0, 1], [TRACK_WIDTH, 0]);
    }

    const opacity = progress > 0 && progress < 1 ? 1 : progress >= 1 ? 0 : 0;
    // Fade in quickly, fade out at end
    const packetOpacity = interpolate(
      progress,
      [0, 0.05, 0.9, 1],
      [0, 1, 1, 0],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
    );

    return { ...pkt, xPos, opacity: packetOpacity };
  });

  /* ── Status bar pulsing dot ── */
  const pulseOpacity = interpolate(
    frame % Math.round(1.5 * fps),
    [0, Math.round(0.75 * fps), Math.round(1.5 * fps)],
    [0.4, 1, 0.4],
  );

  const statusDelay = Math.round(1.0 * fps);
  const statusProgress = spring({
    frame: Math.max(0, frame - statusDelay),
    fps,
    config: { damping: 200 },
  });
  const statusOpacity = interpolate(statusProgress, [0, 1], [0, 1]);
  const statusY = interpolate(statusProgress, [0, 1], [20, 0]);

  return (
    <AbsoluteFill>
      <GradientBackground>
        <AbsoluteFill
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "60px 120px",
          }}
        >
          {/* ── Title ── */}
          <div
            style={{
              fontSize: 18,
              fontFamily: FONTS.sans,
              fontWeight: 600,
              color: COLORS.slate400,
              letterSpacing: 3,
              textTransform: "uppercase" as const,
              marginBottom: 48,
            }}
          >
            Real-Time Integration
          </div>

          {/* ── Main sync area ── */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              position: "relative",
              height: 200,
            }}
          >
            {/* ── Left endpoint: ConsentHub ── */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 12,
                opacity: leftOpacity,
                transform: `translateX(${leftX}px)`,
                width: 180,
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: "50%",
                  backgroundColor: COLORS.teal,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ShieldIcon />
              </div>
              <span
                style={{
                  fontSize: 20,
                  fontFamily: FONTS.serif,
                  fontWeight: "bold",
                  color: COLORS.white,
                }}
              >
                ConsentHub
              </span>
              <span
                style={{
                  fontSize: 14,
                  fontFamily: FONTS.sans,
                  color: COLORS.slate400,
                }}
              >
                Consent Engine
              </span>
            </div>

            {/* ── Track + Packets ── */}
            <div
              style={{
                flex: 1,
                height: 2,
                position: "relative",
                margin: "0 40px",
                opacity: trackOpacity,
              }}
            >
              {/* Dashed track */}
              <div
                style={{
                  width: "100%",
                  height: 0,
                  borderTop: `2px dashed ${COLORS.slate700}`,
                  position: "absolute",
                  top: 0,
                }}
              />
              {/* Packets */}
              {packetStates.map((pkt, i) => (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    top: -14,
                    left: pkt.xPos,
                    transform: "translateX(-50%)",
                    opacity: pkt.opacity,
                  }}
                >
                  <div
                    style={{
                      backgroundColor: pkt.color,
                      color: COLORS.white,
                      fontSize: 11,
                      fontFamily: FONTS.sans,
                      fontWeight: 600,
                      padding: "4px 14px",
                      borderRadius: 9999,
                      whiteSpace: "nowrap",
                      boxShadow: `0 0 16px ${pkt.color}55`,
                    }}
                  >
                    {pkt.label}
                  </div>
                </div>
              ))}
            </div>

            {/* ── Right endpoint: Dynamics 365 ── */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 12,
                opacity: rightOpacity,
                transform: `translateX(${rightX}px)`,
                width: 180,
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: "50%",
                  backgroundColor: COLORS.indigo,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <GlobeIcon />
              </div>
              <span
                style={{
                  fontSize: 20,
                  fontFamily: FONTS.serif,
                  fontWeight: "bold",
                  color: COLORS.white,
                }}
              >
                Dynamics 365
              </span>
              <span
                style={{
                  fontSize: 14,
                  fontFamily: FONTS.sans,
                  color: COLORS.slate400,
                }}
              >
                CRM Platform
              </span>
            </div>
          </div>

          {/* ── Status bar ── */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginTop: 80,
              opacity: statusOpacity,
              transform: `translateY(${statusY}px)`,
              backgroundColor: `${COLORS.slate800}CC`,
              padding: "12px 28px",
              borderRadius: 9999,
              border: `1px solid ${COLORS.slate700}`,
            }}
          >
            {/* Pulsing green dot */}
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                backgroundColor: "#10B981",
                opacity: pulseOpacity,
                boxShadow: `0 0 8px #10B981`,
              }}
            />
            <span
              style={{
                fontSize: 14,
                fontFamily: FONTS.sans,
                fontWeight: 600,
                color: COLORS.slate300,
              }}
            >
              Bi-directional sync active
            </span>
            <span
              style={{
                fontSize: 13,
                fontFamily: FONTS.sans,
                color: COLORS.slate500,
              }}
            >
              &lt; 200ms latency
            </span>
          </div>
        </AbsoluteFill>
      </GradientBackground>
    </AbsoluteFill>
  );
};
