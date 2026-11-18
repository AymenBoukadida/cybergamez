import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { buttonClasses } from "./Button";
import { ResponsiveImage } from "./ResponsiveImage";

export function Hero() {
  return (
    <section className="shell grid items-center gap-10 pb-4 pt-10 lg:grid-cols-[1fr_1.4fr] lg:gap-14 lg:pt-20">
      <div className="max-w-xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">Featured title</p>
        <h1 className="mt-4 text-[clamp(2.5rem,6vw,4.5rem)] font-bold leading-[0.95] tracking-tight">
          City of the Future
        </h1>
        <p className="mt-5 max-w-md text-base leading-relaxed text-muted">
          A neon-soaked open world where every upgrade, alliance and shortcut is yours to choose.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-5">
          <Link href="#new" className={buttonClasses()}>
            Explore the library
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
          <Link
            href="#trending"
            className="focus-ring rounded text-sm font-semibold text-text underline-offset-4 transition-colors hover:text-brand hover:underline"
          >
            See what&apos;s trending
          </Link>
        </div>
      </div>

      <div className="order-first lg:order-none">
        <div className="relative aspect-video overflow-hidden rounded-2xl border border-line shadow-[0_0_90px_-30px_rgba(255,77,94,0.55)]">
          <ResponsiveImage
            name="hero-cyberpunk"
            widths={[960, 1600]}
            sizes="(min-width: 1024px) 58vw, 100vw"
            alt="Neon city street from Cyberpunk 2077 key art"
            width={1600}
            height={900}
            priority
            className="h-full w-full object-cover"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/45 via-transparent to-transparent" />
        </div>
      </div>
    </section>
  );
}
