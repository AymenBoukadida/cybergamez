import { readFile } from "node:fs/promises";
import path from "node:path";
import { validateSnapshot } from "./snapshot-validation.mjs";

const SNAPSHOT_FILE = path.join("app", "data", "live.generated.json");
const maxAgeArg = process.argv.find((arg) => arg.startsWith("--max-age-hours="));
const maxAgeHours = maxAgeArg ? Number(maxAgeArg.split("=")[1]) : null;

if (maxAgeArg && (!Number.isFinite(maxAgeHours) || maxAgeHours <= 0)) {
  console.error("[verify] --max-age-hours must be a positive number");
  process.exit(1);
}

let snapshot;
try {
  snapshot = JSON.parse(await readFile(SNAPSHOT_FILE, "utf8"));
} catch (error) {
  console.error(`[verify] Cannot read ${SNAPSHOT_FILE}: ${error.message}`);
  process.exit(1);
}

const errors = validateSnapshot(snapshot, { maxAgeHours });
if (errors.length > 0) {
  console.error(`[verify] ${SNAPSHOT_FILE} failed ${errors.length} check(s):`);
  for (const error of errors) console.error(` - ${error}`);
  process.exit(1);
}

const games = snapshot.games.length;
const news = snapshot.news.length;
const ageMinutes = Math.max(0, Math.round((Date.now() - Date.parse(snapshot.syncedAt)) / 60_000));
console.log(
  `[verify] ${SNAPSHOT_FILE}: ${games} games, ${news} news, synced ${ageMinutes} min ago`,
);
