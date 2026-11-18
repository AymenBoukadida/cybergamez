import { asset, buildSrcSet } from "./responsive-image";

it("prefixes public paths with an empty base", () => {
  vi.stubEnv("NEXT_PUBLIC_BASE_PATH", "");
  expect(asset("/img/opt/x-480.webp")).toBe("/img/opt/x-480.webp");
});

it("prefixes public paths with a configured base", () => {
  vi.stubEnv("NEXT_PUBLIC_BASE_PATH", "/cybergamez");
  expect(asset("img/opt/x-480.webp")).toBe("/cybergamez/img/opt/x-480.webp");
});

it("builds a srcset in ascending width order", () => {
  vi.stubEnv("NEXT_PUBLIC_BASE_PATH", "");
  expect(buildSrcSet("gta-v", [480, 320])).toBe(
    "/img/opt/gta-v-320.webp 320w, /img/opt/gta-v-480.webp 480w",
  );
});
