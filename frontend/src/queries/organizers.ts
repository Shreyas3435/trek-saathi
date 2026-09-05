import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";
import type { OrganizerProfile } from "@/types";

export function useOrganizers() {
  return useQuery({
    queryKey: ["organizers"],
    queryFn: async () => {
      const { data } = await api.get<OrganizerProfile[]>("/organizers");
      return data;
    },
  });
}

export function useOrganizer(organizerId: string | undefined) {
  return useQuery({
    queryKey: ["organizer", organizerId],
    queryFn: async () => {
      const { data } = await api.get<OrganizerProfile>(`/organizers/${organizerId}`);
      return data;
    },
    enabled: !!organizerId,
  });
}
