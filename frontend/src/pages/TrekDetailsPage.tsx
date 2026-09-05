import { Calendar, MapPin, Users } from "lucide-react";
import { useState, type FormEvent } from "react";
import { useParams } from "react-router-dom";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useAuth } from "@/context/AuthContext";
import { formatDate, formatPrice } from "@/lib/utils";
import { useCreateBooking, useMyBookings } from "@/queries/bookings";
import { useCreateReview, useTrekReviews } from "@/queries/reviews";
import { useTrek } from "@/queries/treks";

export function TrekDetailsPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: trek, isLoading } = useTrek(slug);
  const { user } = useAuth();

  const [numParticipants, setNumParticipants] = useState(1);
  const [pickupLocation, setPickupLocation] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [bookingSubmitted, setBookingSubmitted] = useState(false);

  const createBooking = useCreateBooking();
  const { data: myBookings } = useMyBookings(user?.role === "trekker");
  const { data: reviews } = useTrekReviews(trek?.id);
  const createReview = useCreateReview();

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  if (isLoading) {
    return <div className="mx-auto max-w-5xl px-4 py-16 text-center text-moss">Loading trek...</div>;
  }

  if (!trek) {
    return <div className="mx-auto max-w-5xl px-4 py-16 text-center text-moss">Trek not found.</div>;
  }

  const hasConfirmedBooking = myBookings?.some((b) => b.trek_id === trek.id && b.status === "confirmed");
  const hasReviewed = reviews?.some((r) => r.user_id === user?.id);

  const handleBookingSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await createBooking.mutateAsync({
      trek_id: trek.id,
      num_participants: numParticipants,
      pickup_location: pickupLocation || undefined,
      special_requests: specialRequests || undefined,
      contact_phone: contactPhone || undefined,
    });
    setBookingSubmitted(true);
  };

  const handleReviewSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await createReview.mutateAsync({ trek_id: trek.id, rating, comment: comment || undefined });
    setComment("");
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <div className="overflow-hidden rounded-3xl bg-moss/10">
        {trek.cover_image_url && (
          <img src={trek.cover_image_url} alt={trek.title} className="h-72 w-full object-cover sm:h-96" />
        )}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <p className="font-mono text-sm uppercase tracking-wide text-blaze">{trek.destination.name}</p>
          <h1 className="mt-2 font-display text-3xl font-semibold text-pine">{trek.title}</h1>

          <div className="mt-4 flex flex-wrap gap-4 text-sm text-moss">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" /> {formatDate(trek.trek_date)}
            </span>
            <span className="flex items-center gap-1.5 capitalize">
              <MapPin className="h-4 w-4" /> {trek.difficulty} &middot; <span className="num">{trek.duration_days}D</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Users className="h-4 w-4" /> <span className="num">{trek.available_seats}</span> seats left
            </span>
          </div>

          <div className="mt-8 space-y-6 text-pine/90">
            {trek.itinerary && (
              <div>
                <h2 className="font-display text-lg font-semibold text-pine">Itinerary</h2>
                <p className="mt-2 whitespace-pre-line text-sm">{trek.itinerary}</p>
              </div>
            )}
            {trek.inclusions && (
              <div>
                <h2 className="font-display text-lg font-semibold text-pine">Inclusions</h2>
                <p className="mt-2 whitespace-pre-line text-sm">{trek.inclusions}</p>
              </div>
            )}
            {trek.exclusions && (
              <div>
                <h2 className="font-display text-lg font-semibold text-pine">Exclusions</h2>
                <p className="mt-2 whitespace-pre-line text-sm">{trek.exclusions}</p>
              </div>
            )}
            {trek.things_to_carry && (
              <div>
                <h2 className="font-display text-lg font-semibold text-pine">Things to carry</h2>
                <p className="mt-2 whitespace-pre-line text-sm">{trek.things_to_carry}</p>
              </div>
            )}
            {trek.pickup_locations && (
              <div>
                <h2 className="font-display text-lg font-semibold text-pine">Pickup locations</h2>
                <p className="mt-2 text-sm">{trek.pickup_locations}</p>
              </div>
            )}
          </div>

          <div className="mt-10 border-t border-moss/15 pt-8">
            <h2 className="font-display text-lg font-semibold text-pine">Organized by</h2>
            <p className="mt-2 text-pine/90">{trek.organizer.organization_name}</p>
            {trek.organizer.about && <p className="mt-1 text-sm text-moss">{trek.organizer.about}</p>}
          </div>

          <div className="mt-10 border-t border-moss/15 pt-8">
            <h2 className="font-display text-lg font-semibold text-pine">Reviews</h2>
            {reviews?.length === 0 && <p className="mt-2 text-sm text-moss">No reviews yet.</p>}
            <div className="mt-4 space-y-4">
              {reviews?.map((review) => (
                <Card key={review.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-pine">{review.user.full_name}</span>
                    <span className="num text-sm text-brass">{review.rating}/5</span>
                  </div>
                  {review.comment && <p className="mt-2 text-sm text-pine/80">{review.comment}</p>}
                  {review.organizer_response && (
                    <div className="mt-3 rounded-xl bg-canopy/5 p-3 text-sm">
                      <span className="font-medium text-canopy">Organizer response: </span>
                      {review.organizer_response}
                    </div>
                  )}
                </Card>
              ))}
            </div>

            {user?.role === "trekker" && (
              <div className="mt-6">
                {hasReviewed ? (
                  <p className="text-sm text-moss">You&apos;ve already reviewed this trek.</p>
                ) : hasConfirmedBooking ? (
                  <form onSubmit={handleReviewSubmit} className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-pine">Your rating:</span>
                      <select
                        value={rating}
                        onChange={(e) => setRating(Number(e.target.value))}
                        className="rounded-lg border border-moss/30 px-2 py-1 text-sm"
                      >
                        {[5, 4, 3, 2, 1].map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                      </select>
                    </div>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Share your experience..."
                      className="w-full rounded-xl border border-moss/30 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blaze/50"
                      rows={3}
                    />
                    <Button type="submit" size="sm" disabled={createReview.isPending}>
                      Submit review
                    </Button>
                  </form>
                ) : (
                  <p className="text-sm text-moss">
                    You can review this trek after your booking has been confirmed by the organizer.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        <div>
          <Card className="sticky top-24 p-6">
            <p className="num text-2xl font-semibold text-pine">{formatPrice(trek.price)}</p>
            <p className="text-sm text-moss">per person</p>

            {!user && <p className="mt-6 text-sm text-moss">Log in as a trekker to request a booking.</p>}

            {user?.role === "trekker" && !bookingSubmitted && (
              <form onSubmit={handleBookingSubmit} className="mt-6 space-y-3">
                <label className="block text-sm font-medium text-pine">
                  Participants
                  <input
                    type="number"
                    min={1}
                    max={trek.available_seats}
                    value={numParticipants}
                    onChange={(e) => setNumParticipants(Number(e.target.value))}
                    className="num mt-1 w-full rounded-lg border border-moss/30 px-3 py-2 text-sm"
                    required
                  />
                </label>
                <label className="block text-sm font-medium text-pine">
                  Pickup location
                  <input
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-moss/30 px-3 py-2 text-sm"
                  />
                </label>
                <label className="block text-sm font-medium text-pine">
                  Contact phone
                  <input
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-moss/30 px-3 py-2 text-sm"
                  />
                </label>
                <label className="block text-sm font-medium text-pine">
                  Special requests
                  <textarea
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-moss/30 px-3 py-2 text-sm"
                    rows={2}
                  />
                </label>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={createBooking.isPending || trek.available_seats === 0}
                >
                  {trek.available_seats === 0 ? "Sold out" : "Request booking"}
                </Button>
                {createBooking.isError && (
                  <p className="text-sm text-red-600">Something went wrong. Please try again.</p>
                )}
              </form>
            )}

            {bookingSubmitted && (
              <p className="mt-6 rounded-xl bg-moss/10 p-4 text-sm text-moss">
                Your booking request has been sent! The organizer will confirm it shortly.
              </p>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

export default TrekDetailsPage;
