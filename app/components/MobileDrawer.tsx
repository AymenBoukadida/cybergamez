"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { clsx } from "clsx";
import { ArrowRight, X } from "lucide-react";
import Link from "next/link";
import { buttonClasses } from "./Button";
import { NAV_ITEMS } from "@/app/lib/nav";

export function MobileDrawer({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const year = new Date().getFullYear();

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="drawer-overlay fixed inset-0 z-50 bg-ink/75 backdrop-blur-sm" />
        <Dialog.Content
          id="mobile-menu"
          className="drawer-content fixed inset-y-0 right-0 z-50 flex h-dvh w-[320px] max-w-[85vw] flex-col border-l border-line bg-surface p-6 shadow-2xl"
        >
          <Dialog.Title className="sr-only">Menu</Dialog.Title>
          <Dialog.Description className="sr-only">Site navigation</Dialog.Description>

          <div className="flex items-center justify-between">
            <span className="font-display text-lg font-bold tracking-[0.08em]">
              CYBER<span className="text-brand">GAMEZ</span>
            </span>
            <Dialog.Close
              aria-label="Close menu"
              className="focus-ring grid size-10 place-items-center rounded-xl border border-line text-muted transition-colors hover:text-text"
            >
              <X className="size-5" aria-hidden="true" />
            </Dialog.Close>
          </div>

          <nav aria-label="Mobile" className="mt-10 flex flex-col gap-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => onOpenChange(false)}
                className="focus-ring rounded-lg px-3 py-3 text-lg font-medium text-muted transition-colors hover:bg-surface-2 hover:text-text"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <Link
            href="/download/"
            onClick={() => onOpenChange(false)}
            className={clsx(buttonClasses(), "mt-8 w-full")}
          >
            Get Subway Surfers
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>

          <div className="mt-auto space-y-1 border-t border-line pt-6 text-xs text-muted">
            <p>Original design by Hamza Zaidi</p>
            <p>© {year} CyberGamez</p>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
