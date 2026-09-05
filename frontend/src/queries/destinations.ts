import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";
import type { Destination } from "@/types";

export function useDestinations(popularOnly = false) {
  return useQuery({
    queryKey: ["destinations", popularOnly],
    queryFn: async () => {
      const { data } = await api.get<Destination[]>("/destinations", {
        params: popularOnly ? { popular_only: true } : undefined,
      });
      return data;
    },
  });
}

export function useDestination(slug: string | undefined) {
  return useQuery({
    queryKey: ["destination", slug],
    queryFn: async () => {
      const { data } = await api.get<Destination>(`/destinations/${slug}`);
      return data;
    },
    enabled: !!slug,
  });
}
