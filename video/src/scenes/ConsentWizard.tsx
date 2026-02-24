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

/* ────────────────────────── screenshot steps ────────────────────────── */
const STEPS = [
  { file: "consent-signature-step1.png", label: "Select Template" },
  { file: "consent-signature-step2.png", label: "Patient Details" },
  { file: "consent-signature-step3.png", label: "Review Terms" },
  { file: "consent-signature-step4.png", label: "Capture Signature" },
  { file: "consent-signature-step5.png", label: "Confirmation" },
  { file: "consent-signature-step6.png", label: "Complete" },
] as const;

/* ====================================================================== */

export const ConsentWizard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  /* ── Calculate step timing based on scene duration ── */
  // Leave 0.5s entrance buffer, divide remaining time among 6 steps
  const entranceBuffer = Math.round(0.5 * fps);
  const usableFrames = durationInFrames - entranceBuffer;
  const framesPerStep = Math.floor(usableFrames / STEPS.length);
  const fadeFrames = Math.round(0.4 * fps); // 0.4s cross-fade between steps

  /* ── Current step index ── */
  const rawStep = Math.floor(
    Math.max(0, frame - entranceBuffer) / framesPerStep,
  );
  const currentStep = Math.min(rawStep, STEPS.length - 1);

  /* ── Step indicator progress (which dots are filled) ── */
  // Simplified to 3 indicators: Steps 1-2 = phase 1, Steps 3-4 = phase 2, Steps 5-6 = phase 3
  const phase = currentStep < 2 ? 1 : currentStep < 4 ? 2 : 3;

  /* ── Per-screenshot opacity (cross-fade) ── */
  const stepOpacities = STEPS.map((_, i) => {
    const stepStart = entranceBuffer + i * framesPerStep;
    const stepEnd = stepStart + framesPerStep;

    // Fade in
    const fadeIn = interpolate(
      frame,
      [stepStart, stepStart + fadeFrames],
      [0, 1],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
    );

    // Fade out (not for last step)
    const fadeOut =
      i < STEPS.length - 1
        ? interpolate(
            frame,
            [stepEnd - fadeFrames, stepEnd],
            [1, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          )
        : 1;

    return Math.min(fadeIn, fadeOut);
  });

  /* ── Ken Burns per step (subtle zoom) ── */
  const stepScales = STEPS.map((_, i) => {
    const stepStart = entranceBuffer + i * framesPerStep;
    return interpolate(
      frame,
      [stepStart, stepStart + framesPerStep],
      [1.0, 1.06],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
    );
  });

  /* ── Entrance animation ── */
  const enterProgress = spring({
    frame,
    fps,
    config: { damping: 200 },
  });
  const enterScale = interpolate(enterProgress, [0, 1], [0.92, 1]);
  const enterOpacity = interpolate(enterProgress, [0, 1], [0, 1]);

  /* ── Step label badge ── */
  const labelProgress = spring({
    frame: Math.max(0, frame - entranceBuffer),
    fps,
    config: { damping: 200 },
  });
  const labelOpacity = interpolate(labelProgress, [0, 1], [0, 1]);

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
          <div
            style={{
              width: "100%",
              height: "100%",
              transform: `scale(${enterScale})`,
              opacity: enterOpacity,
            }}
          >
            <BrowserFrame url="app.consenthub.io/consent/capture">
              <div
                style={{
                  position: "relative",
                  overflow: "hidden",
                  minHeight: 700,
                  backgroundColor: COLORS.slate900,
                }}
              >
                {/* ── Step indicator dots (top) ── */}
                <div
                  style={{
                    position: "absolute",
                    top: 16,
                    left: "50%",
                    transform: "translateX(-50%)",
                    zIndex: 20,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    backgroundColor: `${COLORS.navy}DD`,
                    padding: "8px 20px",
                    borderRadius: 9999,
                    backdropFilter: "blur(8px)",
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
                            s <= phase ? COLORS.teal : COLORS.slate700,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 13,
                          fontFamily: FONTS.sans,
                          fontWeight: 700,
                          color:
                            s <= phase ? COLORS.white : COLORS.slate500,
                        }}
                      >
                        {s}
                      </div>
                      {s < 3 && (
                        <div
                          style={{
                            width: 40,
                            height: 2,
                            backgroundColor:
                              s < phase ? COLORS.teal : COLORS.slate700,
                            borderRadius: 1,
                          }}
                        />
                      )}
                    </React.Fragment>
                  ))}
                </div>

                {/* ── Screenshots stack (cross-fading) ── */}
                {STEPS.map((step, i) => (
                  <div
                    key={i}
                    style={{
                      position: i === 0 ? "relative" : "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: i === 0 ? "auto" : "100%",
                      opacity: stepOpacities[i],
                      zIndex: currentStep === i ? 5 : 1,
                    }}
                  >
                    <Img
                      src={staticFile(`screenshots/${step.file}`)}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        transform: `scale(${stepScales[i]})`,
                        transformOrigin: "center top",
                      }}
                    />
                  </div>
                ))}

                {/* ── Current step label (bottom) ── */}
                <div
                  style={{
                    position: "absolute",
                    bottom: 20,
                    left: "50%",
                    transform: "translateX(-50%)",
                    zIndex: 20,
                    opacity: labelOpacity,
                  }}
                >
                  <div
                    style={{
                      backgroundColor: `${COLORS.teal}DD`,
                      color: COLORS.white,
                      fontSize: 16,
                      fontFamily: FONTS.sans,
                      fontWeight: 700,
                      padding: "8px 24px",
                      borderRadius: 9999,
                      whiteSpace: "nowrap",
                      boxShadow: `0 4px 20px ${COLORS.teal}44`,
                    }}
                  >
                    Step {currentStep + 1}: {STEPS[currentStep].label}
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
