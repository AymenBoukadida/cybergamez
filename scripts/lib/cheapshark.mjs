const CHEAPSHARK_ORIGIN = "https://www.cheapshark.com";

export function formatUsd(value) {
  const price = Number(value);
  if (!Number.isFinite(price) || price < 0) return null;
  if (price === 0) return "Free";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

export function usdAmount(label) {
  if (typeof label !== "string") return null;
  const text = label.trim();
  if (/^free\b/i.test(text)) return 0;
  const match = /^\$([\d,]+(?:\.\d+)?)$/.exec(text);
  if (!match) return null;
  return Number(match[1].replace(/,/g, ""));
}

export function chooseCheapestDeal(deals, storeNames, { steamAppId = null } = {}) {
  if (!Array.isArray(deals) || !(storeNames instanceof Map)) return null;

  let best = null;
  for (const deal of deals) {
    const price = Number(deal?.price);
    if (!Number.isFinite(price) || price < 0 || !deal?.dealID) continue;
    const store = storeNames.get(String(deal.storeID));
    if (!store) continue;
    if (!best || price < best.price) best = { price, deal, store };
  }

  if (!best) return null;

  const retail = Number(best.deal.retailPrice);
  const reportedSavings = Number(best.deal.savings);
  const computedSavings =
    Number.isFinite(retail) && retail > best.price
      ? Math.round(((retail - best.price) / retail) * 100)
      : 0;
  const savingsPercent =
    Number.isFinite(reportedSavings) && reportedSavings > 0
      ? Math.round(reportedSavings)
      : computedSavings;

  return {
    store: best.store,
    priceLabel: formatUsd(best.price),
    ...(Number.isFinite(retail) && retail > best.price ? { retailLabel: formatUsd(retail) } : {}),
    savingsPercent,
    url:
      best.store === "Steam" && steamAppId
        ? `https://store.steampowered.com/app/${steamAppId}/`
        : `${CHEAPSHARK_ORIGIN}/redirect?dealID=${best.deal.dealID}`,
  };
}
