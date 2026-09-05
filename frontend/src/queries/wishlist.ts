import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/api";
import type { WishlistItemWithTrek } from "@/types";

export function useWishlist(enabled = true) {
  return useQuery({
    queryKey: ["wishlist"],
    queryFn: async () => {
      const { data } = await api.get<WishlistItemWithTrek[]>("/wishlist");
      return data;
    },
    enabled,
  });
}

export function useAddToWishlist() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (trekId: string) => {
      const { data } = await api.post<WishlistItemWithTrek>(`/wishlist/${trekId}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
  });
}

export function useRemoveFromWishlist() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (trekId: string) => {
      await api.delete(`/wishlist/${trekId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
  });
}
