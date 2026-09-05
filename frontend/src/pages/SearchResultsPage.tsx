import { useState } from "react";
import { useSearchParams } from "react-router-dom";

import { TrekCard } from "@/components/TrekCard";
import { cn } from "@/lib/utils";
import { useTreks } from "@/queries/treks";
import type { DifficultyLevel } from "@/types";

const DIFFICULTIES: { value: DifficultyLevel | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "easy", label: "Easy" },
  { value: "moderate", label: "Moderate" },
  { value: "difficult", label: "Difficult" },
  { value: "challenging", label: "Challenging" },
];

export function SearchResultsPage() {
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("q") ?? "");
  const [difficulty, setDifficulty] = useState<DifficultyLevel | "all">("all");

  const { data: treks, isLoading } = useTreks({
    search: search || undefined,
    difficulty: difficulty === "all" ? undefined : difficulty,
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-2xl font-semibold text-pine">Find a trek</h1>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by trek name..."
          className="h-11 w-full max-w-sm rounded-full border border-moss/30 bg-white px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blaze/50"
        />
        <div className="flex flex-wrap gap-2">
          {DIFFICULTIES.map((d) => (
            <button
              key={d.value}
              type="button"
              onClick={() => setDifficulty(d.value)}
              className={cn(
                "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
                difficulty === d.value
                  ? "border-blaze bg-blaze text-white"
                  : "border-moss/30 text-pine/70 hover:border-moss/60",
              )}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading && <p className="text-moss">Searching treks...</p>}
        {treks?.map((trek) => (
          <TrekCard key={trek.id} trek={trek} />
        ))}
        {treks?.length === 0 && <p className="text-moss">No treks match your search.</p>}
      </div>
    </div>
  );
}

export default SearchResultsPage;
