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

it("shows the cheapest store when another store is cheaper", () => {
  const withCheapest = {
    ...game,
    cheapest: {
      store: "GOG",
      priceLabel: "$19.99",
      retailLabel: "$29.99",
      savingsPercent: 33,
      url: "https://www.cheapshark.com/redirect?dealID=test-deal",
    },
  };
  render(<GameCard game={withCheapest} />);
  expect(screen.getByText(/cheaper at GOG: \$19\.99/i)).toBeInTheDocument();
});

it("hides the cheapest line when the listing store is the cheapest store", () => {
  const withCheapest = {
    ...game,
    cheapest: {
      store: game.store === "steam" ? "Steam" : "Epic Games Store",
      priceLabel: "$4.99",
      savingsPercent: 10,
      url: "https://store.steampowered.com/app/1/",
    },
  };
  render(<GameCard game={withCheapest} />);
  expect(screen.queryByText(/cheaper at/i)).not.toBeInTheDocument();
});

it("omits the cheapest line when the game is not tracked", () => {
  render(<GameCard game={{ ...game, cheapest: undefined }} />);
  expect(screen.queryByText(/cheap/i)).not.toBeInTheDocument();
});

it("keeps the longest live title intact in the DOM", () => {
  const longest = [...live.games].sort((a, b) => b.title.length - a.title.length)[0];
  render(<GameCard game={longest} />);
  expect(screen.getByText(longest.title)).toBeInTheDocument();
});
