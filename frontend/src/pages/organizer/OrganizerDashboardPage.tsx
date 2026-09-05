import { Calendar, Compass, Star } from "lucide-react";
import { Link } from "react-router-dom";

import { StatCard } from "@/components/StatCard";
import { StatusBadge } from "@/components/StatusBadge";
import { Card } from "@/components/ui/Card";
import { useAuth } from "@/context/AuthContext";
import { useOrganizerBookingRequests } from "@/queries/bookings";
import { useOrganizerStats } from "@/queries/organizerProfile";

export function OrganizerDashboardPage() {
  const { user } = useAuth();
  const { data: stats } = useOrganizerStats();
  const { data: requests } = useOrganizerBookingRequests();

  const pendingRequests = requests?.filter((r) => r.status === "pending").slice(0, 5);
  const verificationStatus = user?.organizer_profile?.verification_status;

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-pine">
        {user?.organizer_profile?.organization_name ?? "Your organization"}
      </h1>
      {verificationStatus && verificationStatus !== "verified" && (
        <div className="mt-2 flex items-center gap-2 text-sm text-brass">
          <span>Your organizer profile is</span>
          <StatusBadge status={verificationStatus} />
          <span>— some features may be limited until an admin verifies your account.</span>
        </div>
      )}

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Active treks" value={stats?.total_treks ?? 0} icon={Compass} />
        <StatCard label="Pending requests" value={stats?.pending_booking_requests ?? 0} icon={Calendar} />
        <StatCard label="Average rating" value={stats?.average_rating ?? "—"} icon={Star} />
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-pine">Recent booking requests</h2>
          <Link to="/organizer/bookings" className="text-sm font-medium text-blaze hover:underline">
            View all
          </Link>
        </div>
        <div className="mt-4 space-y-3">
          {pendingRequests?.length === 0 && <p className="text-sm text-moss">No pending requests right now.</p>}
          {pendingRequests?.map((request) => (
            <Card key={request.id} className="flex items-center justify-between p-4">
              <div>
                <p className="font-medium text-pine">{request.user.full_name}</p>
                <p className="mt-1 text-sm text-moss">
                  <span className="num">{request.num_participants}</span> participant
                  {request.num_participants > 1 ? "s" : ""}
                </p>
              </div>
              <StatusBadge status={request.status} />
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

export default OrganizerDashboardPage;
