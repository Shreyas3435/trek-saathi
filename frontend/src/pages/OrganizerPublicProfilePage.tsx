import { BadgeCheck, Globe, Instagram } from "lucide-react";
import { useParams } from "react-router-dom";

import { TrekCard } from "@/components/TrekCard";
import { useOrganizer } from "@/queries/organizers";
import { useTreks } from "@/queries/treks";

export function OrganizerPublicProfilePage() {
  const { organizerId } = useParams<{ organizerId: string }>();
  const { data: organizer, isLoading } = useOrganizer(organizerId);
  const { data: treks } = useTreks({ organizer_id: organizerId });

  if (isLoading) {
    return <div className="mx-auto max-w-5xl px-4 py-16 text-center text-moss">Loading organizer...</div>;
  }

  if (!organizer) {
    return <div className="mx-auto max-w-5xl px-4 py-16 text-center text-moss">Organizer not found.</div>;
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <div className="flex items-center gap-4">
        <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-moss/10">
          {organizer.logo_url ? (
            <img src={organizer.logo_url} alt={organizer.organization_name} className="h-full w-full object-cover" />
          ) : (
            <span className="font-display text-2xl text-moss">{organizer.organization_name[0]}</span>
          )}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl font-semibold text-pine">{organizer.organization_name}</h1>
            {organizer.verification_status === "verified" && <BadgeCheck className="h-5 w-5 text-blaze" />}
          </div>
          <div className="mt-1 flex gap-3 text-sm text-moss">
            {organizer.website_url && (
              <a
                href={organizer.website_url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 hover:text-pine"
              >
                <Globe className="h-4 w-4" /> Website
              </a>
            )}
            {organizer.instagram_url && (
              <a
                href={organizer.instagram_url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 hover:text-pine"
              >
                <Instagram className="h-4 w-4" /> Instagram
              </a>
            )}
          </div>
        </div>
      </div>

      {organizer.about && <p className="mt-6 max-w-2xl text-pine/80">{organizer.about}</p>}

      <h2 className="mt-10 font-display text-xl font-semibold text-pine">Treks by {organizer.organization_name}</h2>
      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {treks?.length === 0 && <p className="text-moss">No active treks right now.</p>}
        {treks?.map((trek) => (
          <TrekCard key={trek.id} trek={trek} />
        ))}
      </div>
    </div>
  );
}

export default OrganizerPublicProfilePage;
