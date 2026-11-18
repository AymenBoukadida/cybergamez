import { ChevronDown } from "lucide-react";
import { subwaySurfers } from "@/app/data/games";
import { asset } from "@/app/lib/base-path";

export function Trailer() {
  const { trailer, transcript } = subwaySurfers;

  return (
    <section aria-labelledby="trailer">
      <h2 id="trailer" className="text-[clamp(1.5rem,3vw,2rem)] font-semibold leading-tight">
        Trailer
      </h2>

      <div className="mt-4 aspect-video overflow-hidden rounded-2xl border border-line bg-black">
        <video
          controls
          preload="none"
          poster={asset("/img/opt/subway-trailer-poster-960.webp")}
          className="h-full w-full"
        >
          <source src={asset(trailer.src)} type="video/mp4" />
          <track
            kind="captions"
            src={asset(trailer.captions)}
            srcLang="en"
            label="English"
            default
          />
          Your browser does not support the video tag.
        </video>
      </div>

      <details className="group mt-4 rounded-2xl border border-line bg-surface">
        <summary className="focus-ring flex cursor-pointer list-none items-center justify-between gap-3 rounded-2xl px-5 py-4 text-sm font-semibold [&::-webkit-details-marker]:hidden">
          Read transcript
          <ChevronDown
            className="size-4 shrink-0 text-muted transition-transform duration-200 group-open:rotate-180 motion-reduce:transition-none"
            aria-hidden="true"
          />
        </summary>
        <ol className="space-y-3 border-t border-line px-5 py-4 text-sm">
          {transcript.map((cue) => (
            <li key={cue.start} className="flex flex-wrap gap-x-4 gap-y-1">
              <span className="w-28 shrink-0 text-xs tabular-nums text-muted">
                {cue.start}–{cue.end}
              </span>
              <span className="min-w-0 flex-1 whitespace-pre-line text-muted">{cue.text}</span>
            </li>
          ))}
        </ol>
      </details>
    </section>
  );
}
