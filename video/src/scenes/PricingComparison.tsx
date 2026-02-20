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

/* ────────────────────────── tier data ────────────────────────── */
interface Tier {
  name: string;
  price: number;
  period: string;
  featured: boolean;
  features: string[];
  borderColor: string;
}

const TIERS: Tier[] = [
  {
    name: "Starter",
    price: 600,
    period: "/month",
    featured: false,
    borderColor: COLORS.slate700,
    features: [
      "Up to 500 patients",
      "2 consent templates",
      "Basic audit log",
      "Email support",
      "Dynamics 365 sync",
    ],
  },
  {
    name: "Professional",
    price: 1200,
    period: "/month",
    featured: true,
    borderColor: COLORS.teal,
    features: [
      "Up to 5,000 patients",
      "Unlimited templates",
      "Full audit trail + SHA-256",
      "Patient self-service portal",
      "Priority support",
      "Custom branding",
      "Advanced reporting",
    ],
  },
  {
    name: "Enterprise",
    price: 2000,
    period: "/month",
    featured: false,
    borderColor: COLORS.slate700,
    features: [
      "Unlimited patients",
      "Unlimited templates",
      "Full audit + compliance reports",
      "Dedicated account manager",
      "Custom integrations",
      "SLA guarantee",
      "On-premise option",
    ],
  },
];

/* ====================================================================== */

export const PricingComparison: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  /* ── Card entrance stagger ── */
  const cardStates = TIERS.map((tier, i) => {
    const delay = Math.round(0.6 * fps) + i * 8;
    const p = spring({
      frame: Math.max(0, frame - delay),
      fps,
      config: { damping: 14, stiffness: 80 },
    });
    const scale = interpolate(p, [0, 1], [0.85, tier.featured ? 1.05 : 1]);
    const opacity = interpolate(p, [0, 1], [0, 1]);
    const translateY = interpolate(p, [0, 1], [40, 0]);

    // Price counting animation
    const priceDelay = delay + 10;
    const countedPrice = Math.round(
      interpolate(
        frame,
        [priceDelay, priceDelay + fps],
        [0, tier.price],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
      ),
    );

    return { ...tier, scale, opacity, translateY, countedPrice };
  });

  /* ── Bottom badge ── */
  const badgeDelay = Math.round(2.0 * fps);
  const badgeProgress = spring({
    frame: Math.max(0, frame - badgeDelay),
    fps,
    config: { damping: 200 },
  });
  const badgeOpacity = interpolate(badgeProgress, [0, 1], [0, 1]);
  const badgeY = interpolate(badgeProgress, [0, 1], [20, 0]);

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
          <AnimatedText
            text="Simple, Transparent Pricing"
            fontSize={56}
            fontFamily="serif"
          />
          <div style={{ height: 12 }} />
          <AnimatedText
            text="No per-user fees. No hidden costs."
            fontSize={24}
            fontFamily="sans"
            fontWeight={400}
            color={COLORS.slate400}
            delay={Math.round(0.3 * fps)}
          />

          {/* ── Cards row ── */}
          <div
            style={{
              display: "flex",
              gap: 28,
              marginTop: 48,
              width: "100%",
              justifyContent: "center",
            }}
          >
            {cardStates.map((tier, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  maxWidth: 380,
                  backgroundColor: COLORS.slate800,
                  borderRadius: 24,
                  padding: 32,
                  border: `2px solid ${tier.borderColor}`,
                  opacity: tier.opacity,
                  transform: `scale(${tier.scale}) translateY(${tier.translateY}px)`,
                  display: "flex",
                  flexDirection: "column",
                  position: "relative",
                  boxShadow: tier.featured
                    ? `0 0 40px ${COLORS.teal}22`
                    : "none",
                }}
              >
                {/* "Most Popular" badge */}
                {tier.featured && (
                  <div
                    style={{
                      position: "absolute",
                      top: -14,
                      left: "50%",
                      transform: "translateX(-50%)",
                      backgroundColor: COLORS.teal,
                      color: COLORS.white,
                      fontSize: 12,
                      fontFamily: FONTS.sans,
                      fontWeight: 700,
                      padding: "5px 18px",
                      borderRadius: 9999,
                      whiteSpace: "nowrap",
                    }}
                  >
                    Most Popular
                  </div>
                )}

                {/* Tier name */}
                <span
                  style={{
                    fontSize: 22,
                    fontFamily: FONTS.serif,
                    color: COLORS.white,
                    fontWeight: "bold",
                    marginBottom: 16,
                  }}
                >
                  {tier.name}
                </span>

                {/* Price */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: 4,
                    marginBottom: 24,
                  }}
                >
                  <span
                    style={{
                      fontSize: 56,
                      fontFamily: FONTS.sans,
                      fontWeight: 700,
                      color: COLORS.white,
                      lineHeight: 1,
                    }}
                  >
                    ${tier.countedPrice.toLocaleString()}
                  </span>
                  <span
                    style={{
                      fontSize: 16,
                      fontFamily: FONTS.sans,
                      color: COLORS.slate400,
                    }}
                  >
                    {tier.period}
                  </span>
                </div>

                {/* Divider */}
                <div
                  style={{
                    height: 1,
                    backgroundColor: COLORS.slate700,
                    marginBottom: 20,
                  }}
                />

                {/* Features */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                  }}
                >
                  {tier.features.map((feat, fi) => (
                    <div
                      key={fi}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                      }}
                    >
                      {/* Teal check */}
                      <svg
                        width={16}
                        height={16}
                        viewBox="0 0 16 16"
                        fill="none"
                        style={{ flexShrink: 0 }}
                      >
                        <polyline
                          points="3,8 6.5,11.5 13,5"
                          stroke={COLORS.teal}
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          fill="none"
                        />
                      </svg>
                      <span
                        style={{
                          fontSize: 14,
                          fontFamily: FONTS.sans,
                          color: COLORS.slate300,
                        }}
                      >
                        {feat}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* ── Bottom badge ── */}
          <div
            style={{
              marginTop: 40,
              opacity: badgeOpacity,
              transform: `translateY(${badgeY}px)`,
              backgroundColor: `${COLORS.teal}18`,
              border: `1px solid ${COLORS.teal}44`,
              padding: "10px 28px",
              borderRadius: 9999,
            }}
          >
            <span
              style={{
                fontSize: 16,
                fontFamily: FONTS.sans,
                fontWeight: 600,
                color: COLORS.tealLight,
              }}
            >
              60-80% less than enterprise alternatives
            </span>
          </div>
        </AbsoluteFill>
      </GradientBackground>
    </AbsoluteFill>
  );
};
