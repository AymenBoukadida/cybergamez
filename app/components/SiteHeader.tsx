"use client";

import { clsx } from "clsx";
import { ArrowRight, Gamepad2, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { NAV_ITEMS } from "@/app/lib/nav";
import { buttonClasses } from "./Button";
import { MobileDrawer } from "./MobileDrawer";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={clsx(
        "sticky top-0 z-50 border-b transition-colors duration-200",
        scrolled
          ? "border-line bg-ink/92 backdrop-blur-md"
          : "border-transparent bg-transparent",
      )}
    >
      <div className="shell flex h-[72px] items-center justify-between gap-6">
        <Link
          href="/"
          aria-label="CyberGamez home"
          className="focus-ring flex items-center gap-2.5 rounded-lg"
        >
          <span className="grid size-9 place-items-center rounded-xl bg-brand text-ink">
            <Gamepad2 className="size-5" aria-hidden="true" />
          </span>
          <span className="font-display text-lg font-bold tracking-[0.08em]">
            CYBER<span className="text-brand">GAMEZ</span>
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-1 min-[900px]:flex">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={clsx(
                  "focus-ring rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  active ? "text-text" : "text-muted hover:text-text",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/download/"
            className={clsx(buttonClasses({ size: "sm" }), "hidden min-[900px]:inline-flex")}
          >
            Get Subway Surfers
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>

          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((value) => !value)}
            className="focus-ring grid size-10 place-items-center rounded-xl border border-line bg-surface text-text transition-colors hover:bg-surface-2 min-[900px]:hidden"
          >
            {open ? (
              <X className="size-5" aria-hidden="true" />
            ) : (
              <Menu className="size-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      <MobileDrawer open={open} onOpenChange={setOpen} />
    </header>
  );
}
