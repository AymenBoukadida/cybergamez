import type { Metadata } from "next";
import { CARD_WIDTHS, subwaySurfers } from "@/app/data/games";
import { Breadcrumb } from "@/app/components/Breadcrumb";
import { Chip } from "@/app/components/Chip";
import { DownloadPanel } from "@/app/components/DownloadPanel";
import { FeatureList } from "@/app/components/FeatureList";
import { Rating } from "@/app/components/Rating";
import { ResponsiveImage } from "@/app/components/ResponsiveImage";
import { ScreenshotGallery } from "@/app/components/ScreenshotGallery";
import { Trailer } from "@/app/components/Trailer";
import { asset } from "@/app/lib/base-path";

const description =
  "Download the Subway Surfers demo APK for Android, watch the captioned trailer and read the transcript. iOS and Windows builds are not included.";

export const metadata: Metadata = {
  title: "Subway Surfers — Download",
  description,
  alternates: { canonical: asset("/download/") },
  openGraph: {
    type: "website",
    siteName: "CyberGamez",
    locale: "en_US",
    title: "Subway Surfers — Download | CyberGamez",
    description,
    url: asset("/download/"),
    images: [
      {
        url: asset("/img/opt/og-subway.jpg"),
        width: 1200,
        height: 630,
        alt: "Subway Surfers key art",
      },
    ],
  },
  twitter: {
    title: "Subway Surfers — Download | CyberGamez",
    description,
    images: [asset("/img/opt/og-subway.jpg")],
  },
};

export default function DownloadPage() {
  const game = subwaySurfers;

  return (
    <main id="main" className="shell pb-8 pt-6">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Games", href: "/#new" },
          { label: game.title },
        ]}
      />

      <header className="mt-6 flex flex-wrap items-center gap-5">
        <div className="w-24 shrink-0 overflow-hidden rounded-xl border border-line">
          <ResponsiveImage
            name="subway-surfers"
            widths={CARD_WIDTHS}
            sizes="96px"
            alt={game.title + " cover art"}
            width={96}
            height={128}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="min-w-0 flex-1">
          <h1 className="text-[clamp(2rem,5vw,3rem)] font-bold leading-[1.05] tracking-tight">
            {game.title}
          </h1>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {game.genres.map((genre) => (
              <Chip key={genre}>{genre}</Chip>
            ))}
            <Chip>
              <Rating value={game.rating} className="text-xs" />
            </Chip>
            <Chip>Demo build · {game.file.size}</Chip>
          </div>
        </div>
      </header>

      <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
        <aside className="lg:order-2 lg:sticky lg:top-24">
          <DownloadPanel />
        </aside>

        <div className="min-w-0 space-y-12 lg:order-1">
          <Trailer />

          <section aria-labelledby="about">
            <h2 id="about" className="text-[clamp(1.5rem,3vw,2rem)] font-semibold leading-tight">
              About the game
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted">{game.about}</p>
            <div className="mt-6">
              <FeatureList items={game.features} />
            </div>
          </section>

          <ScreenshotGallery shots={game.screenshots} />
        </div>
      </div>
    </main>
  );
}
