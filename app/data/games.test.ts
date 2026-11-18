import { subwaySurfers } from "./games";
import { live } from "./live";

it("keeps the Subway Surfers demo downloadable", () => {
  expect(subwaySurfers.file.href).toBe("/download-files/subway-surfers-demo.apk");
  expect(subwaySurfers.file.size).toBe("768 KB");
  expect(subwaySurfers.transcript.length).toBeGreaterThan(0);
});

it("uses unique slugs across every live game", () => {
  expect(new Set(live.games.map((game) => game.slug)).size).toBe(live.games.length);
});

it("gives every live game a title, artwork and store link", () => {
  for (const game of live.games) {
    expect(game.title.length).toBeGreaterThan(0);
    expect(game.cardImage).toMatch(/^https:\/\//);
    expect(game.heroImage).toMatch(/^https:\/\//);
    expect(game.storeUrl).toMatch(/^https:\/\//);
  }
});
