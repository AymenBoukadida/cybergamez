import snapshot from "./live.generated.json";

export type Store = "steam" | "epic";

export type FreeOffer = {
  status: "current" | "upcoming";
  from: string;
  until: string;
};

export type CheapestDeal = {
  store: string;
  priceLabel: string;
  retailLabel?: string;
  savingsPercent: number;
  url: string;
};

export type StoreGame = {
  slug: string;
  store: Store;
  steamAppId: number | null;
  title: string;
  description: string;
  genres: string[];
  releaseDate: string;
  developers: string[];
  storeUrl: string;
  priceLabel: string;
  originalPriceLabel?: string;
  discountPercent: number;
  cardImage: string;
  heroImage: string;
  headerImage: string;
  screenshots: string[];
  free: FreeOffer | null;
  priceCompared?: boolean;
  cheapest?: CheapestDeal;
};

export type NewsItem = {
  title: string;
  url: string;
  publishedAt: string;
  source: string;
  summary: string;
  gameSlug: string | null;
  gameTitle: string | null;
};

export type WeeklySteam = {
  deals: string[];
  endsAt: string;
};

export type LiveSnapshot = {
  syncedAt: string;
  source: string;
  featured: string | null;
  trending: string[];
  newReleases: string[];
  deals: string[];
  freebies: { current: string[]; upcoming: string[] };
  weekly: {
    steam: WeeklySteam;
  };
  news: NewsItem[];
  games: StoreGame[];
};

const data = snapshot as LiveSnapshot;

export const live = data;

export const gamesBySlug = new Map(data.games.map((game) => [game.slug, game]));

export function getGame(slug: string | null | undefined): StoreGame | undefined {
  return slug ? gamesBySlug.get(slug) : undefined;
}

export function gamesFromSlugs(slugs: string[]): StoreGame[] {
  return slugs.map((slug) => gamesBySlug.get(slug)).filter((game): game is StoreGame => Boolean(game));
}

export const featuredGame = getGame(data.featured) ?? data.games[0] ?? null;
export const trendingGames = gamesFromSlugs(data.trending);
export const newReleaseGames = gamesFromSlugs(data.newReleases);
export const dealGames = gamesFromSlugs(data.deals);
export const currentFreebies = gamesFromSlugs(data.freebies.current);
export const upcomingFreebies = gamesFromSlugs(data.freebies.upcoming);
export const weeklySteamGames = gamesFromSlugs(data.weekly?.steam?.deals ?? []);
export const weeklySteamEndsAt = data.weekly?.steam?.endsAt ?? null;

export const syncedAt = new Date(data.syncedAt);

export function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.valueOf())) return "";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}
