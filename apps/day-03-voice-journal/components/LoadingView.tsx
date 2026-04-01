"use client";

import { useState, useEffect } from "react";

export function LoadingView() {
  const [phase, setPhase] = useState<1 | 2>(1);

  useEffect(() => {
    const t = setTimeout(() => setPhase(2), 2000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="flex flex-col items-center gap-6 py-8">
      {/* Spinner */}
      <div
        className="relative flex items-center justify-center"
        style={{ width: 64, height: 64 }}
      >
        <div
          className="absolute inset-0 rounded-full"
          style={{
            border: "1px solid rgba(55,138,221,0.15)",
            borderTopColor: "#378ADD",
            animation: "spin 1.2s linear infinite",
          }}
        />
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: "#378ADD",
            animation: "pulse-dot 1.5s ease-in-out infinite",
          }}
        />
      </div>

      {/* Labels */}
      <div className="flex flex-col items-center gap-1">
        <span
          className="text-sm tracking-widest uppercase"
          style={{ color: "#85B7EB" }}
        >
          {phase === 1 ? "Transcribing" : "Analysing"}
        </span>
        <span className="text-xs" style={{ color: "rgba(55,138,221,0.55)" }}>
          {phase === 1
            ? "Sending to Whisper..."
            : "Claude is reading your thoughts..."}
        </span>
      </div>
    </div>
  );
}
