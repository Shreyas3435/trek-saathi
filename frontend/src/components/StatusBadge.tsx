import { cn } from "@/lib/utils";
import type { BookingStatus, VerificationStatus } from "@/types";

type Status = BookingStatus | VerificationStatus;

const STATUS_STYLES: Record<Status, string> = {
  pending: "bg-brass/15 text-brass border-brass/30",
  confirmed: "bg-moss/15 text-moss border-moss/30",
  verified: "bg-moss/15 text-moss border-moss/30",
  rejected: "bg-red-50 text-red-600 border-red-200",
  cancelled: "bg-pine/10 text-pine/60 border-pine/20",
  unverified: "bg-pine/10 text-pine/60 border-pine/20",
};

export function StatusBadge({ status }: { status: Status }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize",
        STATUS_STYLES[status],
      )}
    >
      {status}
    </span>
  );
}
