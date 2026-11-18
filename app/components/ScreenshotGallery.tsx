"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useRef, useState } from "react";
import { asset } from "@/app/lib/base-path";
import { Button } from "./Button";
import { ResponsiveImage } from "./ResponsiveImage";

export function ScreenshotGallery({
  shots,
}: {
  shots: { name: string; alt: string }[];
}) {
  const [index, setIndex] = useState<number | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const total = shots.length;
  const current = index === null ? null : shots[index];

  const move = (delta: number) => {
    setIndex((value) => {
      if (value === null) return value;
      return Math.min(total - 1, Math.max(0, value + delta));
    });
  };

  return (
    <section aria-labelledby="screenshots">
      <h2 id="screenshots" className="text-[clamp(1.5rem,3vw,2rem)] font-semibold leading-tight">
        Screenshots
      </h2>

      <ul className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
        {shots.map((shot, shotIndex) => (
          <li key={shot.name}>
            <button
              type="button"
              aria-label={`View screenshot ${shotIndex + 1}: ${shot.alt}`}
              onClick={(event) => {
                triggerRef.current = event.currentTarget;
                setIndex(shotIndex);
              }}
              className="focus-ring group relative block aspect-[3/4] w-full overflow-hidden rounded-xl border border-line bg-surface-2"
            >
              <ResponsiveImage
                name={shot.name}
                widths={[640, 960]}
                sizes="(min-width: 640px) 33vw, 50vw"
                alt={shot.alt}
                width={640}
                height={960}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02] motion-reduce:group-hover:scale-100"
              />
              <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/40 via-transparent to-transparent" />
            </button>
          </li>
        ))}
      </ul>

      <Dialog.Root
        open={index !== null}
        onOpenChange={(next) => {
          if (!next) setIndex(null);
        }}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="lightbox-overlay fixed inset-0 z-50 bg-ink/85 backdrop-blur-sm" />
          <Dialog.Content
            onCloseAutoFocus={(event) => {
              event.preventDefault();
              triggerRef.current?.focus();
            }}
            onKeyDown={(event) => {
              if (event.key === "ArrowRight") {
                event.preventDefault();
                move(1);
              }
              if (event.key === "ArrowLeft") {
                event.preventDefault();
                move(-1);
              }
            }}
            className="lightbox-content fixed left-1/2 top-1/2 z-50 w-[min(92vw,720px)] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-line bg-surface p-4 shadow-2xl sm:p-5"
          >
            <div className="flex items-center justify-between gap-4">
              <Dialog.Title className="font-display text-base font-semibold">
                Subway Surfers screenshots
              </Dialog.Title>
              <Dialog.Close
                aria-label="Close screenshot"
                className="focus-ring grid size-9 place-items-center rounded-lg text-muted transition-colors hover:text-text"
              >
                <X className="size-5" aria-hidden="true" />
              </Dialog.Close>
            </div>
            <Dialog.Description className="sr-only">
              {index === null ? "" : `${index + 1} of ${total}`}
            </Dialog.Description>

            <div className="mt-3 overflow-hidden rounded-xl bg-surface-2">
              {current ? (
                <img
                  src={asset(`/img/opt/${current.name}-960.webp`)}
                  alt={current.alt}
                  width={960}
                  height={2080}
                  className="mx-auto max-h-[70vh] w-auto"
                  decoding="async"
                />
              ) : null}
            </div>

            <div className="mt-3 flex items-center justify-between gap-3">
              <Button
                variant="secondary"
                size="sm"
                aria-label="Previous screenshot"
                disabled={index === 0}
                onClick={() => move(-1)}
              >
                <ChevronLeft className="size-4" aria-hidden="true" />
              </Button>
              <p aria-live="polite" className="text-sm tabular-nums text-muted">
                {index === null ? "" : index + 1} / {total}
              </p>
              <Button
                variant="secondary"
                size="sm"
                aria-label="Next screenshot"
                disabled={index === total - 1}
                onClick={() => move(1)}
              >
                <ChevronRight className="size-4" aria-hidden="true" />
              </Button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </section>
  );
}
