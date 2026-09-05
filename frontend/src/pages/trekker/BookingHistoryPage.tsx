import { useState } from "react";
import { Link } from "react-router-dom";

import { StatusBadge } from "@/components/StatusBadge";
import { Card } from "@/components/ui/Card";
import { cn, formatDate, formatPrice } from "@/lib/utils";
import { useMyBookings } from "@/queries/bookings";
import type { BookingStatus } from "@/types";

const STATUS_FILTERS: { value: BookingStatus | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "rejected", label: "Rejected" },
  { value: "cancelled", label: "Cancelled" },
];

export function BookingHistoryPage() {
  const { data: bookings, isLoading } = useMyBookings();
  const [statusFilter, setStatusFilter] = useState<BookingStatus | "all">("all");

  const filteredBookings = bookings?.filter((b) => statusFilter === "all" || b.status === statusFilter);

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-pine">Booking history</h1>

      <div className="mt-4 flex flex-wrap gap-2">
        {STATUS_FILTERS.map((filter) => (
          <button
            key={filter.value}
            type="button"
            onClick={() => setStatusFilter(filter.value)}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
              statusFilter === filter.value
                ? "border-blaze bg-blaze text-white"
                : "border-moss/30 text-pine/70 hover:border-moss/60",
            )}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-3">
        {isLoading && <p className="text-moss">Loading bookings...</p>}
        {filteredBookings?.length === 0 && <p className="text-moss">No bookings in this category.</p>}
        {filteredBookings?.map((booking) => (
          <Card key={booking.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <Link to={`/treks/${booking.trek.slug}`} className="font-medium text-pine hover:underline">
                {booking.trek.title}
              </Link>
              <p className="mt-1 text-sm text-moss">
                {formatDate(booking.trek.trek_date)} &middot; <span className="num">{booking.num_participants}</span>{" "}
                participant{booking.num_participants > 1 ? "s" : ""} &middot;{" "}
                {formatPrice(booking.trek.price * booking.num_participants)}
              </p>
            </div>
            <StatusBadge status={booking.status} />
          </Card>
        ))}
      </div>
    </div>
  );
}

export default BookingHistoryPage;
