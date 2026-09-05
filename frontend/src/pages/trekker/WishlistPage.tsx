import { TrekCard } from "@/components/TrekCard";
import { useWishlist } from "@/queries/wishlist";

export function WishlistPage() {
  const { data: wishlist, isLoading } = useWishlist();

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-pine">Your wishlist</h1>
      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading && <p className="text-moss">Loading wishlist...</p>}
        {wishlist?.length === 0 && <p className="text-moss">You haven&apos;t wishlisted any treks yet.</p>}
        {wishlist?.map((item) => (
          <TrekCard key={item.id} trek={item.trek} />
        ))}
      </div>
    </div>
  );
}

export default WishlistPage;
