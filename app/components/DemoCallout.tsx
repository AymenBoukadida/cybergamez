import { ArrowRight, Download } from "lucide-react";
import Link from "next/link";
import { buttonClasses } from "./Button";
import { ResponsiveImage } from "./ResponsiveImage";

export function DemoCallout() {
  return (
    <section aria-labelledby="demo" className="shell mt-24">
      <div className="relative overflow-hidden rounded-3xl border border-line bg-surface">
        <div className="pointer-events-none absolute -right-24 -top-24 size-64 rounded-full bg-brand/15 blur-3xl" />
        <div className="relative grid gap-8 p-7 sm:p-10 md:grid-cols-[1fr_auto] md:items-center">
          <div className="flex items-start gap-5">
            <div className="hidden w-24 shrink-0 overflow-hidden rounded-xl border border-line sm:block">
              <ResponsiveImage
                name="subway-surfers"
                widths={[320]}
                sizes="96px"
                alt="Subway Surfers cover art"
                width={96}
                height={128}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="max-w-xl">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
                Playable demo
              </p>
              <h2 id="demo" className="mt-2 text-[clamp(1.6rem,3.4vw,2.4rem)] font-semibold leading-tight">
                Subway Surfers, with a captioned trailer
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                Browse screenshots, read the full trailer transcript and grab the lightweight
                Android APK. It is the one local build on the site; everything else links to its
                official store page.
              </p>
            </div>
          </div>

          <Link href="/download/" prefetch={false} className={buttonClasses()}>
            <Download className="size-4" aria-hidden="true" />
            Open the demo
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
