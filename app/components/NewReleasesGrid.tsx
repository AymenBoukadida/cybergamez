import type { StoreGame } from "@/app/data/live";
import { GameCard } from "./GameCard";
import { SectionHeading } from "./SectionHeading";

export function NewReleasesGrid({ games }: { games: StoreGame[] }) {
  if (games.length === 0) return null;

  return (
    <section aria-labelledby="new" className="shell mt-24">
      <SectionHeading
        id="new"
        title="New releases"
        subtitle="Fresh arrivals on Steam, sorted by what just launched."
      />
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {games.map((game) => (
          <GameCard key={game.slug} game={game} />
        ))}
      </div>
    </section>
  );
}
