import { ChevronRight } from "lucide-react";
import Link from "next/link";

export function Breadcrumb({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted">
        {items.map((item, index) => {
          const current = index === items.length - 1;
          return (
            <li key={item.label} className="flex items-center gap-1.5">
              {index > 0 ? <ChevronRight className="size-3.5" aria-hidden="true" /> : null}
              {item.href ? (
                <Link
                  href={item.href}
                  aria-current={current ? "page" : undefined}
                  className="focus-ring rounded transition-colors hover:text-text"
                >
                  {item.label}
                </Link>
              ) : (
                <span aria-current={current ? "page" : undefined} className={current ? "text-text" : undefined}>
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
