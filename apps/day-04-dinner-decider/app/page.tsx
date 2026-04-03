"use client";

import { HeroCard } from "@/components/HeroCard";
import { InputForm } from "@/components/InputForm";
import { LoadingView } from "@/components/LoadingView";
import { ResultsView } from "@/components/ResultsView";
import { useDinnerForm } from "@/hooks/useDinnerForm";
import { useDinnerResults } from "@/hooks/useDinnerResults";

export default function Home() {
  const form = useDinnerForm();
  const results = useDinnerResults();

  function handleSubmit() {
    results.fetchMeals(form.formState);
  }

  function handleStartOver() {
    results.reset();
    form.reset();
  }

  return (
    <main
      style={{
        maxWidth: 480,
        margin: "0 auto",
        padding: "2rem 1rem",
        minHeight: "100vh",
      }}
    >
      <HeroCard />

      {results.isLoading && <LoadingView />}

      {results.isSuccess && (
        <ResultsView
          meals={results.meals}
          onRegenerate={results.regenerate}
          onStartOver={handleStartOver}
        />
      )}

      {!results.isLoading && !results.isSuccess && (
        <InputForm
          form={form}
          onSubmit={handleSubmit}
          isLoading={results.isLoading}
        />
      )}
    </main>
  );
}
