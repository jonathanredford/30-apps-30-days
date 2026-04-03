"use client";

import { useState } from "react";
import type { Meal, FormState } from "@/lib/types";

type Status = "idle" | "loading" | "success" | "error";

export function useDinnerResults() {
  const [status, setStatus] = useState<Status>("idle");
  const [meals, setMeals] = useState<Meal[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [lastFormState, setLastFormState] = useState<FormState | null>(null);

  async function fetchMeals(formState: FormState) {
    setStatus("loading");
    setError(null);
    setLastFormState(formState);

    try {
      const res = await fetch("/api/decide", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formState),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Something went wrong");
      }

      const data: Meal[] = await res.json();
      setMeals(data);
      setStatus("success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setStatus("error");
    }
  }

  function regenerate() {
    if (lastFormState) fetchMeals(lastFormState);
  }

  function reset() {
    setStatus("idle");
    setMeals([]);
    setError(null);
    setLastFormState(null);
  }

  return {
    status,
    meals,
    error,
    fetchMeals,
    regenerate,
    reset,
    isLoading: status === "loading",
    isSuccess: status === "success",
  };
}
