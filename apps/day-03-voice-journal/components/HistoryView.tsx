"use client";

import { useState } from "react";
import type { JournalEntry } from "@/lib/types";

interface Props {
  entries: JournalEntry[];
  onDelete: (id: string) => void;
}

const CARD_STYLE: React.CSSProperties = {
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(55,138,221,0.15)",
  borderRadius: 12,
  padding: 16,
};

const LABEL_STYLE: React.CSSProperties = {
  fontSize: 10,
  letterSpacing: "0.12em",
  textTransform: "uppercase" as const,
  color: "rgba(133,183,235,0.5)",
  marginBottom: 8,
};

function formatDate(ts: number): string {
  const date = new Date(ts);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const isYesterday = date.toDateString() === yesterday.toDateString();

  const time = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  if (isToday) return `Today · ${time}`;
  if (isYesterday) return `Yesterday · ${time}`;
  return (
    date.toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" }) +
    ` · ${time}`
  );
}

function EntryCard({
  entry,
  onDelete,
}: {
  entry: JournalEntry;
  onDelete: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <div style={CARD_STYLE}>
      {/* Header row */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex flex-col gap-1">
          <span className="text-xs" style={{ color: "rgba(133,183,235,0.45)" }}>
            {formatDate(entry.createdAt)}
          </span>
          <p className="text-sm leading-snug" style={{ color: "#85B7EB" }}>
            {entry.result.summary}
          </p>
        </div>

        {/* Delete / confirm */}
        {confirmDelete ? (
          <div className="flex gap-2 shrink-0 mt-0.5">
            <button
              onClick={() => onDelete()}
              className="text-xs px-2 py-1 rounded"
              style={{
                background: "rgba(163,45,45,0.25)",
                border: "1px solid rgba(163,45,45,0.4)",
                color: "#F09595",
              }}
            >
              Delete
            </button>
            <button
              onClick={() => setConfirmDelete(false)}
              className="text-xs px-2 py-1 rounded"
              style={{
                border: "1px solid rgba(55,138,221,0.2)",
                color: "rgba(133,183,235,0.5)",
              }}
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setConfirmDelete(true)}
            aria-label="Delete entry"
            className="shrink-0 mt-0.5 opacity-30 hover:opacity-70 transition-opacity"
            style={{ color: "#85B7EB" }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Themes */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {entry.result.themes.map((theme, i) => (
          <span
            key={i}
            style={{
              background: "rgba(55,138,221,0.10)",
              border: "1px solid rgba(55,138,221,0.18)",
              borderRadius: 999,
              padding: "1px 8px",
              fontSize: 11,
              color: "rgba(133,183,235,0.75)",
            }}
          >
            {theme}
          </span>
        ))}
      </div>

      {/* Expand toggle */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="text-xs transition-colors"
        style={{ color: "rgba(55,138,221,0.55)" }}
      >
        {expanded ? "Hide details ↑" : "Show transcript & actions ↓"}
      </button>

      {/* Expanded content */}
      {expanded && (
        <div className="mt-4 flex flex-col gap-4">
          <div>
            <p style={LABEL_STYLE}>Transcript</p>
            <p
              className="text-sm leading-relaxed"
              style={{ color: "rgba(133,183,235,0.7)" }}
            >
              {entry.transcript}
            </p>
          </div>

          {entry.result.actionItems.length > 0 && (
            <div>
              <p style={LABEL_STYLE}>Action items</p>
              <ul className="flex flex-col gap-1.5">
                {entry.result.actionItems.map((item, i) => (
                  <li
                    key={i}
                    className="text-sm flex gap-2"
                    style={{ color: "rgba(133,183,235,0.7)" }}
                  >
                    <span style={{ color: "#378ADD", flexShrink: 0 }}>·</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function HistoryView({ entries, onDelete }: Props) {
  if (entries.length === 0) {
    return (
      <div
        className="flex flex-col items-center gap-3 py-12"
        style={{ color: "rgba(133,183,235,0.35)" }}
      >
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M12 8v4l3 3M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <p className="text-sm tracking-wide">No entries yet</p>
        <p className="text-xs" style={{ color: "rgba(133,183,235,0.22)" }}>
          Recordings you analyse will appear here
        </p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-3" style={{ maxWidth: 560 }}>
      <p
        className="text-xs tracking-widest uppercase text-right"
        style={{ color: "rgba(133,183,235,0.3)" }}
      >
        {entries.length} {entries.length === 1 ? "entry" : "entries"}
      </p>
      {entries.map((entry) => (
        <EntryCard
          key={entry.id}
          entry={entry}
          onDelete={() => onDelete(entry.id)}
        />
      ))}
    </div>
  );
}
