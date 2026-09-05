import { Heart, MapPin } from "lucide-react";
import type { MouseEvent } from "react";
import { Link } from "react-router-dom";

import { Card } from "@/components/ui/Card";
import { useAuth } from "@/context/AuthContext";
import { cn, formatPrice } from "@/lib/utils";
import { useAddToWishlist, useRemoveFromWishlist, useWishlist } from "@/queries/wishlist";
import type { Trek } from "@/types";

export function TrekCard({ trek }: { trek: Trek }) {
  const { user } = useAuth();
  const isTrekker = user?.role === "trekker";

  const { data: wishlist } = useWishlist(isTrekker);
  const addToWishlist = useAddToWishlist();
  const removeFromWishlist = useRemoveFromWishlist();

  const isWishlisted = !!wishlist?.some((item) => item.trek_id === trek.id);

  const toggleWishlist = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isWishlisted) {
      removeFromWishlist.mutate(trek.id);
    } else {
      addToWishlist.mutate(trek.id);
    }
  };

  return (
    <Link to={`/treks/${trek.slug}`} className="group block">
      <Card className="overflow-hidden transition-shadow hover:shadow-md">
        <div className="relative aspect-[4/3] overflow-hidden bg-moss/10">
          {trek.cover_image_url && (
            <img
              src={trek.cover_image_url}
              alt={trek.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          )}
          {isTrekker && (
            <button
              type="button"
              onClick={toggleWishlist}
              disabled={addToWishlist.isPending || removeFromWishlist.isPending}
              aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
              className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-sm transition-colors hover:bg-white"
            >
              <Heart className={cn("h-4 w-4", isWishlisted ? "fill-blaze text-blaze" : "text-pine")} />
            </button>
          )}
          {trek.is_featured && (
            <span className="absolute left-3 top-3 rounded-full bg-blaze px-2.5 py-1 text-xs font-medium text-white">
              Featured
            </span>
          )}
        </div>
        <div className="p-4">
          <h3 className="line-clamp-1 font-display font-semibold text-pine">{trek.title}</h3>
          <div className="mt-1 flex items-center gap-1 text-sm text-moss">
            <MapPin className="h-3.5 w-3.5" />
            <span className="capitalize">{trek.difficulty}</span>
            <span>&middot;</span>
            <span className="num">{trek.duration_days}D</span>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <span className="num text-lg font-semibold text-pine">{formatPrice(trek.price)}</span>
            <span className="num text-xs text-moss">{trek.available_seats} seats left</span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
