import { render, screen } from "@testing-library/react";
import { trendingGames } from "@/app/data/live";
import { TrendingRail } from "./TrendingRail";

it("renders every trending title and the navigation controls", () => {
  render(<TrendingRail games={trendingGames} />);
  for (const game of trendingGames) {
    expect(screen.getByText(game.title)).toBeInTheDocument();
  }
  expect(screen.getByRole("button", { name: /previous/i })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /next/i })).toBeInTheDocument();
});
