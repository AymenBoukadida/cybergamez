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

export function FreeCountdown({
  from,
  until,
  status,
  fallback,
}: {
  from: string;
  until: string;
  status: "current" | "upcoming";
  fallback: string;
}) {
  const [label, setLabel] = useState<string | null>(null);

  useEffect(() => {
    const target = status === "current" ? until : from;
    const update = () => {
      const remaining = Date.parse(target) - Date.now();
      if (Number.isNaN(remaining)) return;
      if (remaining <= 0) {
        setLabel(status === "current" ? "Offer ended" : "Available now");
        return;
      }
      setLabel(status === "current" ? `${describe(remaining)} left` : `Starts in ${describe(remaining)}`);
    };

    update();
    const timer = window.setInterval(update, 60_000);
    return () => window.clearInterval(timer);
  }, [from, status, until]);

  return (
    <span className="font-semibold text-text" suppressHydrationWarning>
      {label ?? fallback}
    </span>
  );
}
