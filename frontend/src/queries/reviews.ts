import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/api";
import type { ReviewWithUser, Trek } from "@/types";

export type ReviewWithUserAndTrek = ReviewWithUser & { trek: Trek };

export function useOrganizerReviews() {
  return useQuery({
    queryKey: ["organizer-reviews"],
    queryFn: async () => {
      const { data } = await api.get<ReviewWithUserAndTrek[]>("/organizers/me/reviews");
      return data;
    },
  });
}

export function useTrekReviews(trekId: string | undefined) {
  return useQuery({
    queryKey: ["reviews", trekId],
    queryFn: async () => {
      const { data } = await api.get<ReviewWithUser[]>(`/reviews/trek/${trekId}`);
      return data;
    },
    enabled: !!trekId,
  });
}

export function useCreateReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { trek_id: string; rating: number; comment?: string }) => {
      const { data } = await api.post<ReviewWithUser>("/reviews", payload);
      return data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["reviews", variables.trek_id] });
    },
  });
}

export function useRespondToReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      reviewId,
      organizer_response,
    }: {
      reviewId: string;
      organizer_response: string;
      trekId: string;
    }) => {
      const { data } = await api.patch<ReviewWithUser>(`/reviews/${reviewId}/response`, { organizer_response });
      return data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["reviews", variables.trekId] });
      queryClient.invalidateQueries({ queryKey: ["organizer-reviews"] });
    },
  });
}
