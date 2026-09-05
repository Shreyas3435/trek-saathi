import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useOrganizerReviews, useRespondToReview } from "@/queries/reviews";

function RespondForm({ reviewId, trekId }: { reviewId: string; trekId: string }) {
  const [response, setResponse] = useState("");
  const respondToReview = useRespondToReview();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!response.trim()) return;
    await respondToReview.mutateAsync({ reviewId, organizer_response: response, trekId });
    setResponse("");
  };

  return (
    <form onSubmit={handleSubmit} className="mt-3 flex gap-2">
      <input
        value={response}
        onChange={(e) => setResponse(e.target.value)}
        placeholder="Write a response..."
        className="w-full rounded-lg border border-moss/30 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blaze/50"
      />
      <Button type="submit" size="sm" disabled={respondToReview.isPending}>
        Reply
      </Button>
    </form>
  );
}

export function ReviewsPage() {
  const { data: reviews, isLoading } = useOrganizerReviews();

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-pine">Reviews</h1>

      <div className="mt-6 space-y-4">
        {isLoading && <p className="text-moss">Loading reviews...</p>}
        {reviews?.length === 0 && <p className="text-moss">No reviews on your treks yet.</p>}
        {reviews?.map((review) => (
          <Card key={review.id} className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-pine">{review.trek.title}</p>
                <p className="text-sm text-moss">{review.user.full_name}</p>
              </div>
              <span className="num text-sm text-brass">{review.rating}/5</span>
            </div>
            {review.comment && <p className="mt-2 text-sm text-pine/80">{review.comment}</p>}

            {review.organizer_response ? (
              <div className="mt-3 rounded-xl bg-canopy/5 p-3 text-sm">
                <span className="font-medium text-canopy">Your response: </span>
                {review.organizer_response}
              </div>
            ) : (
              <RespondForm reviewId={review.id} trekId={review.trek_id} />
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}

export default ReviewsPage;
