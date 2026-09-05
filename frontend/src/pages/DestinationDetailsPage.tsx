import { useParams } from "react-router-dom";

import { TrekCard } from "@/components/TrekCard";
import { useDestination } from "@/queries/destinations";
import { useTreks } from "@/queries/treks";

export function DestinationDetailsPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: destination, isLoading } = useDestination(slug);
  const { data: treks } = useTreks({ destination_id: destination?.id });

  if (isLoading) {
    return <div className="mx-auto max-w-5xl px-4 py-16 text-center text-moss">Loading destination...</div>;
  }

  if (!destination) {
    return <div className="mx-auto max-w-5xl px-4 py-16 text-center text-moss">Destination not found.</div>;
  }

  return (
    <div>
      <div className="relative h-64 overflow-hidden bg-moss/10 sm:h-80">
        {destination.cover_image_url && (
          <img src={destination.cover_image_url} alt={destination.name} className="h-full w-full object-cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-canopy/80 via-canopy/10 to-transparent" />
        <div className="absolute bottom-6 left-4 sm:left-6">
          <p className="font-mono text-sm uppercase tracking-wide text-blaze">{destination.state}</p>
          <h1 className="font-display text-3xl font-semibold text-mist">{destination.name}</h1>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        {destination.description && <p className="max-w-2xl text-pine/80">{destination.description}</p>}

        <h2 className="mt-10 font-display text-xl font-semibold text-pine">Treks in {destination.name}</h2>
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {treks?.length === 0 && <p className="text-moss">No treks listed here yet.</p>}
          {treks?.map((trek) => (
            <TrekCard key={trek.id} trek={trek} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default DestinationDetailsPage;
