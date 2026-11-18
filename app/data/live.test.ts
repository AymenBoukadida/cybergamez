import {
  currentFreebies,
  featuredGame,
  formatDate,
  getGame,
  live,
  trendingGames,
  upcomingFreebies,
} from "./live";

it("resolves every section slug to a game", () => {
  const slugs = [
    ...live.trending,
    ...live.newReleases,
    ...live.deals,
    ...live.freebies.current,
    ...live.freebies.upcoming,
  ];
  for (const slug of slugs) {
    expect(getGame(slug), `missing game for ${slug}`).toBeDefined();
  }
});

it("has a featured game and trending entries", () => {
  expect(featuredGame).not.toBeNull();
  expect(trendingGames.length).toBeGreaterThan(0);
});

it("keeps free offers inside a valid date window", () => {
  for (const game of [...currentFreebies, ...upcomingFreebies]) {
    expect(game.free).not.toBeNull();
    if (!game.free) continue;
    expect(Date.parse(game.free.from)).toBeLessThan(Date.parse(game.free.until));
    expect(game.free.status).toBe(live.freebies.current.includes(game.slug) ? "current" : "upcoming");
  }
});

it("resolves the weekly Steam deals and their reset date", () => {
  expect(live.weekly.steam.deals.length).toBeGreaterThan(0);
  expect(Date.parse(live.weekly.steam.endsAt)).not.toBeNaN();
  for (const slug of live.weekly.steam.deals) {
    expect(getGame(slug), `missing game for ${slug}`).toBeDefined();
  }
});

it("formats dates and rejects invalid ones", () => {
  expect(formatDate("2026-11-18T12:00:00.000Z")).toMatch(/2026/);
  expect(formatDate("not-a-date")).toBe("");
});
