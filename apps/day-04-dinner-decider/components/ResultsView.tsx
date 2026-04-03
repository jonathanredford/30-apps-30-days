import { MealCard } from "@/components/MealCard";
import type { Meal } from "@/lib/types";

interface ResultsViewProps {
  meals: Meal[];
  onRegenerate: () => void;
  onStartOver: () => void;
}

export function ResultsView({ meals, onRegenerate, onStartOver }: ResultsViewProps) {
  return (
    <div>
      <div
        className="flex items-center justify-between"
        style={{ marginBottom: "0.85rem" }}
      >
        <h2 style={{ fontWeight: 700, fontSize: "1.1rem", color: "#1a1a1a" }}>
          Tonight&apos;s picks
        </h2>
        <button
          onClick={onRegenerate}
          style={{
            background: "none",
            border: "none",
            color: "#2D8B4E",
            fontWeight: 600,
            fontSize: "0.875rem",
            cursor: "pointer",
            padding: 0,
          }}
        >
          Try again ↻
        </button>
      </div>

      {meals.map((meal, i) => (
        <MealCard key={i} meal={meal} />
      ))}

      <div className="flex justify-center" style={{ marginTop: "1rem" }}>
        <button
          onClick={onStartOver}
          style={{
            background: "none",
            border: "none",
            color: "#888",
            fontSize: "0.875rem",
            cursor: "pointer",
            padding: 0,
            textDecoration: "underline",
          }}
        >
          Start over
        </button>
      </div>
    </div>
  );
}
