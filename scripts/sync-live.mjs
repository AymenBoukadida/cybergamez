// Build-time sync for Steam and Epic Games Store data.
// Run with `npm run sync`. `--allow-stale` keeps the previous snapshot if a
// network call fails so an offline build does not break.

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { validateSnapshot } from "./snapshot-validation.mjs";

const OUT_FILE = path.join("app", "data", "live.generated.json");
const allowStale = process.argv.includes("--allow-stale");
const USER_AGENT = "CyberGamez/1.0 (+https://github.com/AymenBoukadida/cybergamez)";
const PACIFIC_TIME_ZONE = "America/Los_Angeles";
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const now = new Date();

function log(message) {
  console.log(`[sync] ${message}`);
}

async function getJson(url, attempts = 3) {
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await fetch(url, {
        headers: { "user-agent": USER_AGENT, accept: "application/json" },
        signal: AbortSignal.timeout(25000),
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status} for ${url}`);
      }
      return await response.json();
    } catch (error) {
      lastError = error;
      if (attempt < attempts) {
        await new Promise((resolve) => setTimeout(resolve, 500 * attempt));
      }
    }
  }
  throw lastError;
}

function decodeEntities(value) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ");
}

function stripMarkup(value) {
  return decodeEntities(
    value
      .replace(/\[img\][\s\S]*?\[\/img\]/gi, " ")
      .replace(/\[url=[^\]]*\]([\s\S]*?)\[\/url\]/gi, "$1")
      .replace(/\[\/?[^\]]+\]/g, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim(),
  );
}

function truncate(value, length = 220) {
  if (value.length <= length) return value;
  const cut = value.slice(0, length);
  const lastSpace = cut.lastIndexOf(" ");
  return `${cut.slice(0, lastSpace > 100 ? lastSpace : length).trim()}…`;
}

function slugify(value) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 72) || "game";
}

function priceLabel(price) {
  if (!price) return null;
  if (price.final_formatted) return price.final_formatted;
  if (typeof price.final === "number") {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: price.currency || "USD",
    }).format(price.final / 100);
  }
  return null;
}

async function getSteamDetails(appid) {
  const data = await getJson(
    `https://store.steampowered.com/api/appdetails?appids=${appid}&cc=us&l=en`,
  );
  return data?.[String(appid)]?.success ? data[String(appid)].data : null;
}

async function getWeeklongAppIds(limit = 24) {
  const data = await getJson(
    `https://store.steampowered.com/search/results/?query&start=0&count=${limit}&sort_by=Discount&filter=weeklongdeals&cc=us&l=en&infinite=1`,
  );
  const html = data?.results_html ?? "";
  const ids = [];
  for (const match of html.matchAll(/data-ds-appid="([\d,]+)"/g)) {
    for (const value of match[1].split(",")) {
      const appid = Number(value);
      if (Number.isInteger(appid) && appid > 0) ids.push(appid);
    }
  }
  return [...new Set(ids)].slice(0, limit);
}

function pacificParts(date) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: PACIFIC_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    weekday: "short",
    hour12: false,
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return {
    year: Number(values.year),
    month: Number(values.month),
    day: Number(values.day),
    hour: Number(values.hour) % 24,
    minute: Number(values.minute),
    second: Number(values.second),
    weekday: values.weekday,
  };
}

function nextWeeklongEnd(date) {
  const current = pacificParts(date);
  let daysAhead = (1 - WEEKDAYS.indexOf(current.weekday) + 7) % 7;
  const passedReset = current.hour >= 10;
  if (daysAhead === 0 && passedReset) daysAhead = 7;

  const wallClock = Date.UTC(current.year, current.month - 1, current.day + daysAhead, 10, 0, 0);
  const rendered = pacificParts(new Date(wallClock));
  const renderedAsUtc = Date.UTC(
    rendered.year,
    rendered.month - 1,
    rendered.day,
    rendered.hour,
    rendered.minute,
    rendered.second,
  );
  return new Date(wallClock - (renderedAsUtc - wallClock));
}

