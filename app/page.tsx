import { Hero } from "./components/Hero";
import { NewReleasesGrid } from "./components/NewReleasesGrid";
import { TrendingRail } from "./components/TrendingRail";

export default function HomePage() {
  return (
    <main id="main">
      <Hero />
      <TrendingRail />
      <NewReleasesGrid />
    </main>
  );
}
