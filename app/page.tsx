import { Hero } from "./components/Hero";
import { NewReleasesGrid } from "./components/NewReleasesGrid";
import { SectionHeading } from "./components/SectionHeading";

export default function HomePage() {
  return (
    <main id="main">
      <Hero />

      <section aria-labelledby="trending" className="shell mt-24">
        <SectionHeading
          id="trending"
          title="Trending now"
          subtitle="The games everyone is playing this week."
        />
        <div className="mt-8 h-40 rounded-2xl border border-dashed border-line" />
      </section>

      <NewReleasesGrid />
    </main>
  );
}
