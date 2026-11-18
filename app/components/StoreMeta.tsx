import { clsx } from "clsx";
import type { Store, StoreGame } from "@/app/data/live";

const STORE_LABEL: Record<Store, string> = {
  steam: "Steam",
  epic: "Epic Games",
};

const STORE_MATCH_PREFIX: Record<Store, string> = {
  steam: "steam",
  epic: "epic games",
};

export function storeLabel(store: Store): string {
  return STORE_LABEL[store];
}

export function isListingStore(store: Store, candidate: string): boolean {
  return candidate.trim().toLowerCase().startsWith(STORE_MATCH_PREFIX[store]);
}

export function StoreBadge({ store, className }: { store: Store; className?: string }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 rounded-md border border-line bg-ink/70 px-2 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-text backdrop-blur-sm",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={clsx("size-1.5 rounded-full", store === "steam" ? "bg-[#66c0f4]" : "bg-text")}
      />
      {STORE_LABEL[store]}
    </span>
  );
}

export function StorePrice({
  game,
  size = "sm",
  className,
}: {
  game: StoreGame;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const freeNow = game.free?.status === "current";
  const freeSoon = game.free?.status === "upcoming";
  const hasDiscount = game.discountPercent > 0 && Boolean(game.originalPriceLabel);

  const currentClass = clsx(
    "font-semibold",
    freeNow ? "text-ok" : "text-text",
    size === "lg" ? "text-2xl" : size === "md" ? "text-lg" : "text-sm",
  );

  return (
    <div className={clsx("flex flex-wrap items-baseline gap-x-2 gap-y-0.5", className)}>
      <span className={currentClass}>
        {freeNow ? "Free now" : freeSoon ? "Free soon" : game.priceLabel}
      </span>
      {hasDiscount && !freeNow && !freeSoon ? (
        <span className="text-xs text-muted line-through">{game.originalPriceLabel}</span>
      ) : null}
    </div>
  );
}
