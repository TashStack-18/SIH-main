import { Metadata } from 'next';
import { ExperienceDetail } from '@/src/app/components/experience/ExperienceDetail';

export const metadata: Metadata = {
  title: 'Traveler Experience | Dishaara',
  description: 'Read first-hand travel experiences and practical tips from the community.',
};

export default function ExperienceDetailPage({ params }: { params: { id: string } }) {
  return (
    <main className="min-h-screen pt-24 pb-20 bg-[var(--color-bg-subtle)]">
      <div className="container mx-auto px-4">
        <ExperienceDetail id={params.id} />
      </div>
    </main>
  );
}
