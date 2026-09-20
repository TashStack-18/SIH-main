import { Metadata } from 'next';
import { ExperienceGallery } from '@/src/app/components/experience/ExperienceGallery';

export const metadata: Metadata = {
  title: "Traveler Journal — Experience Bharat Through Travelers' Eyes | Dishaara",
  description: "Real stories, verified tips, and authentic photography from travelers exploring India's Union Territories. Discover hidden gems and share your journey.",
  openGraph: {
    title: "Traveler Journal | Dishaara",
    description: "Real people. Real stories. Real Bharat. Read verified traveler experiences across all 8 Union Territories.",
    images: [{ url: "/images/Pangong Tso.jpeg", width: 1200, height: 630 }],
  },
};

export default function ExperiencePage() {
  return (
    <main className="min-h-screen pb-20 overflow-x-hidden" style={{ paddingTop: '100px' }}>
      <ExperienceGallery />
    </main>
  );
}
