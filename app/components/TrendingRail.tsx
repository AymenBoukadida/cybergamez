"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { A11y, Keyboard, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import type { StoreGame } from "@/app/data/live";
import { GameCard } from "./GameCard";
import { SectionHeading } from "./SectionHeading";

export function TrendingRail({ games }: { games: StoreGame[] }) {
  if (games.length === 0) return null;

  return (
    <section aria-labelledby="trending" className="shell mt-24">
      <SectionHeading
        id="trending"
        title="Trending on Steam"
        subtitle="The games everyone is buying and playing this week."
        action={
          <div className="flex gap-2">
            <button
              type="button"
              id="trending-prev"
              aria-label="Previous games"
              className="nav-button focus-ring grid size-10 place-items-center rounded-full border border-line bg-surface text-text transition-colors hover:border-white/25 hover:bg-surface-2"
            >
              <ChevronLeft className="size-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              id="trending-next"
              aria-label="Next games"
              className="nav-button focus-ring grid size-10 place-items-center rounded-full border border-line bg-surface text-text transition-colors hover:border-white/25 hover:bg-surface-2"
            >
              <ChevronRight className="size-5" aria-hidden="true" />
            </button>
          </div>
        }
      />

      <Swiper
        className="mt-8"
        modules={[Navigation, A11y, Keyboard, Pagination]}
        spaceBetween={16}
        slidesPerView={1.15}
        breakpoints={{
          640: { slidesPerView: 2.2 },
          1068: { slidesPerView: 4.4 },
        }}
        navigation={{ prevEl: "#trending-prev", nextEl: "#trending-next" }}
        pagination={{ el: "#trending-pagination", clickable: true }}
        a11y={{ enabled: true }}
        keyboard={{ enabled: true }}
      >
        {games.map((game) => (
          <SwiperSlide key={game.slug} className="h-auto">
            <GameCard game={game} />
          </SwiperSlide>
        ))}
      </Swiper>

      <div
        id="trending-pagination"
        className="trending-pagination mt-6 flex justify-center gap-2 sm:hidden"
      />
    </section>
  );
}
