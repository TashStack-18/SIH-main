"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { VERIFIED_DESTINATIONS } from "@/src/lib/fixtures";
import type { ExperienceRecord } from "@/src/lib/api/experienceStore";

export function ExperienceDetail({ id }: { id: string }) {
  const [experience, setExperience] = useState<ExperienceRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchExperience() {
      try {
        const res = await fetch(`/api/v1/experience/${id}`);
        if (!res.ok) throw new Error("Failed to fetch experience details");
        const data = await res.json();
        if (data.success) {
          setExperience(data.data.experience);
        } else {
          throw new Error(data.error?.message || "Unknown error");
        }
      } catch (err: any) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchExperience();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-32">
        <div className="w-10 h-10 border-4 border-[var(--color-border-subtle)] border-t-[var(--color-accent)] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !experience) {
    return (
      <div className="text-center py-20 max-w-lg mx-auto">
        <h2 className="text-2xl font-serif font-bold text-[var(--color-text-primary)] mb-4">Experience Not Found</h2>
        <p className="text-[var(--color-text-secondary)] mb-8">
          The experience you are looking for may have been removed or does not exist.
        </p>
        <Link href="/experience" className="btn btn-primary">
          Back to Experiences
        </Link>
      </div>
    );
  }

  const dest = VERIFIED_DESTINATIONS.find((d) => d.id === experience.destinationId);

  return (
    <div className="max-w-4xl mx-auto">
      <Link href="/experience" className="inline-flex items-center gap-2 text-sm font-bold text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors mb-8">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
        Back to Experiences
      </Link>

      <div className="bg-[var(--color-bg-surface-elevated)] border border-[var(--color-border-subtle)] rounded-3xl overflow-hidden shadow-sm">
        {experience.photos && experience.photos.length > 0 && (
          <div className="w-full">
            {experience.photos.length === 1 ? (
              <div className="w-full aspect-video bg-[var(--color-bg-surface)]">
                <img 
                  src={experience.photos[0]} 
                  alt="Experience photo"
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-1 p-1 bg-[var(--color-bg-surface)]">
                {experience.photos.map((photo, idx) => (
                  <div 
                    key={idx} 
                    className={`relative bg-[var(--color-bg-surface-elevated)] overflow-hidden ${
                      idx === 0 ? 'col-span-2 row-span-2 aspect-square md:aspect-auto' : 'aspect-square'
                    }`}
                  >
                    <img 
                      src={photo} 
                      alt={`Experience photo ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="p-8 md:p-12">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8 pb-8 border-b border-[var(--color-border-subtle)]">
            <div>
              <Link href={`/destinations/${dest?.slug}`} className="inline-block text-xs font-bold text-[var(--color-brand-accent)] uppercase tracking-wider mb-2 hover:underline">
                {dest?.territoryName || "Union Territory"}
              </Link>
              <h1 className="font-serif text-3xl md:text-4xl font-bold text-[var(--color-text-primary)] mb-2">
                {dest?.name || "Unknown Destination"}
              </h1>
              
              <div className="flex items-center gap-4 text-sm text-[var(--color-text-secondary)] mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[var(--color-accent)]/20 flex items-center justify-center text-[var(--color-accent)] font-bold">
                    {experience.userId.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-medium text-[var(--color-text-primary)]">
                    {experience.userId === 'anonymous_traveler' ? 'Anonymous Traveler' : experience.userId}
                  </span>
                </div>
                <span>•</span>
                <span>{new Date(experience.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2 bg-[var(--color-bg-surface)] px-4 py-2 rounded-xl border border-[var(--color-border-subtle)]">
              <span className="text-2xl font-serif font-bold text-[var(--color-text-primary)]">
                {experience.rating.toFixed(1)}
              </span>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} width="20" height="20" viewBox="0 0 24 24" fill={experience.rating >= star ? "var(--color-accent)" : "none"} stroke={experience.rating >= star ? "var(--color-accent)" : "var(--color-border-subtle)"} strokeWidth="1.5">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                  </svg>
                ))}
              </div>
            </div>
          </div>

          <div className="prose prose-lg max-w-none prose-headings:font-serif prose-p:text-[var(--color-text-secondary)] prose-p:leading-relaxed">
            {experience.text.split('\n').map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
