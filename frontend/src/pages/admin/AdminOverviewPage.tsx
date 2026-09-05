import { Calendar, Compass, ShieldCheck, Users as UsersIcon } from "lucide-react";

import { StatCard } from "@/components/StatCard";
import { usePlatformStats } from "@/queries/admin";

export function AdminOverviewPage() {
  const { data: stats, isLoading } = usePlatformStats();

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-pine">Platform overview</h1>
      {isLoading && <p className="mt-4 text-moss">Loading stats...</p>}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total users" value={stats?.total_users ?? 0} icon={UsersIcon} />
        <StatCard label="Organizers" value={stats?.total_organizers ?? 0} icon={ShieldCheck} />
        <StatCard label="Treks listed" value={stats?.total_treks ?? 0} icon={Compass} />
        <StatCard label="Bookings" value={stats?.total_bookings ?? 0} icon={Calendar} />
      </div>
    </div>
  );
}

export default AdminOverviewPage;
