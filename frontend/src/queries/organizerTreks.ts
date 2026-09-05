import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/api";
import type { Trek, TrekFormValues } from "@/types";

export function useMyTreks() {
  return useQuery({
    queryKey: ["my-treks"],
    queryFn: async () => {
      const { data } = await api.get<Trek[]>("/treks/organizer/mine");
      return data;
    },
  });
}

export function useCreateTrek() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: TrekFormValues) => {
      const { data } = await api.post<Trek>("/treks", payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-treks"] });
      queryClient.invalidateQueries({ queryKey: ["organizer-stats"] });
    },
  });
}

export function useUpdateTrek() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ trekId, payload }: { trekId: string; payload: Partial<TrekFormValues> }) => {
      const { data } = await api.patch<Trek>(`/treks/${trekId}`, payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-treks"] });
    },
  });
}

export function useDeleteTrek() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (trekId: string) => {
      await api.delete(`/treks/${trekId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-treks"] });
      queryClient.invalidateQueries({ queryKey: ["organizer-stats"] });
    },
  });
}
