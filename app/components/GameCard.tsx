import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type { Game } from "@/app/data/games";
import { CARD_WIDTHS } from "@/app/data/games";
import { Rating } from "./Rating";
import { ResponsiveImage } from "./ResponsiveImage";

export function GameCard({ game }: { game: Game }) {
  return (
    <Link
      href="/download/"
      className="focus-ring group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-surface transition-[transform,border-color,box-shadow] duration-200 hover:-translate-y-1 hover:border-white/25 hover:shadow-[0_18px_40px_-24px_rgba(0,0,0,0.9)] motion-reduce:hover:translate-y-0"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-surface-2">
        <ResponsiveImage
          name={game.art.name}
          widths={CARD_WIDTHS}
          sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw"
          alt={game.art.alt}
          width={480}
          height={640}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03] motion-reduce:group-hover:scale-100"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/10 to-transparent" />
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="font-display line-clamp-2 break-words text-base font-semibold leading-snug">
          {game.title}
        </h3>
        <p className="line-clamp-1 text-sm text-muted">{game.genres.join(", ")}</p>
        <div className="mt-auto flex items-center justify-between pt-2">
          <Rating value={game.rating} />
          <ArrowUpRight
            className="size-4 text-muted transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand motion-reduce:group-hover:translate-x-0 motion-reduce:group-hover:translate-y-0"
            aria-hidden="true"
          />
        </div>
      </div>
    </Link>
  );
}
