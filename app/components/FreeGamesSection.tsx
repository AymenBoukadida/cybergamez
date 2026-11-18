import { ArrowRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type { StoreGame } from "@/app/data/live";
import { formatDate } from "@/app/data/live";
import { buttonClasses } from "./Button";
import { FreeCountdown } from "./FreeCountdown";
import { SectionHeading } from "./SectionHeading";

function FreeCard({ game }: { game: StoreGame }) {
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
          <span aria-hidden="true" className={current ? "size-1.5 rounded-full bg-ok" : "size-1.5 rounded-full bg-gold"} />
          <span className={current ? "text-ok" : "text-gold"}>
            {current ? "Free now" : "Free next week"}
          </span>
        </p>

        <h3 className="font-display text-lg font-semibold leading-snug">
          <Link
            href={`/games/${game.slug}/`}
            prefetch={false}
            className="focus-ring rounded hover:text-brand"
          >
            {game.title}
          </Link>
        </h3>

        <p className="line-clamp-2 text-sm leading-relaxed text-muted">{game.description}</p>

        <p className="mt-1 text-xs text-muted">
          <FreeCountdown
            from={offer.from}
            until={offer.until}
            status={offer.status}
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

export function FreeGamesSection({
  current,
  upcoming,
}: {
  current: StoreGame[];
  upcoming: StoreGame[];
}) {
  if (current.length === 0 && upcoming.length === 0) return null;

  return (
    <section aria-labelledby="free" className="shell mt-20">
      <SectionHeading
        id="free"
        title="Free on Epic Games"
        subtitle="Claim once and keep forever. Countdowns use your local clock."
        action={
          <a
            href="https://store.epicgames.com/en-US/free-games"
            target="_blank"
            rel="noreferrer"
            className="focus-ring inline-flex items-center gap-1.5 rounded text-sm font-semibold text-muted transition-colors hover:text-text"
          >
            All free games
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </a>
        }
      />

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        {[...current, ...upcoming].slice(0, 4).map((game) => (
          <FreeCard key={game.slug} game={game} />
        ))}
      </div>
    </section>
  );
}
