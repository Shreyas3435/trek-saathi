import { Calendar, Compass, Heart } from "lucide-react";
import { Link } from "react-router-dom";

import { StatCard } from "@/components/StatCard";
import { StatusBadge } from "@/components/StatusBadge";
import { Card } from "@/components/ui/Card";
import { useAuth } from "@/context/AuthContext";
import { formatDate } from "@/lib/utils";
import { useMyBookings } from "@/queries/bookings";
import { useWishlist } from "@/queries/wishlist";

export function TrekkerDashboardPage() {
  const { user } = useAuth();
  const { data: bookings } = useMyBookings();
  const { data: wishlist } = useWishlist();

  const upcomingBookings = bookings?.filter((b) => b.status === "pending" || b.status === "confirmed").slice(0, 5);

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-pine">
        Welcome back, {user?.full_name?.split(" ")[0]}
      </h1>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Total bookings" value={bookings?.length ?? 0} icon={Calendar} />
        <StatCard label="Wishlisted treks" value={wishlist?.length ?? 0} icon={Heart} />
        <StatCard
          label="Confirmed treks"
          value={bookings?.filter((b) => b.status === "confirmed").length ?? 0}
          icon={Compass}
        />
      </div>

      <div className="mt-8">
        <h2 className="font-display text-lg font-semibold text-pine">Upcoming bookings</h2>
        <div className="mt-4 space-y-3">
          {upcomingBookings?.length === 0 && (
            <p className="text-sm text-moss">
              No upcoming bookings yet.{" "}
              <Link to="/search" className="font-medium text-blaze hover:underline">
                Browse treks
              </Link>
            </p>
          )}
          {upcomingBookings?.map((booking) => (
            <Card key={booking.id} className="flex items-center justify-between p-4">
              <div>
                <Link to={`/treks/${booking.trek.slug}`} className="font-medium text-pine hover:underline">
                  {booking.trek.title}
                </Link>
                <p className="mt-1 text-sm text-moss">{formatDate(booking.trek.trek_date)}</p>
              </div>
              <StatusBadge status={booking.status} />
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TrekkerDashboardPage;
