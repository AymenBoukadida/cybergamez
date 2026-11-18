import { ArrowUpRight, Rss } from "lucide-react";
import Link from "next/link";
import type { NewsItem } from "@/app/data/live";
import { formatDate, syncedAt } from "@/app/data/live";
import { SectionHeading } from "./SectionHeading";

export function NewsFeed({ items }: { items: NewsItem[] }) {
  if (items.length === 0) return null;

  return (
    <section aria-labelledby="news" className="shell mt-24">
      <SectionHeading
        id="news"
        title="Gaming news"
        subtitle="Patch notes, launches and studio updates pulled from Steam."
      />

      <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <ul className="divide-y divide-line border-y border-line">
          {items.slice(0, 6).map((item) => (
            <li key={item.url} className="py-5">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.7rem] font-semibold uppercase tracking-[0.12em]">
                <span className="text-brand">{item.source}</span>
                <time dateTime={item.publishedAt} className="text-muted">
                  {formatDate(item.publishedAt)}
                </time>
              </div>

              <h3 className="mt-2 text-base font-semibold leading-snug">
                <a
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  className="focus-ring group inline-flex items-start gap-1.5 rounded hover:text-brand"
                >
                  {item.title}
                  <ArrowUpRight
                    className="mt-1 size-3.5 shrink-0 text-muted transition-colors group-hover:text-brand"
                    aria-hidden="true"
                  />
                </a>
              </h3>

              {item.summary ? (
                <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">{item.summary}</p>
              ) : null}

              {item.gameSlug ? (
                <Link
                  href={`/games/${item.gameSlug}/`}
                  prefetch={false}
                  className="focus-ring mt-2 inline-block rounded text-xs font-semibold text-text underline-offset-4 hover:text-brand hover:underline"
                >
                  More on {item.gameTitle ?? "this game"}
                </Link>
              ) : null}
            </li>
          ))}
        </ul>

        <aside className="h-fit rounded-2xl border border-line bg-surface p-6">
          <span className="grid size-10 place-items-center rounded-xl bg-brand/15 text-brand">
            <Rss className="size-5" aria-hidden="true" />
          </span>
          <h3 className="mt-4 font-display text-lg font-semibold">Where this comes from</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Headlines are read from the public Steam News API and Epic Games Store promo feed
            during the build. The site ships as flat HTML, so there is no tracking script and no
            API key involved.
          </p>
          <p className="mt-4 text-xs text-muted">
            Last sync {formatDate(syncedAt.toISOString())} · {items.length} stories
          </p>
          <div className="mt-5 flex flex-col gap-2 border-t border-line pt-4 text-sm">
            <a
              href="https://store.steampowered.com/news/"
              target="_blank"
              rel="noreferrer"
              className="focus-ring inline-flex items-center gap-1.5 rounded font-semibold text-text transition-colors hover:text-brand"
            >
              Steam news hub
              <ArrowUpRight className="size-3.5" aria-hidden="true" />
            </a>
            <a
              href="https://store.epicgames.com/en-US/free-games"
              target="_blank"
              rel="noreferrer"
              className="focus-ring inline-flex items-center gap-1.5 rounded font-semibold text-text transition-colors hover:text-brand"
            >
              Epic free games
              <ArrowUpRight className="size-3.5" aria-hidden="true" />
            </a>
          </div>
        </aside>
      </div>
    </section>
  );
}
