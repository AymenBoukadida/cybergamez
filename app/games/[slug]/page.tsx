import {
  ArrowRight,
  ArrowUpRight,
  Building2,
  CalendarDays,
  Gamepad2,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/app/components/Breadcrumb";
import { buttonClasses } from "@/app/components/Button";
import { Chip } from "@/app/components/Chip";
import { GameCard } from "@/app/components/GameCard";
import { SectionHeading } from "@/app/components/SectionHeading";
import { StoreBadge, StorePrice, storeLabel } from "@/app/components/StoreMeta";
import type { StoreGame } from "@/app/data/live";
import { formatDate, getGame, live, syncedAt } from "@/app/data/live";
import { asset } from "@/app/lib/base-path";

type PageProps = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return live.games.map((game) => ({ slug: game.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const game = getGame(slug);
  if (!game) return { title: "Game not found" };

  const title = `${game.title} — ${storeLabel(game.store)}`;
  const description = game.description.slice(0, 160);
  const url = asset(`/games/${game.slug}/`);

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      siteName: "CyberGamez",
      locale: "en_US",
      title: `${title} | CyberGamez`,
      description,
      url,
      images: [{ url: game.heroImage, alt: `Key art for ${game.title}` }],
    },
    twitter: {
      title,
      description,
      images: [game.heroImage],
    },
  };
}

function relatedGames(game: StoreGame): StoreGame[] {
  return live.games
    .filter((candidate) => candidate.slug !== game.slug)
    .map((candidate) => ({
      candidate,
      score:
        (candidate.store === game.store ? 2 : 0) +
        candidate.genres.filter((genre) => game.genres.includes(genre)).length,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map(({ candidate }) => candidate);
}

export default async function GamePage({ params }: PageProps) {
  const { slug } = await params;
  const game = getGame(slug);
  if (!game) notFound();

  const screenshots = [game.heroImage, ...game.screenshots.filter((shot) => shot !== game.heroImage)].slice(
    0,
    4,
  );
  const news = live.news.filter((item) => item.gameSlug === game.slug).slice(0, 3);
  const more = relatedGames(game);
  const freeNow = game.free?.status === "current";
  const freeSoon = game.free?.status === "upcoming";
  const cheaperDeal = game.cheapest ?? null;
  const priceCompared = Boolean(game.cheapest || game.priceCompared);

  const facts: { label: string; value: string; icon: typeof CalendarDays }[] = [];
  if (game.releaseDate) {
    facts.push({ label: "Release date", value: game.releaseDate, icon: CalendarDays });
  }
  if (game.developers.length > 0) {
    facts.push({ label: "Developer", value: game.developers.join(", "), icon: Building2 });
  }
  facts.push({ label: "Store", value: storeLabel(game.store), icon: Gamepad2 });

  return (
    <main id="main" className="shell pb-8 pt-6">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Games", href: "/#new" },
          { label: game.title },
        ]}
      />

      <header className="mt-6 flex flex-wrap items-start justify-between gap-6">
        <div className="min-w-0 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <StoreBadge store={game.store} />
            {game.free ? (
              <Chip className={freeNow ? "border-ok/40 text-ok" : "border-gold/40 text-gold"}>
                {freeNow ? "Free this week" : "Free next week"}
              </Chip>
            ) : null}
          </div>
          <h1 className="mt-3 text-[clamp(2rem,5vw,3.25rem)] font-bold leading-[1.02] tracking-tight">
            {game.title}
          </h1>
          {game.genres.length > 0 ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {game.genres.slice(0, 4).map((genre) => (
                <Chip key={genre}>{genre}</Chip>
              ))}
            </div>
          ) : null}
        </div>

        <div className="w-full rounded-2xl border border-line bg-surface p-5 sm:w-auto sm:min-w-[300px]">
          <StorePrice game={game} size="lg" />
          {game.free ? (
            <p className="mt-1 text-sm text-muted">
              {freeNow
                ? `Free until ${formatDate(game.free.until)}`
                : `Free from ${formatDate(game.free.from)}`}
            </p>
          ) : game.originalPriceLabel ? (
            <p className="mt-1 text-sm text-muted">
              {game.discountPercent}% off at the moment
            </p>
          ) : (
            <p className="mt-1 text-sm text-muted">Price at the {storeLabel(game.store)} store</p>
          )}

          <a
            href={game.storeUrl}
            target="_blank"
            rel="noreferrer"
            className={`${buttonClasses()} mt-4 w-full`}
          >
            {freeNow ? "Claim on Epic" : freeSoon ? "Preview on Epic" : `Get it on ${storeLabel(game.store)}`}
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </a>

          {priceCompared ? (
            <div className="mt-4 rounded-xl border border-line bg-surface-2 p-3">
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-muted">
                Cheapest right now
              </p>
              {cheaperDeal ? (
                <>
                  <div className="mt-1 flex items-center justify-between gap-3">
                    <p className="text-sm">
                      <span className="font-semibold text-text">{cheaperDeal.priceLabel}</span>
                      <span className="text-muted"> at {cheaperDeal.store}</span>
                      {cheaperDeal.retailLabel ? (
                        <span className="ml-2 text-xs text-muted line-through">
                          {cheaperDeal.retailLabel}
                        </span>
                      ) : null}
                    </p>
                    {cheaperDeal.savingsPercent > 0 ? (
                      <span className="shrink-0 rounded bg-gold/15 px-1.5 py-0.5 text-[0.65rem] font-bold text-gold">
                        -{cheaperDeal.savingsPercent}%
                      </span>
                    ) : null}
                  </div>
                  <a
                    href={cheaperDeal.url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Open the cheapest deal for ${game.title} at ${cheaperDeal.store}`}
                    className="focus-ring mt-2 inline-flex items-center gap-1 text-xs font-semibold text-brand hover:underline"
                  >
                    Open at {cheaperDeal.store}
                    <ArrowUpRight className="size-3.5" aria-hidden="true" />
                  </a>
                </>
              ) : (
                <p className="mt-1 text-sm font-semibold text-ok">
                  Already the lowest tracked price
                </p>
              )}
              <p className="mt-2 text-[0.65rem] text-muted">
                Compared across tracked stores by CheapShark.
              </p>
            </div>
          ) : null}

          <p className="mt-3 text-center text-[0.7rem] text-muted">
            Checked {formatDate(syncedAt.toISOString())} · opens the official store
          </p>
        </div>
      </header>

      <div className="mt-8 overflow-hidden rounded-2xl border border-line bg-surface-2">
        <img
          src={game.heroImage}
          alt={`${game.title} key art`}
          width={1600}
          height={900}
          fetchPriority="high"
          decoding="async"
          className="aspect-video w-full object-cover"
        />
      </div>

      <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
        <div className="min-w-0 space-y-12">
          <section aria-labelledby="about">
            <h2 id="about" className="text-[clamp(1.4rem,3vw,1.9rem)] font-semibold leading-tight">
              About {game.title}
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted">{game.description}</p>

            <dl className="mt-6 grid gap-4 sm:grid-cols-2">
              {facts.map((fact) => (
                <div key={fact.label} className="rounded-xl border border-line bg-surface/60 p-4">
                  <dt className="flex items-center gap-2 text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-muted">
                    <fact.icon className="size-3.5" aria-hidden="true" />
                    {fact.label}
                  </dt>
                  <dd className="mt-1.5 text-sm text-text">{fact.value}</dd>
                </div>
              ))}
            </dl>
          </section>

          {screenshots.length > 1 ? (
            <section aria-labelledby="screenshots">
              <h2 id="screenshots" className="text-[clamp(1.4rem,3vw,1.9rem)] font-semibold leading-tight">
                Screenshots
              </h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {screenshots.map((shot, index) => (
                  <a
                    key={shot}
                    href={shot}
                    target="_blank"
                    rel="noreferrer"
                    className="focus-ring group relative overflow-hidden rounded-xl border border-line bg-surface-2"
                    aria-label={`Open screenshot ${index + 1} of ${game.title} in a new tab`}
                  >
                    <img
                      src={shot}
                      alt={`${game.title} screenshot ${index + 1}`}
                      width={960}
                      height={540}
                      loading="lazy"
                      decoding="async"
                      className="aspect-video w-full object-cover transition-transform duration-300 group-hover:scale-[1.02] motion-reduce:group-hover:scale-100"
                    />
                  </a>
                ))}
              </div>
            </section>
          ) : null}

          {news.length > 0 ? (
            <section aria-labelledby="game-news">
              <h2 id="game-news" className="text-[clamp(1.4rem,3vw,1.9rem)] font-semibold leading-tight">
                Latest updates
              </h2>
              <ul className="mt-4 divide-y divide-line border-y border-line">
                {news.map((item) => (
                  <li key={item.url} className="py-4">
                    <p className="text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-muted">
                      {item.source} · {formatDate(item.publishedAt)}
                    </p>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      className="focus-ring mt-1 inline-flex items-start gap-1.5 rounded text-sm font-semibold leading-snug hover:text-brand"
                    >
                      {item.title}
                      <ArrowUpRight className="mt-0.5 size-3.5 shrink-0 text-muted" aria-hidden="true" />
                    </a>
                    {item.summary ? (
                      <p className="mt-1.5 line-clamp-2 text-sm text-muted">{item.summary}</p>
                    ) : null}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24">
          <div className="rounded-2xl border border-line bg-surface p-5">
            <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-muted">
              Keep browsing
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Every title here has its own page with live price, screenshots and the official store
              link.
            </p>
            <div className="mt-4 flex flex-col gap-2">
              <Link href="/#new" className={buttonClasses({ variant: "secondary", size: "sm" })}>
                New releases
                <ArrowRight className="size-3.5" aria-hidden="true" />
              </Link>
              <Link href="/#free" className={buttonClasses({ variant: "secondary", size: "sm" })}>
                Epic free games
                <ArrowRight className="size-3.5" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </aside>
      </div>

      {more.length > 0 ? (
        <section aria-labelledby="related" className="mt-20">
          <SectionHeading id="related" title="More like this" />
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {more.map((related) => (
              <GameCard key={related.slug} game={related} />
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
