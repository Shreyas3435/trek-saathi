import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";
import type { DifficultyLevel, Trek, TrekWithRelations } from "@/types";

export interface TrekFilters {
  destination_id?: string;
  organizer_id?: string;
  difficulty?: DifficultyLevel;
  min_price?: number;
  max_price?: number;
  is_featured?: boolean;
  search?: string;
}

export function useTreks(filters: TrekFilters = {}) {
  return useQuery({
    queryKey: ["treks", filters],
    queryFn: async () => {
      const { data } = await api.get<Trek[]>("/treks", { params: filters });
      return data;
    },
  });
}

export function useTrek(slug: string | undefined) {
  return useQuery({
    queryKey: ["trek", slug],
    queryFn: async () => {
      const { data } = await api.get<TrekWithRelations>(`/treks/${slug}`);
      return data;
    },
    enabled: !!slug,
  });
}
