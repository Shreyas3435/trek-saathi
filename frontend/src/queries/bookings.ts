import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/api";
import type { Booking, BookingStatus, BookingWithTrek, BookingWithUser } from "@/types";

export interface BookingCreatePayload {
  trek_id: string;
  num_participants: number;
  pickup_location?: string;
  special_requests?: string;
  contact_phone?: string;
}

export function useMyBookings(enabled = true) {
  return useQuery({
    queryKey: ["my-bookings"],
    queryFn: async () => {
      const { data } = await api.get<BookingWithTrek[]>("/bookings/my-bookings");
      return data;
    },
    enabled,
  });
}

export function useOrganizerBookingRequests() {
  return useQuery({
    queryKey: ["organizer-booking-requests"],
    queryFn: async () => {
      const { data } = await api.get<BookingWithUser[]>("/bookings/organizer/requests");
      return data;
    },
  });
}

export function useCreateBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: BookingCreatePayload) => {
      const { data } = await api.post<BookingWithTrek>("/bookings", payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-bookings"] });
    },
  });
}

export function useUpdateBookingStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ bookingId, status }: { bookingId: string; status: BookingStatus }) => {
      const { data } = await api.patch<Booking>(`/bookings/${bookingId}/status`, { status });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organizer-booking-requests"] });
      queryClient.invalidateQueries({ queryKey: ["my-treks"] });
      queryClient.invalidateQueries({ queryKey: ["organizer-stats"] });
    },
  });
}
