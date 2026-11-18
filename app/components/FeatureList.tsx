import { Check } from "lucide-react";

export function FeatureList({ items }: { items: string[] }) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {items.map((item) => (
        <li key={item} className="flex gap-2 text-sm text-muted">
          <Check className="mt-0.5 size-4 shrink-0 text-ok" aria-hidden="true" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
