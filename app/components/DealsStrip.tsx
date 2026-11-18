import Link from "next/link";
import type { StoreGame } from "@/app/data/live";
import { SectionHeading } from "./SectionHeading";
import { StorePrice } from "./StoreMeta";

export function DealsStrip({ games }: { games: StoreGame[] }) {
  if (games.length === 0) return null;

  return (
    <section aria-labelledby="deals" className="shell mt-24">
      <SectionHeading
        id="deals"
        title="Deals worth grabbing"
        subtitle="Live Steam discounts, largest cuts first."
      />
      <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {games.slice(0, 6).map((game) => (
          <Link
            key={game.slug}
            href={`/games/${game.slug}/`}
            className="focus-ring group flex items-center gap-4 rounded-xl border border-line bg-surface p-3 transition-colors hover:border-white/25 hover:bg-surface-2"
          >
            <div className="relative h-16 w-28 shrink-0 overflow-hidden rounded-lg bg-surface-2">
              <img
                src={game.cardImage}
                alt=""
                width={224}
                height={126}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04] motion-reduce:group-hover:scale-100"
              />
              {game.discountPercent > 0 ? (
                <span className="absolute left-1 top-1 rounded bg-gold px-1.5 py-0.5 text-[0.6rem] font-bold text-ink">
                  -{game.discountPercent}%
                </span>
              ) : null}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{game.title}</p>
              <p className="mt-0.5 truncate text-xs text-muted">
                {game.genres.slice(0, 2).join(" · ") || game.developers.slice(0, 1).join("")}
              </p>
            </div>
            <StorePrice game={game} className="shrink-0 text-right" />
          </Link>
        ))}
      </div>
    </section>
  );
}
