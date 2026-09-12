import { Metadata } from 'next';
import { ExperienceForm } from '@/src/app/components/experience/ExperienceForm';

export const metadata: Metadata = {
  title: 'Share Your Experience | Dishaara',
  description: 'Document the places you have visited and share useful travel experiences with the community.',
};

export default function AddExperiencePage() {
  return (
    <main className="min-h-screen pb-20 bg-[var(--color-bg-subtle)]" style={{ paddingTop: '120px' }}>
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto bg-[var(--color-bg-surface-elevated)] border border-[var(--color-border-subtle)] rounded-2xl p-6 md:p-10 shadow-sm">
          <div className="mb-8">
            <h1 className="font-serif text-3xl font-bold text-[var(--color-text-primary)] mb-2">
              Share Your Experience
            </h1>
            <p className="text-[var(--color-text-secondary)]">
              Document your journey, rate the destination, and help future travelers with your first-hand knowledge.
            </p>
          </div>
          
          <ExperienceForm />
        </div>
      </div>
    </main>
  );
}
