import { VERIFIED_FESTIVALS } from "@/src/lib/fixtures";
import FestivalsClient from "./FestivalsClient";

export const metadata = {
  title: "2026 Cultural Festival Calendar",
  description: "Verified festival schedules, monastic dances, and cultural events across India's 8 Union Territories."
};

export default function FestivalsPage() {
  return (
    <main className="container section-spacing" role="main">
      <div className="section-header">
        <span className="badge badge-warning" style={{ width: "fit-content" }}>Phase 5 Research Standard</span>
        <h1>2026 Cultural Festival Calendar</h1>
        <p className="lead-text">
          Verified annual monastic ceremonies, island food galas, and national cultural carnivals across India's 8 Union Territories with strict date precision.
        </p>
      </div>

      <FestivalsClient festivals={VERIFIED_FESTIVALS} />
    </main>
  );
}
