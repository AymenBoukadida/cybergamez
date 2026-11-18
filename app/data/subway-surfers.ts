export type TranscriptCue = { start: string; end: string; text: string };

export type SubwaySurfers = {
  slug: string;
  title: string;
  genres: string[];
  rating: number;
  file: { href: string; label: string; size: string };
  trailer: { src: string; captions: string; poster: string };
  about: string;
  features: string[];
  screenshots: { name: string; alt: string }[];
  transcript: TranscriptCue[];
};

export const subwaySurfers: SubwaySurfers = {
  slug: "subway-surfers",
  title: "Subway Surfers",
  genres: ["Action", "Mobile"],
  rating: 4.7,
  file: {
    href: "/download-files/subway-surfers-demo.apk",
    label: "Download APK",
    size: "768 KB",
  },
  trailer: {
    src: "/download-files/subway-surfers-trailer.mp4",
    captions: "/download-files/subway-surfers-trailer.vtt",
    poster: "/img/opt/subway-screens-1-960.webp",
  },
  about:
    "Help Jake, Tricky and Fresh escape the grumpy Inspector and his dog. Dash, dodge and grind through the tracks in this endless runner from Kiloo and SYBO.",
  features: [
    "Dash as fast as you can.",
    "Dodge the oncoming trains.",
    "Grind trains with your crew.",
    "Hoverboard surfing and paint-powered jetpacks.",
    "Lightning-fast swipe acrobatics.",
  ],
  screenshots: [
    { name: "subway-screens-1", alt: "Subway Surfers gameplay screenshot 1" },
    { name: "subway-screens-2", alt: "Subway Surfers gameplay screenshot 2" },
    { name: "subway-screens-3", alt: "Subway Surfers gameplay screenshot 3" },
  ],
  transcript: [],
};
