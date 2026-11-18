import { ArrowRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type { StoreGame } from "@/app/data/live";
import { formatDate } from "@/app/data/live";
import { buttonClasses } from "./Button";
import { Countdown } from "./Countdown";
import { SectionHeading } from "./SectionHeading";
import { StorePrice } from "./StoreMeta";

function EpicFreeCard({ game }: { game: StoreGame }) {
  const offer = game.free;
  if (!offer) return null;

  const current = offer.status === "current";
  const fallback = current
    ? `Ends ${formatDate(offer.until)}`
    : `Starts ${formatDate(offer.from)}`;

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-surface transition-colors hover:border-white/25">
      <Link
        href={`/games/${game.slug}/`}
        prefetch={false}
        className="focus-ring relative block aspect-video overflow-hidden bg-surface-2"
      >
        <img
          src={game.cardImage}
          alt={`${game.title} artwork`}
          width={960}
          height={540}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03] motion-reduce:group-hover:scale-100"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
        <span
          aria-hidden="true"
          className="absolute left-3 top-3 rounded-md bg-ink/75 px-2 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-text backdrop-blur-sm"
        >
          Epic Games
        </span>
      </Link>

      <div className="flex flex-col gap-2 p-5">
        <p className="flex items-center gap-2 text-[0.7rem] font-bold uppercase tracking-[0.14em]">
          <span
            aria-hidden="true"
            className={current ? "size-1.5 rounded-full bg-ok" : "size-1.5 rounded-full bg-gold"}
          />
          <span className={current ? "text-ok" : "text-gold"}>
            {current ? "Free now" : "Free next week"}
          </span>
        </p>

        <h4 className="font-display text-lg font-semibold leading-snug">
          <Link
            href={`/games/${game.slug}/`}
            prefetch={false}
            className="focus-ring rounded hover:text-brand"
          >
            {game.title}
          </Link>
        </h4>

        <p className="line-clamp-2 text-sm leading-relaxed text-muted">{game.description}</p>

        <p className="mt-1 text-xs text-muted">
          <Countdown
            target={current ? offer.until : offer.from}
            kind={current ? "left" : "starts"}
            fallback={fallback}
          />
          <span className="text-muted">
            {" "}
            · {formatDate(offer.from)} – {formatDate(offer.until)}
          </span>
        </p>

        <div className="mt-auto flex flex-wrap gap-2 pt-3">
          <Link
            href={`/games/${game.slug}/`}
            prefetch={false}
            className={buttonClasses({ size: "sm" })}
          >
            Details
            <ArrowRight className="size-3.5" aria-hidden="true" />
          </Link>
          <a
            href={game.storeUrl}
            target="_blank"
            rel="noreferrer"
            className={buttonClasses({ variant: "secondary", size: "sm" })}
          >
            {current ? "Claim on Epic" : "Preview on Epic"}
            <ArrowUpRight className="size-3.5" aria-hidden="true" />
          </a>
        </div>
      </div>
    </article>
  );
}

function SteamWeeklyRow({ game }: { game: StoreGame }) {
  return (
    <Link
      href={`/games/${game.slug}/`}
      prefetch={false}
      className="focus-ring group flex items-center gap-3 rounded-xl border border-line bg-surface p-2.5 transition-colors hover:border-white/25 hover:bg-surface-2"
    >
      <div className="relative h-14 w-24 shrink-0 overflow-hidden rounded-lg bg-surface-2">
        <img
          src={game.cardImage}
          alt=""
          width={192}
          height={108}
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
          {game.genres.slice(0, 2).join(" · ") || game.developers.slice(0, 1).join("") || "Steam"}
        </p>
      </div>
      <StorePrice game={game} className="shrink-0 text-right" />
    </Link>
  );
}

export function WeeklyDropsSection({
  current,
  upcoming,
  steamDeals,
  steamEndsAt,
}: {
  current: StoreGame[];
  upcoming: StoreGame[];
  steamDeals: StoreGame[];
  steamEndsAt: string | null;
}) {
  // Epic can list more than one upcoming week, so render every current and
  // upcoming freebie instead of assuming a single pair.
  const epicGames = [...current, ...upcoming];
  const weeklyDeals = steamDeals.slice(0, 6);
  if (epicGames.length === 0 && weeklyDeals.length === 0) return null;

  return (
    <section aria-labelledby="weekly" className="shell mt-20">
      <SectionHeading
        id="weekly"
        title="Weekly drops"
        subtitle="Epic's free games and Steam's weeklong deals, refreshed every week."
      />

      <div className="mt-8 grid gap-6 xl:grid-cols-[1.05fr_1fr]">
        {epicGames.length > 0 ? (
          <div>
            <div className="flex flex-wrap items-end justify-between gap-2">
              <div>
                <h3 className="font-display text-lg font-semibold">Free on Epic</h3>
                <p className="text-xs text-muted">New free game every Thursday</p>
              </div>
              <a
                href="https://store.epicgames.com/en-US/free-games"
                target="_blank"
                rel="noreferrer"
                className="focus-ring inline-flex items-center gap-1.5 rounded text-xs font-semibold text-muted transition-colors hover:text-text"
              >
                All free games
                <ArrowUpRight className="size-3.5" aria-hidden="true" />
              </a>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {epicGames.map((game) => (
                <EpicFreeCard key={game.slug} game={game} />
              ))}
            </div>
          </div>
        ) : null}

        {weeklyDeals.length > 0 ? (
          <div>
            <div className="flex flex-wrap items-end justify-between gap-2">
              <div>
                <h3 className="font-display text-lg font-semibold">Steam weeklong deals</h3>
                <p className="text-xs text-muted">
                  {steamEndsAt ? (
                    <Countdown target={steamEndsAt} fallback={`Ends ${formatDate(steamEndsAt)}`} />
                  ) : (
                    "Refreshes every Monday"
                  )}
                </p>
              </div>
              <a
                href="https://store.steampowered.com/search/?filter=weeklongdeals"
                target="_blank"
                rel="noreferrer"
                className="focus-ring inline-flex items-center gap-1.5 rounded text-xs font-semibold text-muted transition-colors hover:text-text"
              >
                All weeklong deals
                <ArrowUpRight className="size-3.5" aria-hidden="true" />
              </a>
            </div>
            <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-1">
              {weeklyDeals.map((game) => (
                <SteamWeeklyRow key={game.slug} game={game} />
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
