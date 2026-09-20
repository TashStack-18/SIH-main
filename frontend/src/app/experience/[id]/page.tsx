import { Metadata } from 'next';
import { ExperienceDetail } from '@/src/app/components/experience/ExperienceDetail';

export const metadata: Metadata = {
  title: 'Traveler Experience | Dishaara',
  description: 'Read first-hand travel experiences and practical tips from the community.',
};

export default async function ExperienceDetailPage({
  params,
}: {
  params: Promise<{ id: string }> | { id: string };
}) {
  const resolved = await params;
  return (
    <main className="min-h-screen pt-24 pb-20 bg-[var(--color-bg-subtle)]">
      <div className="container mx-auto px-4">
        <ExperienceDetail id={resolved.id} />
      </div>
    </main>
  );
}
