"use client";

import { useState, useEffect, useCallback } from "react";
import type { JournalEntry, AnalysisResult } from "./types";

const STORAGE_KEY = "voice-journal-history";
const MAX_ENTRIES = 50;

function load(): JournalEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as JournalEntry[]) : [];
  } catch {
    return [];
  }
}

function persist(entries: JournalEntry[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {
    // localStorage full or unavailable — fail silently
  }
}

export function useJournalHistory() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);

  // Load from localStorage after mount (avoids SSR mismatch)
  useEffect(() => {
    setEntries(load());
  }, []);

  const addEntry = useCallback((transcript: string, result: AnalysisResult) => {
    const entry: JournalEntry = {
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      transcript,
      result,
    };
    setEntries((prev) => {
      const next = [entry, ...prev].slice(0, MAX_ENTRIES);
      persist(next);
      return next;
    });
  }, []);

  const deleteEntry = useCallback((id: string) => {
    setEntries((prev) => {
      const next = prev.filter((e) => e.id !== id);
      persist(next);
      return next;
    });
  }, []);

  return { entries, addEntry, deleteEntry };
}
