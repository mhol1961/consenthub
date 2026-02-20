import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { GradientBackground } from "../components/GradientBackground";
import { AnimatedText } from "../components/AnimatedText";
import { COLORS } from "../lib/colors";
import { FONTS } from "../lib/fonts";
import {
  FileSignature,
  ArrowLeftRight,
  ShieldCheck,
  Smartphone,
  LayoutDashboard,
  Plug,
} from "lucide-react";

/* ────────────────────────── feature data ────────────────────────── */
interface Feature {
  title: string;
  description: string;
  accentColor: string;
  Icon: React.FC<{ size?: number; color?: string; strokeWidth?: number }>;
}

const FEATURES: Feature[] = [
  {
    title: "Consent Engine",
    description: "Capture legally-binding consent with e-signatures and full audit trail",
    accentColor: COLORS.teal,
    Icon: FileSignature,
  },
  {
    title: "Dynamics 365 Integration",
    description: "Bi-directional real-time sync with Microsoft Dynamics CRM",
    accentColor: "#3B82F6",
    Icon: ArrowLeftRight,
  },
  {
    title: "HIPAA Compliance",
    description: "Built-in regulatory compliance with immutable audit logs",
    accentColor: "#10B981",
    Icon: ShieldCheck,
  },
  {
    title: "Patient Portal",
    description: "Self-service preference management with magic link access",
    accentColor: "#8B5CF6",
    Icon: Smartphone,
  },
  {
    title: "Admin Dashboard",
    description: "Real-time analytics, compliance metrics, and team management",
    accentColor: "#F59E0B",
    Icon: LayoutDashboard,
  },
  {
    title: "Full API",
    description: "RESTful API with webhooks for custom integrations",
    accentColor: COLORS.indigo,
    Icon: Plug,
  },
];

/* ====================================================================== */

export const FeatureGrid: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  /* ── Card entrance stagger ── */
  const cardStates = FEATURES.map((feat, i) => {
    const delay = Math.round(0.5 * fps) + i * 6;
    const p = spring({
      frame: Math.max(0, frame - delay),
      fps,
      config: { damping: 14, stiffness: 80 },
    });
    const scale = interpolate(p, [0, 1], [0.8, 1]);
    const opacity = interpolate(p, [0, 1], [0, 1]);
    const translateY = interpolate(p, [0, 1], [30, 0]);
    return { ...feat, scale, opacity, translateY };
  });

  return (
    <AbsoluteFill>
      <GradientBackground>
        <AbsoluteFill
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "60px 100px",
          }}
        >
          {/* ── Header ── */}
          <AnimatedText text="Everything You Need" fontSize={56} fontFamily="serif" />

          {/* ── 3x2 Grid ── */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 24,
              marginTop: 48,
              width: "100%",
              justifyContent: "center",
            }}
          >
            {cardStates.map((card, i) => {
              const IconComponent = card.Icon;
              return (
                <div
                  key={i}
                  style={{
                    width: "calc(33.333% - 16px)",
                    backgroundColor: COLORS.slate800,
                    borderRadius: 16,
                    overflow: "hidden",
                    opacity: card.opacity,
                    transform: `scale(${card.scale}) translateY(${card.translateY}px)`,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {/* Colored top accent bar */}
                  <div
                    style={{
                      height: 4,
                      backgroundColor: card.accentColor,
                      width: "100%",
                    }}
                  />
                  <div
                    style={{
                      padding: "28px 24px",
                      display: "flex",
                      flexDirection: "column",
                      gap: 14,
                    }}
                  >
                    {/* Icon circle */}
                    <div
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 12,
                        backgroundColor: `${card.accentColor}18`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <IconComponent
                        size={24}
                        color={card.accentColor}
                        strokeWidth={2}
                      />
                    </div>
                    {/* Title */}
                    <span
                      style={{
                        fontSize: 20,
                        fontFamily: FONTS.serif,
                        fontWeight: "bold",
                        color: COLORS.white,
                      }}
                    >
                      {card.title}
                    </span>
                    {/* Description */}
                    <span
                      style={{
                        fontSize: 14,
                        fontFamily: FONTS.sans,
                        color: COLORS.slate400,
                        lineHeight: 1.5,
                      }}
                    >
                      {card.description}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </AbsoluteFill>
      </GradientBackground>
    </AbsoluteFill>
  );
};
