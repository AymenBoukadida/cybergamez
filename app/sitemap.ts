import type { MetadataRoute } from "next";
import { live } from "./data/live";

const site = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
const basePath = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/$/, "");
const root = `${site}${basePath}`;

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date(live.syncedAt);

  return [
    {
      url: `${root}/`,
      lastModified,
      changeFrequency: "daily",
      priority: 1,
    },
    ...live.games.map((game) => ({
      url: `${root}/games/${game.slug}/`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
