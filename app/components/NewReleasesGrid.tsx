import { newGames } from "@/app/data/games";
import { GameCard } from "./GameCard";
import { SectionHeading } from "./SectionHeading";

export function NewReleasesGrid() {
  return (
    <section aria-labelledby="new" className="shell mt-24">
      <SectionHeading
        id="new"
        title="New releases"
        subtitle="The latest additions to the demo library."
      />
      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
        {newGames.map((game) => (
          <GameCard key={game.slug} game={game} />
        ))}
      </div>
    </section>
  );
}
