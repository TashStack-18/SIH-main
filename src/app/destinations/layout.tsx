import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Verified Destinations",
  description: "Browse verified destinations, ancient monasteries, high-altitude lakes, coral atolls, and UNESCO heritage monuments across India's 8 Union Territories.",
};

export default function DestinationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
