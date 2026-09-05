import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/api";
import type { UserWithRelations } from "@/types";

export interface UserUpdatePayload {
  full_name?: string;
  phone_number?: string;
  profile_image_url?: string;
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: UserUpdatePayload) => {
      const { data } = await api.patch<UserWithRelations>("/auth/me", payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["current-user"] });
    },
  });
}
