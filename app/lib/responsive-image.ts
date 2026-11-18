import { asset } from "./base-path";

export { asset };

export function buildSrcSet(name: string, widths: readonly number[]): string {
  return [...widths]
    .sort((a, b) => a - b)
    .map((width) => `${asset(`/img/opt/${name}-${width}.webp`)} ${width}w`)
    .join(", ");
}
