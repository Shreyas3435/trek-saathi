import { BadgeCheck } from "lucide-react";
import { Link } from "react-router-dom";

import { Card } from "@/components/ui/Card";
import { useOrganizers } from "@/queries/organizers";

export function OrganizersDirectoryPage() {
  const { data: organizers, isLoading } = useOrganizers();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-2xl font-semibold text-pine">Trek organizers</h1>
      <p className="mt-1 text-moss">Verified organizers running treks across Karnataka.</p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading && <p className="text-moss">Loading organizers...</p>}
        {organizers?.map((organizer) => (
          <Link key={organizer.id} to={`/organizers/${organizer.id}`}>
            <Card className="flex items-center gap-4 p-5 transition-shadow hover:shadow-md">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-moss/10">
                {organizer.logo_url ? (
                  <img
                    src={organizer.logo_url}
                    alt={organizer.organization_name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="font-display text-lg text-moss">{organizer.organization_name[0]}</span>
                )}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <p className="font-medium text-pine">{organizer.organization_name}</p>
                  {organizer.verification_status === "verified" && <BadgeCheck className="h-4 w-4 text-blaze" />}
                </div>
                {organizer.about && <p className="mt-1 line-clamp-2 text-sm text-moss">{organizer.about}</p>}
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default OrganizersDirectoryPage;
