import type { Meal } from "@/lib/types";

interface MealCardProps {
  meal: Meal;
}

export function MealCard({ meal }: MealCardProps) {
  return (
    <div
      style={{
        background: "#ffffff",
        borderRadius: 16,
        border: meal.bestMatch ? "2px solid #2D8B4E" : "1px solid #e8e8e8",
        padding: "1.1rem",
        marginBottom: "0.75rem",
      }}
    >
      <div className="flex items-center gap-2" style={{ marginBottom: "0.4rem" }}>
        <h2 style={{ fontWeight: 700, fontSize: "1.05rem", color: "#1a1a1a" }}>
          {meal.name}
        </h2>
        {meal.bestMatch && (
          <span
            style={{
              background: "#E8F5EE",
              color: "#1A5C33",
              borderRadius: 20,
              padding: "0.15rem 0.6rem",
              fontSize: "0.7rem",
              fontWeight: 600,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              whiteSpace: "nowrap",
            }}
          >
            Best match
          </span>
        )}
      </div>

      <p style={{ color: "#555", fontSize: "0.9rem", marginBottom: "0.65rem" }}>
        {meal.description}
      </p>

      <div className="flex flex-wrap gap-2" style={{ marginBottom: "0.75rem" }}>
        <span
          style={{
            background: "#E8F5EE",
            color: "#1A5C33",
            borderRadius: 20,
            padding: "0.2rem 0.65rem",
            fontSize: "0.78rem",
            fontWeight: 500,
          }}
        >
          {meal.cookTime}
        </span>
        <span
          style={{
            background: "#F2F2F2",
            color: "#555",
            borderRadius: 20,
            padding: "0.2rem 0.65rem",
            fontSize: "0.78rem",
            fontWeight: 500,
          }}
        >
          {meal.effort}
        </span>
        <span
          style={{
            background: "#EAF3FF",
            color: "#1A4A8C",
            borderRadius: 20,
            padding: "0.2rem 0.65rem",
            fontSize: "0.78rem",
            fontWeight: 500,
          }}
        >
          {meal.cuisine}
        </span>
      </div>

      <div
        style={{
          borderLeft: "3px solid #2D8B4E",
          paddingLeft: "0.65rem",
          marginBottom: "0.65rem",
          color: "#444",
          fontSize: "0.875rem",
          fontStyle: "italic",
        }}
      >
        {meal.why}
      </div>

      {meal.ingredients && (
        <p style={{ fontSize: "0.8rem", color: "#888" }}>
          <span style={{ fontWeight: 600, color: "#555" }}>You&apos;ll need: </span>
          {meal.ingredients}
        </p>
      )}
    </div>
  );
}
