import { render, screen } from "@testing-library/react";
import { live } from "@/app/data/live";
import { GameCard } from "./GameCard";

const game = live.games[0];

it("links each card to its own live game page", () => {
  render(<GameCard game={game} />);
  const link = screen.getByRole("link", { name: new RegExp(game.title, "i") });
  expect(link).toHaveAttribute("href", `/games/${game.slug}/`);
  expect(screen.getAllByText(game.priceLabel).length).toBeGreaterThan(0);
});

it("shows the store the game comes from", () => {
  render(<GameCard game={game} />);
  expect(screen.getByText(game.store === "steam" ? "Steam" : "Epic Games")).toBeInTheDocument();
});

it("keeps the longest live title intact in the DOM", () => {
  const longest = [...live.games].sort((a, b) => b.title.length - a.title.length)[0];
  render(<GameCard game={longest} />);
  expect(screen.getByText(longest.title)).toBeInTheDocument();
});
