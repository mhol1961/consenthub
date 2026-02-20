import React from "react";
import { COLORS } from "../lib/colors";
import { FONTS } from "../lib/fonts";

interface BrowserFrameProps {
  url: string;
  children: React.ReactNode;
}

export const BrowserFrame: React.FC<BrowserFrameProps> = ({ url, children }) => {
  return (
    <div
      style={{
        borderRadius: 16,
        border: `1px solid ${COLORS.slate700}`,
        overflow: "hidden",
        boxShadow: `0 0 60px ${COLORS.teal}33, 0 25px 50px rgba(0, 0, 0, 0.4)`,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Chrome bar */}
      <div
        style={{
          backgroundColor: COLORS.slate800,
          padding: "12px 16px",
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        {/* Traffic lights */}
        <div style={{ display: "flex", gap: 8 }}>
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              backgroundColor: "#EF4444",
            }}
          />
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              backgroundColor: "#F59E0B",
            }}
          />
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              backgroundColor: "#22C55E",
            }}
          />
        </div>

        {/* URL bar */}
        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              backgroundColor: COLORS.slate900,
              borderRadius: 9999,
              padding: "6px 24px",
              display: "inline-flex",
              alignItems: "center",
            }}
          >
            <span
              style={{
                color: COLORS.slate400,
                fontSize: 13,
                fontFamily: FONTS.sans,
                fontWeight: 400,
              }}
            >
              {url}
            </span>
          </div>
        </div>

        {/* Spacer to balance traffic lights */}
        <div style={{ width: 56 }} />
      </div>

      {/* Content area */}
      <div
        style={{
          backgroundColor: COLORS.slate900,
          flex: 1,
          overflow: "hidden",
        }}
      >
        {children}
      </div>
    </div>
  );
};
