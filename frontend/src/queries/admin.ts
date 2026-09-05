import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/api";
import type { OrganizerProfile, PlatformStats, User, UserRole, VerificationStatus } from "@/types";

export function usePlatformStats() {
  return useQuery({
    queryKey: ["platform-stats"],
    queryFn: async () => {
      const { data } = await api.get<PlatformStats>("/admin/stats");
      return data;
    },
  });
}

export function useAdminUsers(role?: UserRole) {
  return useQuery({
    queryKey: ["admin-users", role],
    queryFn: async () => {
      const { data } = await api.get<User[]>("/admin/users", { params: role ? { role } : undefined });
      return data;
    },
  });
}

export function useOrganizersForReview(verificationStatus?: VerificationStatus) {
  return useQuery({
    queryKey: ["admin-organizers", verificationStatus],
    queryFn: async () => {
      const { data } = await api.get<OrganizerProfile[]>("/admin/organizers", {
        params: verificationStatus ? { verification_status: verificationStatus } : undefined,
      });
      return data;
    },
  });
}

export function useUpdateOrganizerVerification() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ organizerId, status }: { organizerId: string; status: VerificationStatus }) => {
      const { data } = await api.patch<OrganizerProfile>(`/admin/organizers/${organizerId}/verification`, {
        verification_status: status,
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-organizers"] });
    },
  });
}

export function useDeleteReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (reviewId: string) => {
      await api.delete(`/admin/reviews/${reviewId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
    },
  });
}
