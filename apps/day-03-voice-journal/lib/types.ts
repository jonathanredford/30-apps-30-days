export type RecordingState = "idle" | "recording" | "loading" | "done";

export interface AnalysisResult {
  summary: string;
  themes: string[];
  actionItems: string[];
}

export interface JournalEntry {
  id: string;
  createdAt: number;
  transcript: string;
  result: AnalysisResult;
}
