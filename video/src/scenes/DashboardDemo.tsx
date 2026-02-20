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

/* ────────────────────────── metric card data ────────────────────────── */
const METRICS = [
  { label: "Total Patients", value: "1,247", iconBg: "#3B82F6", trend: "+12%", trendUp: true },
  { label: "Active Consents", value: "982", iconBg: COLORS.teal, trend: "+8%", trendUp: true },
  { label: "Pending Review", value: "43", iconBg: "#F59E0B", trend: "-3%", trendUp: false },
  { label: "Compliance", value: "94.2%", iconBg: "#10B981", trend: "+2.1%", trendUp: true },
] as const;

/* ────────────────────────── donut chart data ────────────────────────── */
const DONUT_SEGMENTS = [
  { label: "Treatment", pct: 42, color: COLORS.teal },
  { label: "Marketing", pct: 24, color: COLORS.indigo },
  { label: "Data", pct: 18, color: "#3B82F6" },
  { label: "Research", pct: 16, color: "#F59E0B" },
] as const;

/* ────────────────────────── activity feed ────────────────────────── */
const ACTIVITIES = [
  { text: "Dr. Mitchell captured HIPAA Treatment for Sarah M.", time: "2m" },
  { text: "Dynamics 365 sync: 12 records updated", time: "5m" },
  { text: "Dr. Chen captured GDPR Marketing for James R.", time: "12m" },
] as const;

/* ====================================================================== */

