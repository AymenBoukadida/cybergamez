import { describe, expect, it } from "vitest";
import { chooseCheapestDeal, formatUsd, usdAmount } from "./cheapshark.mjs";

const stores = new Map([
  ["1", "Steam"],
  ["7", "GOG"],
  ["15", "Fanatical"],
]);

describe("formatUsd", () => {
  it("formats USD prices, including free", () => {
    expect(formatUsd("19.99")).toBe("$19.99");
    expect(formatUsd(0)).toBe("Free");
    expect(formatUsd("not-a-price")).toBeNull();
  });
});

describe("usdAmount", () => {
  it("reads the dollar value out of a price label", () => {
    expect(usdAmount("$19.99")).toBe(19.99);
    expect(usdAmount("$1,299.00")).toBe(1299);
    expect(usdAmount("Free")).toBe(0);
    expect(usdAmount("Free to play")).toBe(0);
  });

  it("returns null for labels it cannot read", () => {
    expect(usdAmount("See price on Steam")).toBeNull();
    expect(usdAmount(undefined)).toBeNull();
  });
});

describe("chooseCheapestDeal", () => {
  it("picks the lowest price across stores", () => {
    const cheapest = chooseCheapestDeal(
      [
        { storeID: "1", dealID: "steam-deal", price: "26.65", retailPrice: "33.32", savings: "20.018" },
        { storeID: "7", dealID: "gog-deal", price: "19.99", retailPrice: "29.99", savings: "33.3" },
        { storeID: "15", dealID: "fanatical-deal", price: "24.49", retailPrice: "29.99", savings: "18.3" },
      ],
      stores,
    );

    expect(cheapest).toEqual({
      store: "GOG",
      priceLabel: "$19.99",
      retailLabel: "$29.99",
      savingsPercent: 33,
      url: "https://www.cheapshark.com/redirect?dealID=gog-deal",
    });
  });

  it("links Steam deals straight to the Steam app page", () => {
    const cheapest = chooseCheapestDeal(
      [{ storeID: "1", dealID: "steam-deal", price: "9.99", retailPrice: "19.99", savings: "50.02" }],
      stores,
      { steamAppId: 2406770 },
    );

    expect(cheapest.store).toBe("Steam");
    expect(cheapest.url).toBe("https://store.steampowered.com/app/2406770/");
    expect(cheapest.savingsPercent).toBe(50);
  });

  it("computes savings when the feed does not report them", () => {
    const cheapest = chooseCheapestDeal(
      [{ storeID: "7", dealID: "gog-deal", price: "10", retailPrice: "40" }],
      stores,
    );

    expect(cheapest.savingsPercent).toBe(75);
  });

  it("keeps full-price deals without a strike-through price or discount", () => {
    const cheapest = chooseCheapestDeal(
      [{ storeID: "7", dealID: "gog-deal", price: "59.99", retailPrice: "59.99", savings: "0" }],
      stores,
    );

    expect(cheapest.priceLabel).toBe("$59.99");
    expect(cheapest.retailLabel).toBeUndefined();
    expect(cheapest.savingsPercent).toBe(0);
  });

  it("ignores unknown stores, invalid prices, and empty deal lists", () => {
    expect(chooseCheapestDeal([], stores)).toBeNull();
    expect(chooseCheapestDeal(undefined, stores)).toBeNull();
    expect(
      chooseCheapestDeal(
        [
          { storeID: "99", dealID: "unknown", price: "1" },
          { storeID: "7", dealID: "", price: "2" },
          { storeID: "7", dealID: "bad-price", price: "free" },
        ],
        stores,
      ),
    ).toBeNull();
  });
});
