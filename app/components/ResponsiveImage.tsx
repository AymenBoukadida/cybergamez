import { asset } from "@/app/lib/base-path";
import { buildSrcSet } from "@/app/lib/responsive-image";

export function ResponsiveImage({
  name,
  widths,
  sizes,
  alt,
  width,
  height,
  className,
  priority,
}: {
  name: string;
  widths: readonly number[];
  sizes: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
}) {
  const largest = Math.max(...widths);

  return (
    <img
      src={asset(`/img/opt/${name}-${largest}.webp`)}
      srcSet={buildSrcSet(name, widths)}
      sizes={sizes}
      alt={alt}
      width={width}
      height={height}
      className={className}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : undefined}
      decoding="async"
    />
  );
}