export const DashboardDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  /* ── Entire frame entrance ── */
  const enterProgress = spring({
    frame,
    fps,
    config: { damping: 200 },
  });
  const enterX = interpolate(enterProgress, [0, 1], [100, 0]);
  const enterOpacity = interpolate(enterProgress, [0, 1], [0, 1]);

  /* ── Metric cards stagger ── */
  const metricCards = METRICS.map((m, i) => {
    const delay = Math.round(0.6 * fps) + i * 10;
    const p = spring({
      frame: Math.max(0, frame - delay),
      fps,
      config: { damping: 14, stiffness: 100 },
    });
    const scale = interpolate(p, [0, 1], [0.7, 1]);
    const opacity = interpolate(p, [0, 1], [0, 1]);
    return { ...m, scale, opacity };
  });

  /* ── Donut chart arcs ── */
  const RADIUS = 54;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
  let cumulativeOffset = 0;
  const arcs = DONUT_SEGMENTS.map((seg, i) => {
    const dashLen = (seg.pct / 100) * CIRCUMFERENCE;
    const gap = CIRCUMFERENCE - dashLen;
    const offset = -cumulativeOffset;
    cumulativeOffset += dashLen;

    const drawDelay = Math.round(1.2 * fps) + i * 10;
    const drawProgress = interpolate(
      frame,
      [drawDelay, drawDelay + Math.round(0.8 * fps)],
      [0, 1],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
    );
    return { ...seg, dashLen, gap, offset, drawProgress };
  });

  /* ── Line chart path drawing ── */
  const lineDelay = Math.round(2.0 * fps);
  const LINE_PATH_LEN = 500;
  const lineDrawProgress = interpolate(
    frame,
    [lineDelay, lineDelay + Math.round(1.5 * fps)],
    [LINE_PATH_LEN, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const redLineDrawProgress = interpolate(
    frame,
    [lineDelay + 10, lineDelay + 10 + Math.round(1.5 * fps)],
    [LINE_PATH_LEN, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  /* ── Activity feed stagger ── */
  const activityItems = ACTIVITIES.map((a, i) => {
    const delay = Math.round(3.0 * fps) + i * 12;
    const p = spring({
      frame: Math.max(0, frame - delay),
      fps,
      config: { damping: 200 },
    });
    const opacity = interpolate(p, [0, 1], [0, 1]);
    const translateY = interpolate(p, [0, 1], [20, 0]);
    return { ...a, opacity, translateY };
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
                  backgroundColor: COLORS.slate900,
                  padding: 0,
                  minHeight: 860,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {/* ── Header bar ── */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "14px 24px",
                    borderBottom: `1px solid ${COLORS.slate700}`,
                  }}
                >
                  <span
                    style={{
                      fontSize: 18,
                      fontFamily: FONTS.serif,
                      color: COLORS.white,
                      fontWeight: "bold",
                    }}
                  >
                    Dashboard
                  </span>
                  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    {/* bell with dot */}
                    <div style={{ position: "relative" }}>
                      <svg width={20} height={20} viewBox="0 0 24 24" fill="none">
                        <path
                          d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"
                          stroke={COLORS.slate400}
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M13.73 21a2 2 0 0 1-3.46 0"
                          stroke={COLORS.slate400}
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <div
                        style={{
                          position: "absolute",
                          top: -2,
                          right: -2,
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          backgroundColor: COLORS.red,
                        }}
                      />
                    </div>
                    <span
                      style={{
                        fontSize: 14,
                        fontFamily: FONTS.sans,
                        color: COLORS.slate300,
                      }}
                    >
                      TAS Health
                    </span>
                    {/* avatar */}
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: "50%",
                        backgroundColor: COLORS.teal,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 13,
                        fontFamily: FONTS.sans,
                        fontWeight: 700,
                        color: COLORS.white,
                      }}
                    >
                      CJ
                    </div>
                  </div>
                </div>

                {/* ── Metric cards row ── */}
                <div
                  style={{
                    display: "flex",
                    gap: 16,
                    padding: "20px 24px 0",
                  }}
                >
                  {metricCards.map((m, i) => (
                    <div
                      key={i}
                      style={{
                        flex: 1,
                        backgroundColor: COLORS.slate800,
                        borderRadius: 12,
                        padding: "16px 18px",
                        opacity: m.opacity,
                        transform: `scale(${m.scale})`,
                        display: "flex",
                        flexDirection: "column",
                        gap: 8,
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div
                          style={{
                            width: 28,
                            height: 28,
                            borderRadius: 8,
                            backgroundColor: `${m.iconBg}22`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <div
                            style={{
                              width: 10,
                              height: 10,
                              borderRadius: "50%",
                              backgroundColor: m.iconBg,
                            }}
                          />
                        </div>
                        <span
                          style={{
                            fontSize: 12,
                            fontFamily: FONTS.sans,
                            color: COLORS.slate400,
                          }}
                        >
                          {m.label}
                        </span>
                      </div>
                      <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                        <span
                          style={{
                            fontSize: 28,
                            fontFamily: FONTS.sans,
                            fontWeight: 700,
                            color: COLORS.white,
                          }}
                        >
                          {m.value}
                        </span>
                        <span
                          style={{
                            fontSize: 12,
                            fontFamily: FONTS.sans,
                            fontWeight: 600,
                            color: m.trendUp ? "#10B981" : COLORS.red,
                            backgroundColor: m.trendUp ? "#10B98118" : `${COLORS.red}18`,
                            padding: "2px 8px",
                            borderRadius: 9999,
                          }}
                        >
                          {m.trend}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* ── Charts row: donut + line chart ── */}
                <div
                  style={{
                    display: "flex",
                    gap: 16,
                    padding: "16px 24px 0",
                  }}
                >
                  {/* Donut chart */}
                  <div
                    style={{
                      flex: 1,
                      backgroundColor: COLORS.slate800,
                      borderRadius: 12,
                      padding: 20,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        fontSize: 13,
                        fontFamily: FONTS.sans,
                        fontWeight: 600,
                        color: COLORS.slate300,
                        alignSelf: "flex-start",
                        marginBottom: 12,
                      }}
                    >
                      Consent Types
                    </span>
                    <div style={{ position: "relative", width: 140, height: 140 }}>
                      <svg
                        width={140}
                        height={140}
                        viewBox="0 0 140 140"
                        style={{ transform: "rotate(-90deg)" }}
                      >
                        {arcs.map((arc, i) => (
                          <circle
                            key={i}
                            cx={70}
                            cy={70}
                            r={RADIUS}
                            fill="none"
                            stroke={arc.color}
                            strokeWidth={16}
                            strokeDasharray={`${arc.dashLen * arc.drawProgress} ${CIRCUMFERENCE - arc.dashLen * arc.drawProgress}`}
                            strokeDashoffset={arc.offset}
                          />
                        ))}
                      </svg>
                      {/* Center text */}
                      <div
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: 140,
                          height: 140,
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <span
                          style={{
                            fontSize: 20,
                            fontFamily: FONTS.sans,
                            fontWeight: 700,
                            color: COLORS.white,
                          }}
                        >
                          2,847
                        </span>
                        <span
                          style={{
                            fontSize: 10,
                            fontFamily: FONTS.sans,
                            color: COLORS.slate400,
                          }}
                        >
                          Total
                        </span>
                      </div>
                    </div>
                    {/* Legend */}
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 12,
                        marginTop: 12,
                        justifyContent: "center",
                      }}
                    >
                      {DONUT_SEGMENTS.map((seg, i) => (
                        <div
                          key={i}
                          style={{ display: "flex", alignItems: "center", gap: 4 }}
                        >
                          <div
                            style={{
                              width: 8,
                              height: 8,
                              borderRadius: "50%",
                              backgroundColor: seg.color,
                            }}
                          />
                          <span
                            style={{
                              fontSize: 10,
                              fontFamily: FONTS.sans,
                              color: COLORS.slate400,
                            }}
                          >
                            {seg.label} {seg.pct}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Line chart */}
                  <div
                    style={{
                      flex: 2,
                      backgroundColor: COLORS.slate800,
                      borderRadius: 12,
                      padding: 20,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 13,
                        fontFamily: FONTS.sans,
                        fontWeight: 600,
                        color: COLORS.slate300,
                      }}
                    >
                      Consent Activity (30 days)
                    </span>
                    <svg
                      width="100%"
                      height={160}
                      viewBox="0 0 500 160"
                      preserveAspectRatio="none"
                      style={{ marginTop: 12 }}
                    >
                      {/* Grid lines */}
                      {[0, 40, 80, 120, 160].map((y) => (
                        <line
                          key={y}
                          x1={0}
                          y1={y}
                          x2={500}
                          y2={y}
                          stroke={COLORS.slate700}
                          strokeWidth={0.5}
                        />
                      ))}
                      {/* Teal line (consents going up) */}
                      <polyline
                        points="0,130 50,120 100,110 150,95 200,100 250,80 300,70 350,55 400,50 450,35 500,20"
                        fill="none"
                        stroke={COLORS.teal}
                        strokeWidth={3}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeDasharray={LINE_PATH_LEN}
                        strokeDashoffset={lineDrawProgress}
                      />
                      {/* Red line (revocations flat) */}
                      <polyline
                        points="0,145 50,142 100,148 150,144 200,146 250,143 300,147 350,145 400,144 450,146 500,143"
                        fill="none"
                        stroke={COLORS.red}
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeDasharray={LINE_PATH_LEN}
                        strokeDashoffset={redLineDrawProgress}
                        opacity={0.7}
                      />
                    </svg>
                    {/* Legend */}
                    <div
                      style={{
                        display: "flex",
                        gap: 20,
                        marginTop: 8,
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <div
                          style={{
                            width: 12,
                            height: 3,
                            borderRadius: 2,
                            backgroundColor: COLORS.teal,
                          }}
                        />
                        <span
                          style={{
                            fontSize: 11,
                            fontFamily: FONTS.sans,
                            color: COLORS.slate400,
                          }}
                        >
                          Consents
                        </span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <div
                          style={{
                            width: 12,
                            height: 3,
                            borderRadius: 2,
                            backgroundColor: COLORS.red,
                          }}
                        />
                        <span
                          style={{
                            fontSize: 11,
                            fontFamily: FONTS.sans,
                            color: COLORS.slate400,
                          }}
                        >
                          Revocations
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── Activity feed ── */}
                <div style={{ padding: "16px 24px 20px" }}>
                  <span
                    style={{
                      fontSize: 13,
                      fontFamily: FONTS.sans,
                      fontWeight: 600,
                      color: COLORS.slate300,
                      marginBottom: 10,
                      display: "block",
                    }}
                  >
                    Recent Activity
                  </span>
                  <div
                    style={{
                      backgroundColor: COLORS.slate800,
                      borderRadius: 12,
                      overflow: "hidden",
                    }}
                  >
                    {activityItems.map((item, i) => (
                      <div
                        key={i}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "12px 18px",
                          opacity: item.opacity,
                          transform: `translateY(${item.translateY}px)`,
                          borderBottom:
                            i < activityItems.length - 1
                              ? `1px solid ${COLORS.slate700}`
                              : "none",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div
                            style={{
                              width: 8,
                              height: 8,
                              borderRadius: "50%",
                              backgroundColor: COLORS.teal,
                            }}
                          />
                          <span
                            style={{
                              fontSize: 13,
                              fontFamily: FONTS.sans,
                              color: COLORS.slate300,
                            }}
                          >
                            {item.text}
                          </span>
                        </div>
                        <span
                          style={{
                            fontSize: 12,
                            fontFamily: FONTS.sans,
                            color: COLORS.slate500,
                            flexShrink: 0,
                            marginLeft: 12,
                          }}
                        >
                          {item.time}
                        </span>
                      </div>
                    ))}
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
