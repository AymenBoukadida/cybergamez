"use client";

import { useEffect, useState } from "react";

function describe(ms: number): string {
  const totalMinutes = Math.max(1, Math.floor(ms / 60000));
  const days = Math.floor(totalMinutes / 1440);
  const hours = Math.floor((totalMinutes % 1440) / 60);
  const minutes = totalMinutes % 60;

  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

export function Countdown({
  target,
  kind = "left",
  fallback,
}: {
  target: string;
  kind?: "left" | "starts";
  fallback: string;
}) {
  const [label, setLabel] = useState<string | null>(null);

  useEffect(() => {
    const update = () => {
      const remaining = Date.parse(target) - Date.now();
      if (Number.isNaN(remaining)) return;
      if (remaining <= 0) {
        setLabel(kind === "left" ? "Ended" : "Available now");
        return;
      }
      setLabel(kind === "left" ? `${describe(remaining)} left` : `Starts in ${describe(remaining)}`);
    };

    update();
    const timer = window.setInterval(update, 60_000);
    return () => window.clearInterval(timer);
  }, [kind, target]);

  return (
    <span className="font-semibold text-text" suppressHydrationWarning>
      {label ?? fallback}
    </span>
  );
}
