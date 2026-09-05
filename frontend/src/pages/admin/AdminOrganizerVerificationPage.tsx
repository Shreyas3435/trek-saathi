import { useState } from "react";

import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import { useOrganizersForReview, useUpdateOrganizerVerification } from "@/queries/admin";
import type { VerificationStatus } from "@/types";

const FILTERS: { value: VerificationStatus | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "unverified", label: "Unverified" },
  { value: "verified", label: "Verified" },
  { value: "rejected", label: "Rejected" },
];

export function AdminOrganizerVerificationPage() {
  const [filter, setFilter] = useState<VerificationStatus | "all">("pending");
  const { data: organizers, isLoading } = useOrganizersForReview(filter === "all" ? undefined : filter);
  const updateVerification = useUpdateOrganizerVerification();

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-pine">Organizer verification</h1>

      <div className="mt-4 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setFilter(f.value)}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
              filter === f.value
                ? "border-blaze bg-blaze text-white"
                : "border-moss/30 text-pine/70 hover:border-moss/60",
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-3">
        {isLoading && <p className="text-moss">Loading organizers...</p>}
        {organizers?.length === 0 && <p className="text-moss">No organizers in this category.</p>}
        {organizers?.map((organizer) => (
          <Card key={organizer.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-medium text-pine">{organizer.organization_name}</p>
              {organizer.contact_email && <p className="text-sm text-moss">{organizer.contact_email}</p>}
              {organizer.about && <p className="mt-1 line-clamp-1 text-sm text-moss">{organizer.about}</p>}
            </div>
            <div className="flex items-center gap-3">
              <StatusBadge status={organizer.verification_status} />
              {organizer.verification_status !== "verified" && (
                <Button
                  size="sm"
                  onClick={() => updateVerification.mutate({ organizerId: organizer.id, status: "verified" })}
                  disabled={updateVerification.isPending}
                >
                  Verify
                </Button>
              )}
              {organizer.verification_status !== "rejected" && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateVerification.mutate({ organizerId: organizer.id, status: "rejected" })}
                  disabled={updateVerification.isPending}
                >
                  Reject
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default AdminOrganizerVerificationPage;
