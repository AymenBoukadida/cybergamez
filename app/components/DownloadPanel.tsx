"use client";

import { Apple, Download, Monitor, Smartphone } from "lucide-react";
import { subwaySurfers } from "@/app/data/games";
import { asset } from "@/app/lib/base-path";
import { buttonClasses } from "./Button";
import { useToast } from "./Toast";

const unavailable = [
  { label: "iOS", icon: Apple },
  { label: "Windows", icon: Monitor },
];

export function DownloadPanel() {
  const { showToast } = useToast();
  const { file } = subwaySurfers;

  return (
    <div className="rounded-2xl border border-line bg-surface-2 p-6">
      <h2 className="font-display text-xl font-semibold">Download</h2>
      <p className="mt-1 text-sm text-muted">
        Subway Surfers demo · APK · {file.size}
      </p>

      <a
        href={asset(file.href)}
        download
        onClick={() => showToast("APK download started.")}
        className={`${buttonClasses()} mt-5 w-full`}
      >
        <Smartphone className="size-4" aria-hidden="true" />
        Download for Android
        <Download className="size-4" aria-hidden="true" />
      </a>

      <div className="mt-3 space-y-2">
        {unavailable.map(({ label, icon: Icon }) => (
          <button
            key={label}
            type="button"
            disabled
            className="flex w-full items-center justify-between rounded-xl border border-line bg-surface px-4 py-3 text-sm text-muted opacity-60"
          >
            <span className="flex items-center gap-2">
              <Icon className="size-4" aria-hidden="true" />
              {label}
            </span>
            <span className="text-xs">Not in this demo</span>
          </button>
        ))}
      </div>

      <p className="mt-4 text-xs leading-relaxed text-muted">
        Demo build. Only the Android APK is included.
      </p>
    </div>
  );
}
