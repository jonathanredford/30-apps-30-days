"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import type { RecordingState } from "@/lib/types";

interface Props {
  recordingState: RecordingState;
  onRecordingStart: () => void;
  onAnalyse: (blob: Blob) => void;
  onClear: () => void;
}

// Heights for 13 waveform bars — bell-curve shape
const BAR_HEIGHTS = [8, 11, 16, 22, 28, 32, 28, 32, 28, 22, 16, 11, 8];

const ORB_BLUE =
  "radial-gradient(circle at 40% 35%, #378ADD 0%, #185FA5 45%, #04101f 100%)";
const ORB_RED =
  "radial-gradient(circle at 40% 35%, #E24B4A 0%, #A32D2D 50%, #1a0505 100%)";

function MicIcon({ color }: { color: string }) {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="9" y="2" width="6" height="11" rx="3" fill={color} />
      <path
        d="M5 10a7 7 0 0014 0"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line
        x1="12" y1="17" x2="12" y2="21"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line
        x1="9" y1="21" x2="15" y2="21"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function formatTime(s: number) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

export function RecordView({
  onRecordingStart,
  onAnalyse,
  onClear,
}: Props) {
  const [isCapturing, setIsCapturing] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [micError, setMicError] = useState<string | null>(null);
  const [elapsed, setElapsed] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }, []);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      clearTimer();
      stopStream();
    };
  }, [clearTimer, stopStream]);

  const startRecording = async () => {
    setMicError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mimeType = MediaRecorder.isTypeSupported("audio/webm")
        ? "audio/webm"
        : "";
      const mr = new MediaRecorder(stream, mimeType ? { mimeType } : {});
      mediaRecorderRef.current = mr;
      chunksRef.current = [];

      mr.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, {
          type: mimeType || "audio/webm",
        });
        setAudioBlob(blob);
        setIsCapturing(false);
        clearTimer();
        stopStream();
      };

      mr.start(100);
      setIsCapturing(true);
      setElapsed(0);
      timerRef.current = setInterval(
        () => setElapsed((e) => e + 1),
        1000
      );
      onRecordingStart();
    } catch (err) {
      if (err instanceof Error && err.name === "NotAllowedError") {
        setMicError(
          "Microphone access denied. Allow mic access in your browser and try again."
        );
      } else {
        setMicError("Could not access microphone.");
      }
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
  };

  const handleOrbClick = () => {
    if (isCapturing) {
      stopRecording();
    } else if (!audioBlob) {
      startRecording();
    }
  };

  const handleClear = () => {
    if (isCapturing) {
      mediaRecorderRef.current?.stop();
    }
    clearTimer();
    stopStream();
    setIsCapturing(false);
    setAudioBlob(null);
    setElapsed(0);
    setMicError(null);
    onClear();
  };

  const handleAnalyse = () => {
    if (audioBlob) onAnalyse(audioBlob);
  };

  const [isOrbHovered, setIsOrbHovered] = useState(false);

  const canAnalyse = !!audioBlob && !isCapturing;
  const statusLabel = micError
    ? "Error"
    : isCapturing
    ? "Recording"
    : audioBlob
    ? "Ready to analyse"
    : "Tap to record";

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Rings + Orb */}
      <div
        className="relative flex items-center justify-center"
        style={{ width: 160, height: 160 }}
      >
        {/* Outermost ring — 160px */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            border: "1px solid rgba(24,95,165,0.35)",
            ...(isCapturing
              ? {
                  animation: "pulse-ring 2s ease-in-out infinite",
                  animationDelay: "0s",
                }
              : {}),
          }}
        />
        {/* Middle ring — 124px */}
        <div
          className="absolute rounded-full"
          style={{
            width: 124,
            height: 124,
            border: "1px solid rgba(24,95,165,0.45)",
            ...(isCapturing
              ? {
                  animation: "pulse-ring 2s ease-in-out infinite",
                  animationDelay: "0.4s",
                }
              : {}),
          }}
        />
        {/* Orb — 88px */}
        <button
          onClick={handleOrbClick}
          disabled={!!audioBlob && !isCapturing}
          aria-label={isCapturing ? "Stop recording" : "Start recording"}
          className="relative rounded-full flex items-center justify-center transition-all duration-300"
          onMouseEnter={() => !canAnalyse && setIsOrbHovered(true)}
          onMouseLeave={() => setIsOrbHovered(false)}
          style={{
            width: 88,
            height: 88,
            background: isCapturing ? ORB_RED : ORB_BLUE,
            border: `1px solid ${isCapturing ? "#A32D2D" : "#185FA5"}`,
            cursor: audioBlob && !isCapturing ? "default" : "pointer",
            transform: isOrbHovered ? "scale(1.07)" : "scale(1)",
            boxShadow: isOrbHovered
              ? `0 0 22px ${isCapturing ? "rgba(226,75,74,0.45)" : "rgba(55,138,221,0.45)"}`
              : "none",
          }}
        >
          {micError ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M18 6L6 18M6 6l12 12"
                stroke="#F09595"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          ) : (
            <MicIcon color={isCapturing ? "#F09595" : "#85B7EB"} />
          )}
        </button>
      </div>

      {/* Waveform or error message */}
      {micError ? (
        <p
          className="text-sm text-center"
          style={{ color: "#F09595", maxWidth: 240 }}
        >
          {micError}
        </p>
      ) : (
        <div
          className="flex items-end"
          style={{ height: 40, gap: 3 }}
        >
          {BAR_HEIGHTS.map((h, i) => (
            <div
              key={i}
              style={{
                width: 3,
                height: h,
                borderRadius: 2,
                background: isCapturing ? "#E24B4A" : "#378ADD",
                opacity: isCapturing ? 0.85 : 0.28,
                transformOrigin: "bottom",
                animation: isCapturing
                  ? `wave-bar ${0.7 + (i % 4) * 0.15}s ease-in-out ${i * 0.07}s infinite`
                  : "none",
              }}
            />
          ))}
        </div>
      )}

      {/* Status + timer */}
      <div className="flex flex-col items-center gap-1">
        <span
          className="text-xs tracking-widest uppercase"
          style={{ color: "rgba(133,183,235,0.6)" }}
        >
          {statusLabel}
        </span>
        <span
          className="text-lg"
          style={{
            color: "#85B7EB",
            fontVariantNumeric: "tabular-nums",
            fontFamily: "ui-monospace, monospace",
          }}
        >
          {formatTime(elapsed)}
        </span>
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <button
          onClick={handleClear}
          className="px-5 py-2 rounded-lg text-sm transition-colors"
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
          Clear
        </button>
        <button
          onClick={handleAnalyse}
          disabled={!canAnalyse}
          className="px-5 py-2 rounded-lg text-sm transition-colors"
          style={{
            background: canAnalyse ? "#185FA5" : "rgba(24,95,165,0.3)",
            color: canAnalyse ? "#85B7EB" : "rgba(133,183,235,0.4)",
            border: "1px solid transparent",
            cursor: canAnalyse ? "pointer" : "not-allowed",
            opacity: canAnalyse ? 1 : 0.5,
          }}
        >
          Analyse recording
        </button>
      </div>
    </div>
  );
}
