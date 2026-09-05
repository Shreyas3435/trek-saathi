import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { formatDate } from "@/lib/utils";
import { useOrganizerBookingRequests, useUpdateBookingStatus } from "@/queries/bookings";

export function BookingRequestsPage() {
  const { data: requests, isLoading } = useOrganizerBookingRequests();
  const updateStatus = useUpdateBookingStatus();

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-pine">Booking requests</h1>

      <div className="mt-6 space-y-3">
        {isLoading && <p className="text-moss">Loading requests...</p>}
        {requests?.length === 0 && <p className="text-moss">No booking requests yet.</p>}
        {requests?.map((request) => (
          <Card key={request.id} className="p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="font-medium text-pine">{request.user.full_name}</p>
                <p className="text-sm text-moss">{request.user.email}</p>
                {request.contact_phone && <p className="text-sm text-moss">{request.contact_phone}</p>}
                <p className="mt-2 text-sm text-pine/80">
                  <span className="num">{request.num_participants}</span> participant
                  {request.num_participants > 1 ? "s" : ""}
                  {request.pickup_location && <> &middot; Pickup: {request.pickup_location}</>}
                </p>
                {request.special_requests && (
                  <p className="mt-1 text-sm italic text-moss">&ldquo;{request.special_requests}&rdquo;</p>
                )}
                <p className="mt-1 text-xs text-moss">Requested {formatDate(request.created_at)}</p>
              </div>
              <StatusBadge status={request.status} />
            </div>

            {request.status === "pending" && (
              <div className="mt-4 flex gap-2">
                <Button
                  size="sm"
                  onClick={() => updateStatus.mutate({ bookingId: request.id, status: "confirmed" })}
                  disabled={updateStatus.isPending}
                >
                  Confirm
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateStatus.mutate({ bookingId: request.id, status: "rejected" })}
                  disabled={updateStatus.isPending}
                >
                  Reject
                </Button>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}

export default BookingRequestsPage;
