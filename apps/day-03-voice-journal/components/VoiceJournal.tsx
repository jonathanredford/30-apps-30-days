"use client";

import { useState, useCallback } from "react";
import { RecordView } from "./RecordView";
import { LoadingView } from "./LoadingView";
import { ReviewView } from "./ReviewView";
import { HistoryView } from "./HistoryView";
import { useJournalHistory } from "@/lib/useJournalHistory";
import type { RecordingState, AnalysisResult } from "@/lib/types";

export default function VoiceJournal({ isDemo = false }: { isDemo?: boolean }) {
  const [state, setState] = useState<RecordingState>("idle");
  const [activeTab, setActiveTab] = useState<Tab>("record");
  const [transcript, setTranscript] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const { entries, addEntry, deleteEntry } = useJournalHistory();

  const handleAnalyse = useCallback(
    async (blob: Blob) => {
      setState("loading");
      try {
        const fd = new FormData();
        fd.append("audio", blob, "audio.webm");
        const transcribeRes = await fetch("/api/transcribe", {
          method: "POST",
          body: fd,
        });
        if (!transcribeRes.ok) throw new Error("Transcription failed");
        const { transcript: t } = await transcribeRes.json();
        setTranscript(t);

        const analyseRes = await fetch("/api/analyse", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ transcript: t }),
        });
        if (!analyseRes.ok) throw new Error("Analysis failed");
        const analysis: AnalysisResult = await analyseRes.json();

        addEntry(t, analysis);
        setResult(analysis);
        setState("done");
        setActiveTab("review");
      } catch (err) {
        console.error(err);
        setState("idle");
      }
    },
    [addEntry],
  );

  const handleReset = useCallback(() => {
    setState("idle");
    setActiveTab("record");
    setTranscript("");
    setResult(null);
  }, []);

  const handleRecordingStart = useCallback(() => {
    setState("recording");
  }, []);

  const isLoading = state === "loading";
  const reviewLocked = state !== "done";
  const centred = isLoading || activeTab === "record";

  return (
    <div
      style={{
        display: "grid",
        gridTemplateRows: "auto 1fr",
        minHeight: "100vh",
      }}
    >
      {/* ── Header: demo pill + tabs — sticky so it never moves ── */}
      <header
        className="sticky top-0 z-10 flex flex-col items-center gap-3 pt-7 pb-4 px-4"
        style={{
          borderBottom: "1px solid rgba(55,138,221,0.07)",
        }}
      >
        {isDemo && (
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs"
            style={{
              background: "rgba(24,95,165,0.12)",
              border: "1px solid rgba(55,138,221,0.2)",
              color: "rgba(133,183,235,0.6)",
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#378ADD",
                opacity: 0.7,
                flexShrink: 0,
              }}
            />
            Demo mode — API calls are simulated
          </div>
        )}

        <nav className="flex gap-8" aria-label="Journal tabs">
          <TabButton
            label="Record"
            active={activeTab === "record"}
            disabled={isLoading}
            onClick={() => setActiveTab("record")}
          />
          <TabButton
            label="Review"
            active={activeTab === "review"}
            disabled={reviewLocked}
            onClick={() => setActiveTab("review")}
          />
          <TabButton
            label="History"
            active={activeTab === "history"}
            disabled={isLoading}
            onClick={() => setActiveTab("history")}
          />
        </nav>
      </header>

      {/* ── Content: centred for Record/Loading, top-down for Review/History ── */}
      <div
        className={`flex w-full px-4 ${
          centred
            ? "items-center justify-center"
            : "items-start justify-center pt-8 pb-12"
        }`}
      >
        <div style={{ width: "100%", maxWidth: 560 }}>
          {isLoading ? (
            <LoadingView />
          ) : activeTab === "review" && state === "done" && result ? (
            <ReviewView
              transcript={transcript}
              result={result}
              onReset={handleReset}
            />
          ) : activeTab === "history" ? (
            <HistoryView entries={entries} onDelete={deleteEntry} />
          ) : (
            <div className="flex items-center justify-center">
              <RecordView
                recordingState={state}
                onRecordingStart={handleRecordingStart}
                onAnalyse={handleAnalyse}
                onClear={handleReset}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

type Tab = "record" | "review" | "history";

function TabButton({
  label,
  active,
  disabled,
  onClick,
}: {
  label: string;
  active: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="text-xs tracking-widest uppercase pb-2 transition-colors"
      style={{
        color: active ? "#85B7EB" : "rgba(55,138,221,0.5)",
        borderBottom: active ? "1px solid #378ADD" : "1px solid transparent",
        opacity: disabled ? 0.4 : 1,
        pointerEvents: disabled ? "none" : undefined,
        cursor: disabled ? "not-allowed" : "pointer",
      }}
    >
      {label}
    </button>
  );
}