function steamGame(appid, item, details, usedSlugs) {
  if (!details || details.type !== "game") return null;

  const title = details.name || item.name;
  if (!title) return null;

  let slug = slugify(title);
  if (usedSlugs.has(slug)) slug = `${slug}-${appid}`;
  usedSlugs.add(slug);

  const genres = (details.genres ?? [])
    .map((genre) => genre.description)
    .filter(Boolean)
    .slice(0, 3);

  const price = details.price_overview ?? null;
  const label = details.is_free
    ? "Free to play"
    : priceLabel(price) ?? (item.final_price === 0 ? "Free" : "See price on Steam");

  return {
    slug,
    store: "steam",
    steamAppId: appid,
    title,
    description: details.short_description || `${title} on Steam.`,
    genres,
    releaseDate: details.release_date?.date || "",
    developers: details.developers ?? [],
    storeUrl: `https://store.steampowered.com/app/${appid}/`,
    priceLabel: label,
    originalPriceLabel: details.is_free ? undefined : price?.initial_formatted || undefined,
    discountPercent: price?.discount_percent ?? item.discount_percent ?? 0,
    cardImage:
      item.header_image ??
      details.header_image ??
      `https://cdn.cloudflare.steamstatic.com/steam/apps/${appid}/header.jpg`,
    heroImage:
      details.screenshots?.[0]?.path_full ??
      item.header_image ??
      details.header_image ??
      `https://cdn.cloudflare.steamstatic.com/steam/apps/${appid}/header.jpg`,
    headerImage:
      item.header_image ??
      details.header_image ??
      `https://cdn.cloudflare.steamstatic.com/steam/apps/${appid}/header.jpg`,
    screenshots: (details.screenshots ?? []).slice(0, 3).map((shot) => shot.path_full),
    free: null,
  };
}

function epicImage(images, preferred) {
  for (const type of preferred) {
    const match = images?.find((image) => image.type === type);
    if (match?.url) return match.url;
  }
  return images?.[0]?.url ?? "";
}

function epicGame(element, offer, usedSlugs) {
  const title = element.title?.trim();
  if (!title || !offer) return null;

  let slug = `epic-${slugify(title)}`;
  if (usedSlugs.has(slug)) slug = `${slug}-${element.id.slice(0, 6)}`;
  usedSlugs.add(slug);

  const images = element.keyImages ?? [];
  const start = new Date(offer.startDate);
  const end = new Date(offer.endDate);
  if (Number.isNaN(start.valueOf()) || Number.isNaN(end.valueOf())) return null;
  if (end <= now) return null;

  const status = start <= now ? "current" : "upcoming";
  const pageSlug =
    element.productSlug?.replace(/\/home$/, "") ??
    element.offerMappings?.[0]?.pageSlug ??
    element.urlSlug;
  const storeUrl = pageSlug
    ? `https://store.epicgames.com/en-US/p/${pageSlug}`
    : "https://store.epicgames.com/en-US/free-games";

  return {
    slug,
    store: "epic",
    steamAppId: null,
    title,
    description: element.description || `${title} is free on the Epic Games Store.`,
    genres: (element.tags ?? [])
      .map((tag) => tag.name)
      .filter(Boolean)
      .slice(0, 3),
    releaseDate: "",
    developers: element.seller?.name ? [element.seller.name] : [],
    storeUrl,
    priceLabel: status === "current" ? "Free now" : "Free soon",
    originalPriceLabel: element.price?.totalPrice?.fmtPrice?.originalPrice,
    discountPercent: 100,
    cardImage: epicImage(images, ["OfferImageWide", "DieselStoreFrontWide", "Thumbnail"]),
    heroImage: epicImage(images, ["OfferImageWide", "DieselStoreFrontWide", "Thumbnail"]),
    headerImage: epicImage(images, ["OfferImageWide", "Thumbnail"]),
    screenshots: [],
    free: {
      status,
      from: start.toISOString(),
      until: end.toISOString(),
    },
  };
}

