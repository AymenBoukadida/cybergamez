import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type { StoreGame } from "@/app/data/live";
import { StoreBadge, StorePrice } from "./StoreMeta";

export function GameCard({ game, priority = false }: { game: StoreGame; priority?: boolean }) {
  const freeNow = game.free?.status === "current";
  const discounted = game.discountPercent > 0 && !freeNow;

  return (
    <Link
      href={`/games/${game.slug}/`}
      prefetch={false}
      className="focus-ring group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface transition-[transform,border-color,box-shadow] duration-200 hover:-translate-y-1 hover:border-white/25 hover:shadow-[0_18px_40px_-24px_rgba(0,0,0,0.9)] motion-reduce:hover:translate-y-0"
    >
      <div className="relative aspect-video overflow-hidden bg-surface-2">
        <img
          src={game.cardImage}
          alt={`${game.title} artwork`}
          width={920}
          height={430}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : undefined}
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03] motion-reduce:group-hover:scale-100"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/5 to-transparent" />
        <div className="absolute inset-x-3 top-3 flex items-start justify-between gap-2">
          <StoreBadge store={game.store} />
          {freeNow ? (
            <span className="rounded-md bg-ok px-2 py-1 text-[0.65rem] font-bold uppercase tracking-[0.1em] text-ink">
              Free now
            </span>
          ) : discounted ? (
            <span className="rounded-md bg-gold px-2 py-1 text-[0.65rem] font-bold tracking-[0.04em] text-ink">
              -{game.discountPercent}%
            </span>
          ) : null}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <h3 className="font-display line-clamp-2 break-words text-base font-semibold leading-snug">
          {game.title}
        </h3>
        <p className="line-clamp-1 text-xs text-muted">
          {game.genres.length > 0
            ? game.genres.slice(0, 2).join(" · ")
            : game.developers.slice(0, 2).join(" · ") || "On " + game.store}
        </p>
        <div className="mt-auto flex items-center justify-between gap-3 pt-3">
          <StorePrice game={game} />
          <ArrowUpRight
            className="size-4 shrink-0 text-muted transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand motion-reduce:group-hover:translate-x-0 motion-reduce:group-hover:translate-y-0"
            aria-hidden="true"
          />
        </div>
      </div>
    </Link>
  );
}
