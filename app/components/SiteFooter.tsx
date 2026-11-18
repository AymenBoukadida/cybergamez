import { Gamepad2 } from "lucide-react";
import Link from "next/link";
import { formatDate, live } from "@/app/data/live";
import { NAV_ITEMS } from "@/app/lib/nav";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t border-line bg-surface/40">
      <div className="shell grid gap-10 py-12 md:grid-cols-[1.4fr_1fr_1.2fr]">
        <div className="max-w-xs space-y-3">
          <Link
            href="/"
            aria-label="CyberGamez home"
            className="focus-ring inline-flex items-center gap-2.5 rounded-lg"
          >
            <span className="grid size-9 place-items-center rounded-xl bg-brand text-ink">
              <Gamepad2 className="size-5" aria-hidden="true" />
            </span>
            <span className="font-display text-lg font-bold tracking-[0.08em]">
              CYBER<span className="text-brand">GAMEZ</span>
            </span>
          </Link>
          <p className="text-sm text-muted">
            Live Steam releases, Epic free-game giveaways and the headlines worth reading.
          </p>
        </div>

        <nav aria-label="Footer" className="flex flex-col items-start gap-2 text-sm">
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.12em] text-muted">Browse</p>
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="focus-ring rounded text-muted transition-colors hover:text-text"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="space-y-2 text-sm text-muted md:text-right">
          <p className="text-xs font-semibold uppercase tracking-[0.12em]">Live data</p>
          <p>{live.source}</p>
          <p>Updated {formatDate(live.syncedAt)}</p>
          <p className="border-t border-line pt-2 text-xs">
            © {year} CyberGamez. All rights reserved.
          </p>
          <a
            href="#main"
            className="focus-ring inline-block rounded text-xs text-text underline-offset-4 transition-colors hover:text-brand hover:underline"
          >
            Back to top
          </a>
        </div>
      </div>
    </footer>
  );
}
