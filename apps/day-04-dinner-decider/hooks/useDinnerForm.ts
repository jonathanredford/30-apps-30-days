"use client";

import { useState } from "react";
import type { FormState } from "@/lib/types";

export function useDinnerForm() {
  const [moods, setMoods] = useState<string[]>([]);
  const [cuisines, setCuisines] = useState<string[]>([]);
  const [time, setTime] = useState<string>("");
  const [effort, setEffort] = useState<string>("");
  const [fridge, setFridge] = useState<string>("");

  function toggleMood(mood: string) {
    setMoods((prev) =>
      prev.includes(mood) ? prev.filter((m) => m !== mood) : [...prev, mood]
    );
  }

  function toggleCuisine(cuisine: string) {
    setCuisines((prev) =>
      prev.includes(cuisine)
        ? prev.filter((c) => c !== cuisine)
        : [...prev, cuisine]
    );
  }

  function reset() {
    setMoods([]);
    setCuisines([]);
    setTime("");
    setEffort("");
    setFridge("");
  }

  const formState: FormState = { moods, cuisines, time, effort, fridge };

  const isValid =
    moods.length > 0 || cuisines.length > 0 || time !== "" || effort !== "";

  return {
    formState,
    moods,
    cuisines,
    time,
    effort,
    fridge,
    toggleMood,
    toggleCuisine,
    setTime,
    setEffort,
    setFridge,
    reset,
    isValid,
  };
}
