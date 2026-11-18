import { ArrowRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type { StoreGame } from "@/app/data/live";
import { formatDate, syncedAt } from "@/app/data/live";
import { buttonClasses } from "./Button";
import { Chip } from "./Chip";
import { StoreBadge, StorePrice, storeLabel } from "./StoreMeta";

export function Hero({ game }: { game: StoreGame }) {
  return (
    <section className="shell grid items-center gap-10 pb-4 pt-10 lg:grid-cols-[1fr_1.35fr] lg:gap-14 lg:pt-16">
      <div className="max-w-xl">
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
            Featured this week
          </p>
          <StoreBadge store={game.store} />
        </div>

        <h1 className="mt-4 text-[clamp(2.5rem,6vw,4.5rem)] font-bold leading-[0.95] tracking-tight">
          {game.title}
        </h1>
        <p className="mt-5 line-clamp-3 max-w-md text-base leading-relaxed text-muted">
          {game.description}
        </p>

        {game.genres.length > 0 ? (
          <div className="mt-5 flex flex-wrap gap-2">
            {game.genres.slice(0, 3).map((genre) => (
              <Chip key={genre}>{genre}</Chip>
            ))}
          </div>
        ) : null}

        <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2">
          <StorePrice game={game} size="md" />
          <span className="text-xs text-muted">
            Checked {formatDate(syncedAt.toISOString())} · {storeLabel(game.store)}
          </span>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-5">
          <Link href={`/games/${game.slug}/`} prefetch={false} className={buttonClasses()}>
            View game
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
          <a
            href={game.storeUrl}
            target="_blank"
            rel="noreferrer"
            className="focus-ring inline-flex items-center gap-1.5 rounded text-sm font-semibold text-text underline-offset-4 transition-colors hover:text-brand hover:underline"
          >
            Open on {storeLabel(game.store)}
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </a>
        </div>
      </div>

      <div className="order-first lg:order-none">
        <Link
          href={`/games/${game.slug}/`}
          prefetch={false}
          className="focus-ring group relative block aspect-video overflow-hidden rounded-2xl border border-line shadow-[0_0_90px_-30px_rgba(255,77,94,0.55)]"
        >
          <img
            src={game.heroImage}
            alt={`${game.title} key art`}
            width={1280}
            height={720}
            fetchPriority="high"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02] motion-reduce:group-hover:scale-100"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
          <div
            aria-hidden="true"
            className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-4"
          >
            <span className="rounded-lg border border-line bg-ink/70 px-3 py-1.5 text-xs font-medium text-text backdrop-blur-sm">
              Now featured on CyberGamez
            </span>
            <span className="rounded-lg bg-brand px-3 py-1.5 text-xs font-bold text-ink">
              Read more
            </span>
          </div>
        </Link>
      </div>
    </section>
  );
}
