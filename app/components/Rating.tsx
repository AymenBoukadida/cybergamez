import { clsx } from "clsx";
import { Star } from "lucide-react";

export function Rating({ value, className }: { value: number; className?: string }) {
  return (
    <span
      className={clsx("inline-flex items-center gap-1 text-sm font-semibold text-gold", className)}
      aria-label={`Rated ${value.toFixed(1)} out of 5`}
    >
      <Star aria-hidden="true" className="size-4 fill-current" />
      {value.toFixed(1)}
    </span>
  );
}
