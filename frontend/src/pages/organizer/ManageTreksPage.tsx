import { Plus } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { formatDate, formatPrice } from "@/lib/utils";
import { useDeleteTrek, useMyTreks } from "@/queries/organizerTreks";

export function ManageTreksPage() {
  const { data: treks, isLoading } = useMyTreks();
  const deleteTrek = useDeleteTrek();
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  const handleDelete = async (trekId: string) => {
    await deleteTrek.mutateAsync(trekId);
    setConfirmingId(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-pine">Manage treks</h1>
        <Link to="/organizer/treks/new">
          <Button size="sm">
            <Plus className="h-4 w-4" /> New trek
          </Button>
        </Link>
      </div>

      <div className="mt-6 space-y-3">
        {isLoading && <p className="text-moss">Loading your treks...</p>}
        {treks?.length === 0 && <p className="text-moss">You haven&apos;t listed any treks yet.</p>}
        {treks?.map((trek) => (
          <Card key={trek.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <p className="font-medium text-pine">{trek.title}</p>
                {!trek.is_active && (
                  <span className="rounded-full bg-pine/10 px-2 py-0.5 text-xs font-medium text-pine/60">
                    Inactive
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm text-moss">
                {formatDate(trek.trek_date)} &middot; {formatPrice(trek.price)} &middot;{" "}
                <span className="num">{trek.available_seats}</span>/<span className="num">{trek.total_seats}</span>{" "}
                seats
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Link to={`/organizer/treks/${trek.id}/edit`}>
                <Button variant="outline" size="sm">
                  Edit
                </Button>
              </Link>
              {confirmingId === trek.id ? (
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={() => setConfirmingId(null)}>
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleDelete(trek.id)}
                    disabled={deleteTrek.isPending}
                    className="bg-red-600 hover:bg-red-600/90"
                  >
                    Confirm delete
                  </Button>
                </div>
              ) : (
                <Button variant="ghost" size="sm" onClick={() => setConfirmingId(trek.id)}>
                  Delete
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default ManageTreksPage;
