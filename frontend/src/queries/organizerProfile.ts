import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/api";
import type { OrganizerProfile, OrganizerStats } from "@/types";

export interface OrganizerProfilePayload {
  organization_name: string;
  logo_url?: string;
  cover_image_url?: string;
  about?: string;
  website_url?: string;
  instagram_url?: string;
  contact_email?: string;
  contact_phone?: string;
}

export function useCreateOrganizerProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: OrganizerProfilePayload) => {
      const { data } = await api.post<OrganizerProfile>("/organizers/me", payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["current-user"] });
    },
  });
}

export function useUpdateOrganizerProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<OrganizerProfilePayload>) => {
      const { data } = await api.patch<OrganizerProfile>("/organizers/me", payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["current-user"] });
    },
  });
}

export function useOrganizerStats() {
  return useQuery({
    queryKey: ["organizer-stats"],
    queryFn: async () => {
      const { data } = await api.get<OrganizerStats>("/organizers/me/stats");
      return data;
    },
  });
}
