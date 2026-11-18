import type { Metadata } from "next";
import { DealsStrip } from "./components/DealsStrip";
import { DemoCallout } from "./components/DemoCallout";
import { Hero } from "./components/Hero";
import { NewReleasesGrid } from "./components/NewReleasesGrid";
import { NewsFeed } from "./components/NewsFeed";
import { TrendingRail } from "./components/TrendingRail";
import { WeeklyDropsSection } from "./components/WeeklyDropsSection";
import {
  currentFreebies,
  dealGames,
  featuredGame,
  live,
  newReleaseGames,
  trendingGames,
  upcomingFreebies,
  weeklySteamEndsAt,
  weeklySteamGames,
} from "./data/live";
import { asset } from "./lib/base-path";

const title = "CyberGamez — Live game releases, free games and news";
const description =
  "Trending Steam releases, weekly Epic free games, Steam weeklong deals and fresh gaming headlines, refreshed on every build. Plus a playable Subway Surfers demo with a captioned trailer.";

export const metadata: Metadata = {
  description,
  alternates: { canonical: asset("/") },
  openGraph: {
    type: "website",
    siteName: "CyberGamez",
    locale: "en_US",
    title,
    description,
    url: asset("/"),
    images: featuredGame
      ? [
          {
            url: featuredGame.heroImage,
            alt: `Key art for ${featuredGame.title}`,
          },
        ]
      : undefined,
  },
  twitter: {
    title,
    description,
    images: featuredGame ? [featuredGame.heroImage] : undefined,
  },
};

export default function HomePage() {
  return (
    <main id="main">
      {featuredGame ? <Hero game={featuredGame} /> : null}
      <WeeklyDropsSection
        current={currentFreebies}
        upcoming={upcomingFreebies}
        steamDeals={weeklySteamGames}
        steamEndsAt={weeklySteamEndsAt}
      />
      <TrendingRail games={trendingGames} />
      <NewReleasesGrid games={newReleaseGames} />
      <DealsStrip games={dealGames} />
      <NewsFeed items={live.news} />
      <DemoCallout />
    </main>
  );
}
