import { allGames, newGames, subwaySurfers, trendingGames } from "./games";

it("has eight trending and eight new games", () => {
  expect(trendingGames).toHaveLength(8);
  expect(newGames).toHaveLength(8);
  expect(allGames).toHaveLength(16);
});

it("uses unique slugs and complete art metadata", () => {
  expect(new Set(allGames.map((g) => g.slug)).size).toBe(16);
  for (const game of allGames) {
    expect(game.art.name).toMatch(/^[a-z0-9-]+$/);
    expect(game.art.alt).toContain(game.title);
    expect(game.rating).toBeGreaterThanOrEqual(4);
    expect(game.rating).toBeLessThanOrEqual(5);
  }
});

it("fixes the Halo title and keeps Subway Surfers downloadable", () => {
  expect(allGames.some((g) => g.title === "Halo Infinite")).toBe(true);
  expect(subwaySurfers.file.href).toBe("/download-files/subway-surfers-demo.apk");
  expect(subwaySurfers.file.size).toBe("768 KB");
});
