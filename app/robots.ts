import type { MetadataRoute } from "next";
import { siteUrl } from "./lib/site-url";

const site = siteUrl;
const basePath = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/$/, "");
const root = `${site}${basePath}`;

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${root}/sitemap.xml`,
  };
}
