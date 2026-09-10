import Link from "next/link";

interface ExploreRailItem {
  id: string;
  utTag: string;
  title: string;
  description: string;
  image: string;
  href: string;
}

const EXPLORE_RAIL_ITEMS: ExploreRailItem[] = [
  {
    id: "exp-ladakh",
    utTag: "Ladakh",
    title: "Ancient Monasteries",
    description: "Cliffside Gompas and spiritual retreats across the high-altitude Trans-Himalayas.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB4ueOr9o5aoCAsuOITjegOJSrDAELHg362nbJHi04ltV9YComzsXcCxnetzEk-yagmNAG9Gb7vdBmFT-W_nkEUnccQBmr0S45mXdnfyeNDGV6tDExeHfrLrW67UOPFq9yT-4VdjsgzXSL_8hUeenEMh3vsFODyBTbsEK1MksG503M37Tcq1J9tRqrM0HU5bjhN-sIjkQ4JFshQpjKVQCVYqCuyqRKmYfwE5sYfCDkaSnM9tCAucG9OIA",
    href: "/destinations?ut=ladakh",
  },
  {
    id: "exp-jk",
    utTag: "J&K",
    title: "Houseboat Heritage",
    description: "Living pine-wood craftsmanship upon the tranquil waters of Dal Lake.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBd_IErbXO2ptn_lWhz-tN-bkbQJdLq0SvpSE2zdeEN7tjlskyXIe519Pr8s4ZsrCX0uPwoZBU0rJUZ3_SeA4fm1RlnR66RSptMFHZVNAY-LOntaTg2K9vw5jdSsT6t75mGJoUHoocflhBkcxvf4vJBCX2B_SoNVvzmji66H-oDW8-_hOsaPSnPes_iLfpeUYD5ppHFrOhjNMomc_aNByz8JI7jbDkGCT9gCytdkDfRphhQ7Iq8exibtQ",
    href: "/destinations?ut=jammu-and-kashmir",
  },
  {
    id: "exp-andaman",
    utTag: "Andaman",
    title: "Island Chronicles",
    description: "Pristine white sand atolls and colonial legacy amid tropical turquoise seas.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCA9oL4pzahGaYYoydnBHHT_qCy7dn0mJQCP4XVUvEG1lZawmPJjC5RPe_k_0wVcAmSBe2mqBDAyqN9u_97NZSCKnOQUPb663qPG2BgLUtHPNN5JP_asK07dtE5sULnd8IGfy-rNS_hf1t-WymKTC57VQz0FAOXBA9b-rRcxqF0t_fH5xszBTeLQsBd6k9ojiGArWL9VnImNOtfa8DnifAISDXRAwVKHyDHGy9pMccO_BPCHCeo_xvYWw",
    href: "/destinations?ut=andaman-and-nicobar-islands",
  },
  {
    id: "exp-lakshadweep",
    utTag: "Lakshadweep",
    title: "Coral Atoll Sanctuaries",
    description: "Untouched bioluminescent lagoons with authorized government ePermits.",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1200&auto=format&fit=crop",
    href: "/destinations?ut=lakshadweep",
  },
  {
    id: "exp-delhi",
    utTag: "Delhi NCT",
    title: "Citadels of Empires",
    description: "Centuries of dynastic sandstone fortresses, baolis, and grand UNESCO citadels.",
    image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?q=80&w=1200&auto=format&fit=crop",
    href: "/destinations?ut=delhi",
  },
  {
    id: "exp-puducherry",
    utTag: "Puducherry",
    title: "French Coastal Heritage",
    description: "Pastel colonial boulevards and spiritual tranquility along the Coromandel coast.",
    image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=1200&auto=format&fit=crop",
    href: "/destinations?ut=puducherry",
  },
  {
    id: "exp-chandigarh",
    utTag: "Chandigarh",
    title: "Modernist Utopia",
    description: "Le Corbusier's UNESCO masterwork of open-hand architecture and rock sculptures.",
    image: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?q=80&w=1200&auto=format&fit=crop",
    href: "/destinations?ut=chandigarh",
  },
  {
    id: "exp-dnhdd",
    utTag: "DNH & DD",
    title: "Portuguese Seafaring Ramparts",
    description: "16th-century coastal bastions overlooking the winds of the Arabian Sea.",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop",
    href: "/destinations?ut=dadra-and-nagar-haveli-and-daman-and-diu",
  },
];

export function ExploreRail() {
  return (
    <section className="explore-rail-wrap">
      <div className="explore-rail-header">
        <div>
          <span className="badge badge-verified" style={{ marginBottom: "6px" }}>
            Signature Heritage Journeys
          </span>
          <h2 className="explore-rail-title">
            Explore Authentic India
          </h2>
        </div>
        <Link
          href="/destinations"
          style={{
            fontSize: "0.85rem",
            fontWeight: 700,
            color: "var(--color-accent)",
            textDecoration: "none",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          View All 8 UTs →
        </Link>
      </div>

      <div className="explore-rail-scroll-track hide-scrollbar">
        {EXPLORE_RAIL_ITEMS.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className="explore-rail-card"
          >
            {/* Background Image */}
            <img
              src={item.image}
              alt={item.title}
              className="explore-rail-card-img"
              loading="lazy"
            />

            {/* Gradient Overlay */}
            <div className="explore-rail-card-overlay" />

            {/* Text Overlay */}
            <div className="explore-rail-card-body">
              <div className="explore-rail-card-tag">
                {item.utTag}
              </div>
              <h3 className="explore-rail-card-heading">
                {item.title}
              </h3>
              <p className="explore-rail-card-desc">
                {item.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
