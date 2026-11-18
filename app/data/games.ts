export type Game = {
  slug: string;
  title: string;
  genres: string[];
  rating: number;
  art: { name: string; alt: string };
};

export { subwaySurfers } from "./subway-surfers";
export type { TranscriptCue } from "./subway-surfers";

export const CARD_WIDTHS = [320, 480] as const;

export const trendingGames: Game[] = [
  {
    slug: "cyberpunk-2077",
    title: "Cyberpunk 2077",
    genres: ["Action"],
    rating: 4.8,
    art: { name: "cyberpunk-2077", alt: "Cover art for Cyberpunk 2077" },
  },
  {
    slug: "battlefield-2042",
    title: "Battlefield 2042",
    genres: ["Action", "Weapon", "Crime"],
    rating: 4.5,
    art: { name: "battlefield-2042", alt: "Cover art for Battlefield 2042" },
  },
  {
    slug: "assassins-creed",
    title: "Assassin's Creed",
    genres: ["Action"],
    rating: 4.7,
    art: { name: "assassins-creed", alt: "Cover art for Assassin's Creed" },
  },
  {
    slug: "ghost-of-tsushima",
    title: "Ghost of Tsushima",
    genres: ["Action"],
    rating: 4.9,
    art: { name: "ghost-of-tsushima", alt: "Cover art for Ghost of Tsushima" },
  },
  {
    slug: "gta-v",
    title: "GTA V",
    genres: ["Action", "Crime", "Mission"],
    rating: 4.8,
    art: { name: "gta-v", alt: "Cover art for GTA V" },
  },
  {
    slug: "dying-light-2",
    title: "Dying Light 2",
    genres: ["Action"],
    rating: 4.6,
    art: { name: "dying-light-2", alt: "Cover art for Dying Light 2" },
  },
  {
    slug: "halo-infinite",
    title: "Halo Infinite",
    genres: ["Action"],
    rating: 4.5,
    art: { name: "halo-infinite", alt: "Cover art for Halo Infinite" },
  },
  {
    slug: "resident-evil-village",
    title: "Resident Evil Village",
    genres: ["Action", "Crime"],
    rating: 4.8,
    art: { name: "resident-evil-village", alt: "Cover art for Resident Evil Village" },
  },
];

export const newGames: Game[] = [
  {
    slug: "subway-surfers",
    title: "Subway Surfers",
    genres: ["Action", "Mobile"],
    rating: 4.7,
    art: { name: "subway-surfers", alt: "Cover art for Subway Surfers" },
  },
  {
    slug: "call-of-duty-mobile",
    title: "Call of Duty: Mobile",
    genres: ["Action", "Mobile"],
    rating: 4.6,
    art: { name: "call-of-duty-mobile", alt: "Cover art for Call of Duty: Mobile" },
  },
  {
    slug: "free-guy",
    title: "Free Guy",
    genres: ["Action"],
    rating: 4.3,
    art: { name: "free-guy", alt: "Cover art for Free Guy" },
  },
  {
    slug: "clash-royale",
    title: "Clash Royale",
    genres: ["Action"],
    rating: 4.5,
    art: { name: "clash-royale", alt: "Cover art for Clash Royale" },
  },
  {
    slug: "minecraft",
    title: "Minecraft",
    genres: ["Action"],
    rating: 4.9,
    art: { name: "minecraft", alt: "Cover art for Minecraft" },
  },
  {
    slug: "pubg",
    title: "PUBG",
    genres: ["Action"],
    rating: 4.4,
    art: { name: "pubg", alt: "Cover art for PUBG" },
  },
  {
    slug: "fortnite",
    title: "Fortnite",
    genres: ["Action"],
    rating: 4.6,
    art: { name: "fortnite", alt: "Cover art for Fortnite" },
  },
  {
    slug: "marvel-contest-of-champions",
    title: "Marvel: Contest of Champions",
    genres: ["Action"],
    rating: 4.5,
    art: {
      name: "marvel-contest-of-champions",
      alt: "Cover art for Marvel: Contest of Champions",
    },
  },
];

export const allGames: Game[] = [...trendingGames, ...newGames];
