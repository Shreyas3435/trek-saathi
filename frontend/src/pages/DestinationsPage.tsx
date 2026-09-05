import { Link } from "react-router-dom";

import { useDestinations } from "@/queries/destinations";

export function DestinationsPage() {
  const { data: destinations, isLoading } = useDestinations();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-2xl font-semibold text-pine">Destinations</h1>
      <p className="mt-1 text-moss">Explore trekking regions across Karnataka.</p>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {isLoading && <p className="text-moss">Loading destinations...</p>}
        {destinations?.map((destination) => (
          <Link
            key={destination.id}
            to={`/destinations/${destination.slug}`}
            className="group relative aspect-[4/3] overflow-hidden rounded-2xl bg-moss/10"
          >
            {destination.cover_image_url && (
              <img
                src={destination.cover_image_url}
                alt={destination.name}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-canopy/80 via-canopy/10 to-transparent" />
            <div className="absolute bottom-3 left-3">
              <span className="font-display text-sm font-medium text-mist">{destination.name}</span>
              <span className="block text-xs text-mist/70">{destination.state}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default DestinationsPage;
