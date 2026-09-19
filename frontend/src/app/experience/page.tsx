import { Metadata } from 'next';
import Link from 'next/link';
import { ExperienceGallery } from '@/src/app/components/experience/ExperienceGallery';

export const metadata: Metadata = {
  title: 'Traveler Experiences | Dishaara',
  description: "Experience India through travelers' eyes. Share your journey and useful first-hand travel experiences.",
};

export default function ExperiencePage() {
  return (
    <main className="min-h-screen pb-20" style={{ paddingTop: '120px' }}>
      <div className="container mx-auto px-4">
        {/* Editorial Header */}
        <section className="text-center max-w-3xl mx-auto mb-16" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
          <span className="inline-block py-1 px-3 rounded-full bg-[var(--color-bg-surface-elevated)] border border-[var(--color-border-subtle)] text-[var(--color-accent)] text-xs font-bold tracking-wider uppercase mb-6" style={{ marginBottom: '16px' }}>
            Traveler Journal
          </span>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-[var(--color-text-primary)] mb-6" style={{ lineHeight: '1.2', marginBottom: '24px' }}>
            Experience India, Through Travelers' Eyes
          </h1>
          <p className="text-lg text-[var(--color-text-secondary)] leading-relaxed mb-10" style={{ lineHeight: '1.6', marginBottom: '32px' }}>
            Real stories, verified tips, and authentic photography from travelers exploring the 8 Union Territories. Discover hidden gems, read practical recommendations, and document your own journey to help the community.
          </p>
          
          <Link
            href="/experience/add"
            className="btn btn-primary btn-lg inline-flex items-center gap-2"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="17 8 12 3 7 8"></polyline>
              <line x1="12" y1="3" x2="12" y2="15"></line>
            </svg>
            SHARE YOUR EXPERIENCE
          </Link>
        </section>

        {/* Experience Feed Component will go here */}
        <section className="mt-12">
           {/* To be implemented: A Client Component that fetches and displays the experiences */}
           <ExperienceGallery />
        </section>
      </div>
    </main>
  );
}
