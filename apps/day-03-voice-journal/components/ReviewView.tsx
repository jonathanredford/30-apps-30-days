"use client";

import type { AnalysisResult } from "@/lib/types";

const CARD_STYLE: React.CSSProperties = {
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(55,138,221,0.15)",
  borderRadius: 12,
  padding: 16,
};

const LABEL_STYLE: React.CSSProperties = {
  fontSize: 10,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  color: "rgba(133,183,235,0.55)",
  marginBottom: 10,
};

interface Props {
  transcript: string;
  result: AnalysisResult;
  onReset: () => void;
}

export function ReviewView({ transcript, result, onReset }: Props) {
  return (
    <div className="w-full flex flex-col gap-4" style={{ maxWidth: 560 }}>
      <div className="grid grid-cols-2 gap-4">
        {/* Left card — transcript */}
        <div style={CARD_STYLE}>
          <p style={LABEL_STYLE}>Transcript</p>
          <p
            className="text-sm leading-relaxed"
            style={{ color: "rgba(133,183,235,0.8)" }}
          >
            {transcript}
          </p>
        </div>

        {/* Right card — themes + action items */}
        <div style={CARD_STYLE}>
          <p style={LABEL_STYLE}>Themes</p>
          <div className="flex flex-wrap gap-2 mb-5">
            {result.themes.map((theme, i) => (
              <span
                key={i}
                style={{
                  background: "rgba(55,138,221,0.12)",
                  border: "1px solid rgba(55,138,221,0.22)",
                  borderRadius: 999,
                  padding: "2px 10px",
                  fontSize: 12,
                  color: "#85B7EB",
                }}
              >
                {theme}
              </span>
            ))}
          </div>

          <p style={LABEL_STYLE}>Action items</p>
          {result.actionItems.length === 0 ? (
            <p className="text-xs" style={{ color: "rgba(133,183,235,0.4)" }}>
              None noted
            </p>
          ) : (
            <ul className="flex flex-col gap-2">
              {result.actionItems.map((item, i) => (
                <li
                  key={i}
                  className="text-sm flex gap-2"
                  style={{ color: "rgba(133,183,235,0.8)" }}
                >
                  <span style={{ color: "#378ADD", flexShrink: 0 }}>·</span>
                  {item}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Record another */}
      <button
        onClick={onReset}
        className="w-full py-2.5 rounded-lg text-sm transition-colors"
        style={{
          border: "1px solid #185FA5",
          color: "#85B7EB",
          background: "transparent",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.background = "rgba(24,95,165,0.12)")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.background = "transparent")
        }
      >
        Record another
      </button>
    </div>
  );
}
