import { mkdir, stat } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { entries } from "./images.mjs";

const force = process.argv.includes("--force");
const outDir = path.join("public", "img", "opt");

await mkdir(outDir, { recursive: true });

for (const entry of entries) {
  const sourceStat = await stat(entry.src);
  const metadata = await sharp(entry.src).metadata();
  const widths = entry.widths ?? [entry.width];

  for (const width of widths) {
    const extension = entry.format === "jpeg" ? "jpg" : "webp";
    const filename =
      entry.format === "jpeg" ? `${entry.name}.${extension}` : `${entry.name}-${width}.${extension}`;
    const output = path.join(outDir, filename);

    if (metadata.width < width) {
      throw new Error(`Source ${entry.src} is ${metadata.width}px, needs ${width}px`);
    }

    if (!force) {
      try {
        const outputStat = await stat(output);
        if (outputStat.mtimeMs >= sourceStat.mtimeMs) {
          console.log(`skip ${output}`);
          continue;
        }
      } catch {
        // Missing output: generate it.
      }
    }

    const resize = entry.height
      ? { width, height: entry.height, fit: "cover" }
      : { width };
    const pipeline = sharp(entry.src).resize(resize);
    const encoded =
      entry.format === "jpeg" ? pipeline.jpeg({ quality: 82 }) : pipeline.webp({ quality: 80 });

    await encoded.toFile(output);
    console.log(`wrote ${output}`);
  }
}
