interface TrailLineProps {
  points?: string;
  className?: string;
  strokeColor?: string;
}

/** Signature elevation-profile motif — vary `points` per placement so it doesn't feel stamped. */
export function TrailLine({
  points = "0,60 40,45 80,50 120,20 160,30 200,10 240,25 280,5 320,18 360,8",
  className,
  strokeColor = "currentColor",
}: TrailLineProps) {
  return (
    <svg viewBox="0 0 360 70" className={className} fill="none" preserveAspectRatio="none" aria-hidden="true">
      <polyline
        points={points}
        stroke={strokeColor}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
