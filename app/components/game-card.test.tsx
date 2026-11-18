import { render, screen } from "@testing-library/react";
import { allGames, trendingGames } from "@/app/data/games";
import { GameCard } from "./GameCard";

it("links the whole card to the detail page and names the game", () => {
  render(<GameCard game={trendingGames[0]} />);
  const link = screen.getByRole("link", { name: /Cyberpunk 2077/i });
  expect(link).toHaveAttribute("href", "/download/");
  expect(screen.getByText("Action")).toBeInTheDocument();
});

it("keeps the longest title intact in the DOM", () => {
  const longest = allGames.find((g) => g.slug === "marvel-contest-of-champions")!;
  render(<GameCard game={longest} />);
  expect(screen.getByText("Marvel: Contest of Champions")).toBeInTheDocument();
});
