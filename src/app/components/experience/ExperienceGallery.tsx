"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { VERIFIED_DESTINATIONS } from "@/src/lib/fixtures";
import type { ExperienceRecord } from "@/src/lib/api/experienceStore";

export function ExperienceGallery() {
  const [experiences, setExperiences] = useState<ExperienceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchExperiences() {
      try {
        const res = await fetch("/api/v1/experience");
        if (!res.ok) throw new Error("Failed to fetch experiences");
        const data = await res.json();
        if (data.success) {
          setExperiences(data.data.experiences || []);
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
    fetchExperiences();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="w-8 h-8 border-4 border-[var(--color-border-subtle)] border-t-[var(--color-accent)] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-[var(--color-danger)]">
        <p>Failed to load experiences. Please try again later.</p>
      </div>
    );
  }

  if (experiences.length === 0) {
    return (
      <div className="text-center py-20 border border-dashed border-[var(--color-border-subtle)] rounded-2xl bg-[var(--color-bg-surface)]">
        <h3 className="text-xl font-serif text-[var(--color-text-primary)] mb-2">No Experiences Yet</h3>
        <p className="text-[var(--color-text-secondary)] mb-6">Be the first traveler to share your experience.</p>
        <Link href="/experience/add" className="btn btn-outline btn-sm">
          Share Your Experience
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {experiences.map((exp) => {
        const dest = VERIFIED_DESTINATIONS.find((d) => d.id === exp.destinationId);
        
        return (
          <div key={exp.id} className="card card-hoverable flex flex-col overflow-hidden bg-[var(--color-bg-surface-elevated)] border border-[var(--color-border-subtle)] rounded-2xl">
            {exp.photos && exp.photos.length > 0 ? (
              <div className="relative w-full aspect-video bg-[var(--color-bg-surface)] overflow-hidden">
                <img 
                  src={exp.photos[0]} 
                  alt={`Experience at ${dest?.name || 'Destination'}`}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
                {exp.photos.length > 1 && (
                  <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs font-bold px-2 py-1 rounded-md backdrop-blur-md">
                    1/{exp.photos.length}
                  </div>
                )}
              </div>
            ) : (
              <div className="w-full aspect-video bg-[var(--color-bg-surface)] flex items-center justify-center border-b border-[var(--color-border-subtle)]">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" strokeWidth="1.5">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <circle cx="8.5" cy="8.5" r="1.5"></circle>
                  <polyline points="21 15 16 10 5 21"></polyline>
                </svg>
              </div>
            )}
            
            <div className="p-6 flex flex-col flex-grow">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-serif text-lg font-bold text-[var(--color-text-primary)]">
                    {dest?.name || "Unknown Destination"}
                  </h3>
                  <div className="text-xs font-semibold text-[var(--color-brand-accent)] mt-1">
                    {dest?.territoryName || ""}
                  </div>
                </div>
                <div className="flex items-center gap-1 bg-[var(--color-bg-surface)] px-2 py-1 rounded-md border border-[var(--color-border-subtle)]">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="var(--color-accent)" stroke="var(--color-accent)" strokeWidth="2">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                  </svg>
                  <span className="text-xs font-bold text-[var(--color-text-primary)]">{exp.rating.toFixed(1)}</span>
                </div>
              </div>
              
              <p className="text-sm text-[var(--color-text-secondary)] line-clamp-3 mb-4 flex-grow">
                "{exp.text}"
              </p>
              
              <div className="flex items-center justify-between pt-4 border-t border-[var(--color-border-subtle)] mt-auto">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[var(--color-accent)]/20 flex items-center justify-center text-[var(--color-accent)] text-xs font-bold">
                    {exp.userId.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-xs font-medium text-[var(--color-text-secondary)] truncate max-w-[100px]">
                    {exp.userId === 'anonymous_traveler' ? 'Anonymous' : exp.userId}
                  </span>
                </div>
                <Link href={`/experience/${exp.id}`} className="text-xs font-bold text-[var(--color-brand-accent)] hover:underline">
                  Read Full →
                </Link>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
