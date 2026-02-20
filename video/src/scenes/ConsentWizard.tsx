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

/* ────────────────────────── template data ────────────────────────── */
const TEMPLATES = [
  { name: "HIPAA Treatment", badgeColor: "#3B82F6", badgeBg: "#3B82F622" },
  { name: "GDPR Marketing", badgeColor: "#A855F7", badgeBg: "#A855F722" },
  { name: "TCPA Telemarketing", badgeColor: "#F59E0B", badgeBg: "#F59E0B22" },
] as const;

const CONFIRMATION_LINES = [
  "Recorded in database",
  "PDF generated",
  "Dynamics 365 synced",
] as const;

/* ────────────────────────── signature path ────────────────────────── */
const SIGNATURE_PATH =
  "M10,45 C20,20 35,15 50,30 S70,50 85,25 S110,10 130,35 S155,50 175,20 L190,25";

/* ====================================================================== */

export const ConsentWizard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const step1End = 3 * fps;
  const step2End = 7 * fps;

  /* ── Step indicator ── */
  const currentStep = frame < step1End ? 1 : frame < step2End ? 2 : 3;

  /* ── Step 1: Template selection ── */
  const templateCards = TEMPLATES.map((t, i) => {
    const delay = Math.round(0.3 * fps) + i * 10;
    const p = spring({
      frame: Math.max(0, frame - delay),
      fps,
      config: { damping: 200 },
    });
    const opacity = interpolate(p, [0, 1], [0, 1]);
    const translateX = interpolate(p, [0, 1], [40, 0]);

    // Highlight first card after 1.5s
    const highlightDelay = Math.round(1.5 * fps);
    const isHighlighted = i === 0 && frame >= highlightDelay && frame < step1End;

    return { ...t, opacity, translateX, isHighlighted };
  });

  /* ── Step 2: Signature drawing ── */
  const sigDrawStart = step1End + Math.round(0.5 * fps);
  const sigDrawEnd = sigDrawStart + Math.round(2 * fps);
  const SIG_PATH_LEN = 300;
  const sigProgress = interpolate(
    frame,
    [sigDrawStart, sigDrawEnd],
    [SIG_PATH_LEN, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  /* ── Step 3: Success ── */
  const step3Start = step2End;
  const circleProgress = spring({
    frame: Math.max(0, frame - step3Start),
    fps,
    config: { damping: 10 },
  });
  const circleScale = interpolate(circleProgress, [0, 1], [0, 1]);

  // Checkmark draws after circle
  const checkDelay = step3Start + Math.round(0.4 * fps);
  const CHECK_LEN = 60;
  const checkProgress = interpolate(
    frame,
    [checkDelay, checkDelay + Math.round(0.5 * fps)],
    [CHECK_LEN, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // Confirmation lines stagger
  const confirmItems = CONFIRMATION_LINES.map((text, i) => {
    const delay = step3Start + Math.round((0.8 + i * 0.3) * fps);
    const p = spring({
      frame: Math.max(0, frame - delay),
      fps,
      config: { damping: 200 },
    });
    const opacity = interpolate(p, [0, 1], [0, 1]);
    const translateY = interpolate(p, [0, 1], [15, 0]);
    return { text, opacity, translateY };
  });

  return (
    <AbsoluteFill>
      <GradientBackground>
        <AbsoluteFill
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "40px 120px",
          }}
        >
          <div style={{ width: "100%", height: "100%" }}>
            <BrowserFrame url="app.consenthub.io/consent/capture">
              <div
                style={{
                  backgroundColor: COLORS.slate900,
                  minHeight: 700,
                  padding: "32px 40px",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {/* ── Step indicator dots ── */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 28,
                    alignSelf: "center",
                  }}
                >
                  {[1, 2, 3].map((s) => (
                    <React.Fragment key={s}>
                      <div
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: "50%",
                          backgroundColor:
                            s <= currentStep ? COLORS.teal : COLORS.slate700,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 13,
                          fontFamily: FONTS.sans,
                          fontWeight: 700,
                          color:
                            s <= currentStep ? COLORS.white : COLORS.slate500,
                        }}
                      >
                        {s}
                      </div>
                      {s < 3 && (
                        <div
                          style={{
                            width: 60,
                            height: 2,
                            backgroundColor:
                              s < currentStep ? COLORS.teal : COLORS.slate700,
                            borderRadius: 1,
                          }}
                        />
                      )}
                    </React.Fragment>
                  ))}
                </div>

                {/* ════════════════ STEP 1 ════════════════ */}
                {currentStep === 1 && (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      flex: 1,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 28,
                        fontFamily: FONTS.serif,
                        fontWeight: "bold",
                        color: COLORS.white,
                        marginBottom: 24,
                      }}
                    >
                      Select Template
                    </span>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 16,
                      }}
                    >
                      {templateCards.map((t, i) => (
                        <div
                          key={i}
                          style={{
                            backgroundColor: COLORS.slate800,
                            borderRadius: 12,
                            padding: "20px 24px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            opacity: t.opacity,
                            transform: `translateX(${t.translateX}px)`,
                            border: t.isHighlighted
                              ? `2px solid ${COLORS.teal}`
                              : `1px solid ${COLORS.slate700}`,
                            boxShadow: t.isHighlighted
                              ? `0 0 20px ${COLORS.teal}33`
                              : "none",
                          }}
                        >
                          <span
                            style={{
                              fontSize: 18,
                              fontFamily: FONTS.sans,
                              fontWeight: 600,
                              color: COLORS.white,
                            }}
                          >
                            {t.name}
                          </span>
                          <span
                            style={{
                              fontSize: 13,
                              fontFamily: FONTS.sans,
                              fontWeight: 600,
                              color: t.badgeColor,
                              backgroundColor: t.badgeBg,
                              padding: "4px 14px",
                              borderRadius: 9999,
                            }}
                          >
                            {t.name.split(" ")[0]}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ════════════════ STEP 2 ════════════════ */}
                {currentStep === 2 && (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      flex: 1,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 28,
                        fontFamily: FONTS.serif,
                        fontWeight: "bold",
                        color: COLORS.white,
                        marginBottom: 24,
                      }}
                    >
                      Capture Signature
                    </span>
                    {/* Signature pad */}
                    <div
                      style={{
                        width: 500,
                        height: 200,
                        backgroundColor: COLORS.slate800,
                        borderRadius: 16,
                        border: `1px dashed ${COLORS.slate600}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        position: "relative",
                      }}
                    >
                      <svg
                        width={400}
                        height={80}
                        viewBox="0 0 200 60"
                        fill="none"
                      >
                        <path
                          d={SIGNATURE_PATH}
                          stroke={COLORS.tealLight}
                          strokeWidth={2.5}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          fill="none"
                          strokeDasharray={SIG_PATH_LEN}
                          strokeDashoffset={sigProgress}
                        />
                      </svg>
                      {/* "Sign here" label */}
                      <span
                        style={{
                          position: "absolute",
                          bottom: 12,
                          right: 16,
                          fontSize: 12,
                          fontFamily: FONTS.sans,
                          color: COLORS.slate500,
                        }}
                      >
                        Sign above
                      </span>
                    </div>
                  </div>
                )}

                {/* ════════════════ STEP 3 ════════════════ */}
                {currentStep === 3 && (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      flex: 1,
                      gap: 24,
                    }}
                  >
                    {/* Green circle + checkmark */}
                    <div
                      style={{
                        width: 80,
                        height: 80,
                        borderRadius: "50%",
                        backgroundColor: "#10B981",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transform: `scale(${circleScale})`,
                      }}
                    >
                      <svg width={40} height={40} viewBox="0 0 40 40" fill="none">
                        <polyline
                          points="10,20 17,28 30,13"
                          stroke={COLORS.white}
                          strokeWidth={4}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          fill="none"
                          strokeDasharray={CHECK_LEN}
                          strokeDashoffset={checkProgress}
                        />
                      </svg>
                    </div>

                    <span
                      style={{
                        fontSize: 24,
                        fontFamily: FONTS.serif,
                        fontWeight: "bold",
                        color: COLORS.white,
                      }}
                    >
                      Consent Captured Successfully
                    </span>

                    {/* Confirmation lines */}
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 14,
                      }}
                    >
                      {confirmItems.map((item, i) => (
                        <div
                          key={i}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                            opacity: item.opacity,
                            transform: `translateY(${item.translateY}px)`,
                          }}
                        >
                          <svg
                            width={20}
                            height={20}
                            viewBox="0 0 20 20"
                            fill="none"
                          >
                            <circle
                              cx={10}
                              cy={10}
                              r={8}
                              fill="#10B98122"
                            />
                            <polyline
                              points="6,10 9,13 14,7"
                              stroke="#10B981"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              fill="none"
                            />
                          </svg>
                          <span
                            style={{
                              fontSize: 16,
                              fontFamily: FONTS.sans,
                              color: COLORS.slate300,
                            }}
                          >
                            {item.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </BrowserFrame>
          </div>
        </AbsoluteFill>
      </GradientBackground>
    </AbsoluteFill>
  );
};