async function main() {
  log("Fetching Steam featured categories");
  const featured = await getJson(
    "https://store.steampowered.com/api/featuredcategories?cc=us&l=en",
  );

  let weeklyItems = [];
  try {
    const weeklyAppIds = await getWeeklongAppIds(24);
    weeklyItems = weeklyAppIds.map((id) => ({ id }));
    log(`Found ${weeklyItems.length} Steam weeklong deals`);
  } catch (error) {
    log(`Weekly Steam deals unavailable: ${error.message}`);
  }

  const sections = {
    trending: (featured.top_sellers?.items ?? []).slice(0, 10),
    newReleases: (featured.new_releases?.items ?? []).slice(0, 10),
    deals: (featured.specials?.items ?? []).filter((item) => item.discount_percent > 0).slice(0, 6),
    weekly: weeklyItems,
  };

  const ids = [
    ...new Set(
      Object.values(sections)
        .flat()
        .map((item) => item.id)
        .filter((id) => Number.isInteger(id)),
    ),
  ];

  log(`Fetching details for ${ids.length} Steam apps`);
  const details = new Map();
  for (const appid of ids) {
    try {
      const data = await getSteamDetails(appid);
      if (data) details.set(appid, data);
    } catch (error) {
      log(`Skipping ${appid}: ${error.message}`);
    }
    await new Promise((resolve) => setTimeout(resolve, 120));
  }

  const usedSlugs = new Set();
  const gamesByAppId = new Map();

  for (const appid of ids) {
    const item = Object.values(sections)
      .flat()
      .find((entry) => entry.id === appid);
    const game = steamGame(appid, item, details.get(appid), usedSlugs);
    if (game) gamesByAppId.set(appid, game);
  }

  const byAppId = (slugs) =>
    slugs
      .map((item) => gamesByAppId.get(item.id))
      .filter(Boolean)
      .map((game) => game.slug);

  const trending = byAppId(sections.trending);
  const newReleases = byAppId(sections.newReleases);
  const deals = byAppId(sections.deals);
  const weeklyDeals = byAppId(sections.weekly).slice(0, 8);
  const featuredSlug = trending[0] ?? newReleases[0] ?? deals[0] ?? null;

  const news = [];
  const newsAppIds = [...new Set([...trending.slice(0, 3), ...newReleases.slice(0, 2)])]
    .map((slug) => gamesByAppId.size && [...gamesByAppId.values()].find((game) => game.slug === slug)?.steamAppId)
    .filter(Boolean);

  log(`Fetching Steam news for ${newsAppIds.length} apps`);
  for (const appid of newsAppIds) {
    try {
      const data = await getJson(
        `https://api.steampowered.com/ISteamNews/GetNewsForApp/v2/?appid=${appid}&count=3&maxlength=600&format=json`,
      );
      const game = [...gamesByAppId.values()].find((entry) => entry.steamAppId === appid);
      for (const item of (data?.appnews?.newsitems ?? []).slice(0, 2)) {
        if (!item.title || !item.url) continue;
        news.push({
          title: item.title.trim(),
          url: item.url,
          publishedAt: new Date(item.date * 1000).toISOString(),
          source: item.feedlabel || "Steam",
          summary: truncate(stripMarkup(item.contents ?? "")),
          gameSlug: game?.slug ?? null,
          gameTitle: game?.title ?? null,
        });
      }
    } catch (error) {
      log(`Skipping news for ${appid}: ${error.message}`);
    }
    await new Promise((resolve) => setTimeout(resolve, 120));
  }

  const seenNews = new Set();
  news.sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt));
  const uniqueNews = news.filter((item) => {
    if (seenNews.has(item.url)) return false;
    seenNews.add(item.url);
    return true;
  }).slice(0, 8);

  log("Fetching Epic free games");
  const epicData = await getJson(
    "https://store-site-backend-static.ak.epicgames.com/freeGamesPromotions?locale=en-US&country=US&allowCountries=US",
  );
  const elements = epicData?.data?.Catalog?.searchStore?.elements ?? [];

  const freebies = { current: [], upcoming: [] };
  const epicGames = [];
  for (const element of elements) {
    const offers = [
      ...(element.promotions?.promotionalOffers ?? []),
      ...(element.promotions?.upcomingPromotionalOffers ?? []),
    ]
      .flatMap((group) => group.promotionalOffers ?? [])
      .filter((offer) => offer?.discountSetting?.discountPercentage === 0);

    for (const offer of offers) {
      const game = epicGame(element, offer, usedSlugs);
      if (!game) continue;
      epicGames.push(game);
      freebies[game.free.status].push(game.slug);
      break;
    }
  }

  const games = [...gamesByAppId.values(), ...epicGames];
  if (games.length === 0) throw new Error("No games were produced");

  const snapshot = {
    syncedAt: now.toISOString(),
    source: "Steam Store + Epic Games Store",
    featured: featuredSlug,
    trending,
    newReleases,
    deals,
    freebies,
    weekly: {
      steam: {
        deals: weeklyDeals,
        endsAt: nextWeeklongEnd(now).toISOString(),
      },
    },
    news: uniqueNews,
    games,
  };

  const errors = validateSnapshot(snapshot);
  if (errors.length > 0) {
    throw new Error(`Snapshot validation failed:\n${errors.map((error) => ` - ${error}`).join("\n")}`);
  }

  await mkdir(path.dirname(OUT_FILE), { recursive: true });
  await writeFile(OUT_FILE, `${JSON.stringify(snapshot, null, 2)}\n`, "utf8");
  log(
    `Wrote ${OUT_FILE}: ${games.length} games, ${uniqueNews.length} news, ` +
      `${freebies.current.length} current + ${freebies.upcoming.length} upcoming freebies, ` +
      `${weeklyDeals.length} weeklong deals`,
  );
}

try {
  await main();
} catch (error) {
  if (allowStale) {
    try {
      const existing = JSON.parse(await readFile(OUT_FILE, "utf8"));
      console.warn(`[sync] Failed (${error.message}); keeping snapshot from ${existing.syncedAt}`);
      process.exit(0);
    } catch {
      console.error(`[sync] Failed and no usable snapshot exists: ${error.message}`);
      process.exit(1);
    }
  }
  console.error(`[sync] ${error.stack || error.message}`);
  process.exit(1);
}
