import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Smart Itinerary Builder",
  description: "Build, manage, and customize your travel itineraries across India's Union Territories.",
};

export default function ItineraryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
