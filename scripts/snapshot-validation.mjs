function isText(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function isUrl(value) {
  if (!isText(value)) return false;
  try {
    const { protocol } = new URL(value);
    return protocol === "https:" || protocol === "http:";
  } catch {
    return false;
  }
}

export function validateSnapshot(snapshot, { maxAgeHours = null, now = Date.now() } = {}) {
  if (!snapshot || typeof snapshot !== "object" || Array.isArray(snapshot)) {
    return ["snapshot is not an object"];
  }

  const errors = [];
  const games = Array.isArray(snapshot.games) ? snapshot.games : [];
  const slugs = new Set();

  if (games.length < 5) {
    errors.push(`expected at least 5 games, found ${games.length}`);
  }

  for (const [index, game] of games.entries()) {
    const label = `games[${index}]`;
    if (!isText(game?.slug)) {
      errors.push(`${label}.slug is missing`);
    } else if (slugs.has(game.slug)) {
      errors.push(`${label}.slug "${game.slug}" is duplicated`);
    } else {
      slugs.add(game.slug);
    }
    if (!isText(game?.title)) errors.push(`${label}.title is missing`);
    if (game?.store !== "steam" && game?.store !== "epic") {
      errors.push(`${label}.store must be "steam" or "epic"`);
    }
    if (!isUrl(game?.storeUrl)) errors.push(`${label}.storeUrl is not an absolute URL`);
    if (!isUrl(game?.cardImage)) errors.push(`${label}.cardImage is not an absolute URL`);
    if (!isUrl(game?.headerImage)) errors.push(`${label}.headerImage is not an absolute URL`);
    if (!isUrl(game?.heroImage)) errors.push(`${label}.heroImage is not an absolute URL`);
    if (!Array.isArray(game?.screenshots)) errors.push(`${label}.screenshots is not an array`);
    if (game?.priceCompared !== undefined && typeof game.priceCompared !== "boolean") {
      errors.push(`${label}.priceCompared is not a boolean`);
    }
    if (game?.cheapest !== undefined && game?.cheapest !== null) {
      const cheapest = game.cheapest;
      if (!isText(cheapest.store)) errors.push(`${label}.cheapest.store is missing`);
      if (!isText(cheapest.priceLabel)) errors.push(`${label}.cheapest.priceLabel is missing`);
      if (!isUrl(cheapest.url)) errors.push(`${label}.cheapest.url is not an absolute URL`);
      if (!Number.isFinite(cheapest.savingsPercent)) {
        errors.push(`${label}.cheapest.savingsPercent is not a number`);
      }
    }
  }

  if (!isText(snapshot.featured)) {
    errors.push("featured is missing");
  } else if (!slugs.has(snapshot.featured)) {
    errors.push(`featured references missing game "${snapshot.featured}"`);
  }

  for (const key of ["trending", "newReleases", "deals"]) {
    const list = snapshot[key];
    if (!Array.isArray(list)) {
      errors.push(`${key} is not an array`);
      continue;
    }
    for (const slug of list) {
      if (!slugs.has(slug)) errors.push(`${key} references missing game "${slug}"`);
    }
  }

  const gameBySlug = new Map(games.map((game) => [game?.slug, game]));
  for (const key of ["current", "upcoming"]) {
    const list = snapshot.freebies?.[key];
    if (!Array.isArray(list)) {
      errors.push(`freebies.${key} is not an array`);
      continue;
    }
    for (const slug of list) {
      const game = gameBySlug.get(slug);
      if (!game) errors.push(`freebies.${key} references missing game "${slug}"`);
      else if (!game.free) errors.push(`freebies.${key} game "${slug}" has no free offer`);
      else if (game.free.status !== key) errors.push(`game "${slug}" is not a ${key} freebie`);
    }
  }

  const weeklySteam = snapshot.weekly?.steam;
  if (!weeklySteam || typeof weeklySteam !== "object") {
    errors.push("weekly.steam is missing");
  } else {
    if (!Array.isArray(weeklySteam.deals)) {
      errors.push("weekly.steam.deals is not an array");
    } else {
      for (const slug of weeklySteam.deals) {
        if (!slugs.has(slug)) errors.push(`weekly.steam.deals references missing game "${slug}"`);
      }
    }
    const endsAt = Date.parse(weeklySteam.endsAt);
    if (Number.isNaN(endsAt)) {
      errors.push("weekly.steam.endsAt is not a date");
    } else if (endsAt < now - 5 * 60_000) {
      errors.push("weekly.steam.endsAt is in the past");
    }
  }

  if (!Array.isArray(snapshot.news)) {
    errors.push("news is not an array");
  } else {
    for (const [index, item] of snapshot.news.entries()) {
      if (!isText(item?.title)) errors.push(`news[${index}].title is missing`);
      if (!isUrl(item?.url)) errors.push(`news[${index}].url is not an absolute URL`);
      if (Number.isNaN(Date.parse(item?.publishedAt))) {
        errors.push(`news[${index}].publishedAt is not a date`);
      }
    }
  }

  const syncedAt = Date.parse(snapshot.syncedAt);
  if (Number.isNaN(syncedAt)) {
    errors.push("syncedAt is not a date");
  } else if (maxAgeHours !== null) {
    const ageHours = (now - syncedAt) / 3_600_000;
    if (ageHours > maxAgeHours) {
      errors.push(`snapshot is ${ageHours.toFixed(1)} hours old, limit is ${maxAgeHours}`);
    }
    if (ageHours < -1) {
      errors.push("snapshot timestamp is in the future");
    }
  }

  return errors;
}
