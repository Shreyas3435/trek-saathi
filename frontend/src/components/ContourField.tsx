interface ContourFieldProps {
  className?: string;
}

const RINGS = [40, 70, 100, 130, 160, 190, 220];

/** Faint nested topographic rings — low-opacity background texture, hero sections only. */
export function ContourField({ className }: ContourFieldProps) {
  return (
    <svg viewBox="0 0 400 400" className={className} fill="none" aria-hidden="true">
      {RINGS.map((r, i) => (
        <circle key={r} cx={230} cy={170} r={r} stroke="currentColor" strokeWidth={1} opacity={0.06 + i * 0.015} />
      ))}
    </svg>
  );
}
