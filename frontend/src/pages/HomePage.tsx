import { ArrowRight, Search } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

import { ContourField } from "@/components/ContourField";
import { TrailLine } from "@/components/TrailLine";
import { TrekCard } from "@/components/TrekCard";
import { Button } from "@/components/ui/Button";
import { useDestinations } from "@/queries/destinations";
import { useTreks } from "@/queries/treks";

export function HomePage() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const { data: featuredTreks, isLoading: treksLoading } = useTreks({ is_featured: true });
  const { data: popularDestinations, isLoading: destinationsLoading } = useDestinations(true);

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    navigate(search ? `/search?q=${encodeURIComponent(search)}` : "/search");
  };

  return (
    <div>
      <section className="relative overflow-hidden bg-canopy text-mist">
        <ContourField className="pointer-events-none absolute -right-24 -top-24 h-[32rem] w-[32rem] text-mist/30" />
        <div className="relative mx-auto max-w-6xl px-4 py-24 sm:px-6">
          <p className="font-mono text-sm uppercase tracking-widest text-blaze">Karnataka &middot; Western Ghats</p>
          <h1 className="mt-4 max-w-2xl font-display text-4xl font-semibold leading-tight sm:text-5xl">
            Find your next trek, without the group-chat chaos.
          </h1>
          <p className="mt-4 max-w-xl text-mist/70">
            Discover, compare, and book treks from verified organizers across Karnataka — all in one place.
          </p>

          <form onSubmit={handleSearch} className="mt-8 flex max-w-lg gap-2">
            <div className="flex flex-1 items-center gap-2 rounded-full bg-mist px-4">
              <Search className="h-4 w-4 shrink-0 text-moss" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search treks, e.g. Kumara Parvatha"
                className="h-12 w-full bg-transparent text-sm text-pine placeholder:text-moss/60 focus:outline-none"
              />
            </div>
            <Button type="submit" size="lg">
              Search
            </Button>
          </form>

          <TrailLine className="mt-16 h-16 w-full max-w-3xl text-blaze/70" />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="flex items-end justify-between">
          <h2 className="font-display text-2xl font-semibold text-pine">Featured treks</h2>
          <Link to="/search" className="flex items-center gap-1 text-sm font-medium text-blaze hover:underline">
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {treksLoading && <p className="text-moss">Loading treks...</p>}
          {featuredTreks?.map((trek) => (
            <TrekCard key={trek.id} trek={trek} />
          ))}
          {featuredTreks?.length === 0 && <p className="text-moss">No featured treks yet — check back soon.</p>}
        </div>
      </section>

      <section className="bg-white/60 py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="font-display text-2xl font-semibold text-pine">Popular destinations</h2>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {destinationsLoading && <p className="text-moss">Loading destinations...</p>}
            {popularDestinations?.map((destination) => (
              <Link
                key={destination.id}
                to={`/destinations/${destination.slug}`}
                className="group relative aspect-square overflow-hidden rounded-2xl bg-moss/10"
              >
                {destination.cover_image_url && (
                  <img
                    src={destination.cover_image_url}
                    alt={destination.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-canopy/80 via-canopy/10 to-transparent" />
                <span className="absolute bottom-3 left-3 font-display text-sm font-medium text-mist">
                  {destination.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
