import { render, screen } from "@testing-library/react";
import {
  currentFreebies,
  upcomingFreebies,
  weeklySteamEndsAt,
  weeklySteamGames,
} from "@/app/data/live";
import { WeeklyDropsSection } from "./WeeklyDropsSection";

function renderSection() {
  return render(
    <WeeklyDropsSection
      current={currentFreebies}
      upcoming={upcomingFreebies}
      steamDeals={weeklySteamGames}
      steamEndsAt={weeklySteamEndsAt}
    />,
  );
}

it("features Epic freebies and Steam weeklong deals together", () => {
  renderSection();

  expect(screen.getByRole("heading", { name: "Weekly drops" })).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "Free on Epic" })).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "Steam weeklong deals" })).toBeInTheDocument();

  for (const game of [...currentFreebies, ...upcomingFreebies]) {
    expect(screen.getAllByText(game.title).length).toBeGreaterThan(0);
  }
  for (const game of weeklySteamGames.slice(0, 6)) {
    expect(screen.getAllByText(game.title).length).toBeGreaterThan(0);
  }
});

it("links each weekly Steam deal to its own game page", () => {
  renderSection();

  const game = weeklySteamGames[0];
  const link = screen.getAllByRole("link", { name: new RegExp(game.title, "i") })[0];
  expect(link).toHaveAttribute("href", `/games/${game.slug}/`);
});
