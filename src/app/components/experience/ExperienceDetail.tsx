"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { VERIFIED_DESTINATIONS } from "@/src/lib/fixtures";
import type { ExperienceRecord } from "@/src/lib/api/experienceStore";

export function ExperienceDetail({ id }: { id: string }) {
  const [experience, setExperience] = useState<ExperienceRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState(false);

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

    try {
      const saved = localStorage.getItem("dishaara_fav_experiences");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed[id]) setIsLiked(true);
      }
    } catch {
      // ignore
    }
  }, [id]);

  const toggleLike = () => {
    const next = !isLiked;
    setIsLiked(next);
    try {
      const saved = localStorage.getItem("dishaara_fav_experiences");
      const current = saved ? JSON.parse(saved) : {};
      current[id] = next;
      localStorage.setItem("dishaara_fav_experiences", JSON.stringify(current));
    } catch {
      // ignore
    }
    if (experience) {
      setExperience({
        ...experience,
        likesCount: next ? (experience.likesCount || 0) + 1 : Math.max(0, (experience.likesCount || 1) - 1),
      });
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <div className="w-10 h-10 border-4 border-[#172B5B]/20 border-t-[#172B5B] rounded-full animate-spin"></div>
        <p className="text-xs font-bold text-[#7980A3] uppercase tracking-widest">Opening Traveler Journal...</p>
      </div>
    );
  }

  if (error || !experience) {
    return (
      <div className="text-center py-20 max-w-lg mx-auto bg-white rounded-3xl p-8 border border-[#172B5B]/10 shadow-sm">
        <div className="w-16 h-16 rounded-full bg-red-50 text-red-500 mx-auto mb-4 flex items-center justify-center text-2xl font-bold">
          !
        </div>
        <h2 className="text-2xl font-serif font-bold text-[#172B5B] mb-3">Experience Not Found</h2>
        <p className="text-sm text-[#5A6080] mb-8 leading-relaxed">
          The story you are looking for may have been moved or is no longer available.
        </p>
        <Link 
          href="/experience" 
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#172B5B] text-white font-bold text-xs uppercase tracking-wider hover:bg-[#323652] transition-colors"
        >
          ← Back to Traveler Journal
        </Link>
      </div>
    );
  }

  const dest = VERIFIED_DESTINATIONS.find((d) => d.id === experience.destinationId);
  const territoryLabel = experience.territoryName || dest?.territoryName || "Union Territory";
  const experienceTitle = experience.title || (dest ? dest.name : "Bharat Travel Experience");
  const authorName = experience.userName || (experience.userId === "anonymous_traveler" ? "Anonymous Traveler" : experience.userId);
  const formattedDate = new Date(experience.createdAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      {/* Top Breadcrumb / Back Navigation */}
      <div className="flex items-center justify-between gap-4 mb-8">
        <Link
          href="/experience"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#172B5B] hover:text-[#159BC5] transition-colors px-4 py-2 rounded-full bg-white border border-[#172B5B]/10 shadow-sm"
        >
          <span>←</span>
          <span>Back to All Stories</span>
        </Link>

        {/* Actions: Delete & Favorite */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={async () => {
              if (window.confirm("Are you sure you want to remove this travel experience?")) {
                try {
                  const res = await fetch(`/api/v1/experience/${id}`, { method: "DELETE" });
                  if (!res.ok) throw new Error("Failed to delete experience");
                  window.location.href = "/experience";
                } catch (err: any) {
                  alert(err.message || "Failed to remove experience");
                }
              }
            }}
            className="exp-delete-action-btn"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              <line x1="10" y1="11" x2="10" y2="17"></line>
              <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>
            <span>Remove Story</span>
          </button>

          {/* Favorite button */}
          <button
            type="button"
            onClick={toggleLike}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${
              isLiked
                ? "bg-red-50 text-red-500 border border-red-200 shadow-sm"
                : "bg-white text-[#172B5B] border border-[#172B5B]/10 hover:bg-[#F7F6F1]"
            }`}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill={isLiked ? "#EF4444" : "none"}
              stroke={isLiked ? "#EF4444" : "currentColor"}
              strokeWidth="2"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
            <span>{experience.likesCount || (isLiked ? 1 : 0)} Likes</span>
          </button>
        </div>
      </div>

      {/* Main Journal Entry Card */}
      <div className="bg-white border border-[#172B5B]/10 rounded-3xl overflow-hidden shadow-[0_8px_32px_rgba(23,43,91,0.06)]">
        
        {/* Photo Gallery Banner */}
        {experience.photos && experience.photos.length > 0 && (
          <div className="w-full bg-[#F7F6F1]">
            {experience.photos.length === 1 ? (
              <div className="w-full aspect-[16/9] sm:aspect-[21/9] overflow-hidden">
                <img
                  src={experience.photos[0]}
                  alt={experienceTitle}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-2 bg-[#F7F6F1]">
                <div className="sm:col-span-2 aspect-[16/10] overflow-hidden rounded-2xl">
                  <img
                    src={experience.photos[0]}
                    alt="Main photo"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-1 gap-2">
                  {experience.photos.slice(1, 3).map((p, idx) => (
                    <div key={idx} className="aspect-[16/10] overflow-hidden rounded-2xl">
                      <img
                        src={p}
                        alt={`Photo ${idx + 2}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="p-6 sm:p-10 lg:p-12">
          
          {/* Header Metadata */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 border-b border-[#172B5B]/10 mb-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#172B5B]/[0.06] text-[11px] font-bold text-[#172B5B] uppercase tracking-wider mb-3">
                <span>📍 {territoryLabel}</span>
                {dest && (
                  <>
                    <span>•</span>
                    <Link href={`/destinations/${dest.slug}`} className="text-[#159BC5] hover:underline">
                      {dest.name}
                    </Link>
                  </>
                )}
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#172B5B] leading-[1.18] mb-4">
                {experienceTitle}
              </h1>

              {/* Author Row */}
              <div className="flex items-center gap-3 text-xs sm:text-sm text-[#5A6080]">
                {experience.userAvatar ? (
                  <img
                    src={experience.userAvatar}
                    alt={authorName}
                    className="w-9 h-9 rounded-full object-cover border border-[#172B5B]/20"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-[#172B5B] text-white flex items-center justify-center font-bold text-sm">
                    {authorName.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <p className="font-bold text-[#172B5B]">{authorName}</p>
                  <p className="text-[11px] text-[#7980A3]">{formattedDate}</p>
                </div>
              </div>
            </div>

            {/* Rating Badge */}
            <div className="flex items-center sm:flex-col items-start sm:items-end gap-2 bg-[#F7F6F1] px-4 py-3 rounded-2xl border border-[#172B5B]/10 self-start">
              <div className="flex items-center gap-1 text-[#D4A94E]">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} width="18" height="18" viewBox="0 0 24 24" fill={experience.rating >= star ? "#D4A94E" : "none"} stroke={experience.rating >= star ? "#D4A94E" : "#7980A3"} strokeWidth="1.5">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                  </svg>
                ))}
              </div>
              <span className="text-xl font-serif font-bold text-[#172B5B]">
                {experience.rating.toFixed(1)} / 5.0
              </span>
            </div>
          </div>

          {/* Story Content */}
          <div className="space-y-6 text-base sm:text-lg text-[#323652] leading-relaxed font-sans">
            {experience.text.split("\n").map((para, idx) => (
              <p key={idx} className="first-letter:font-serif first-letter:text-4xl first-letter:font-bold first-letter:text-[#172B5B] first-letter:float-left first-letter:mr-2 first-letter:leading-none">
                {para}
              </p>
            ))}
          </div>

          {/* Practical Travel Tips Box */}
          {experience.travelTips && (
            <div className="mt-10 p-6 rounded-2xl bg-[#159BC5]/[0.08] border border-[#159BC5]/20 text-[#172B5B]">
              <div className="flex items-center gap-2 font-bold text-sm text-[#159BC5] uppercase tracking-wider mb-2">
                <span>💡 Practical Traveler Recommendation</span>
              </div>
              <p className="text-sm sm:text-base leading-relaxed text-[#464B71]">
                "{experience.travelTips}"
              </p>
            </div>
          )}

          {/* Destination Link CTA if destination matches */}
          {dest && (
            <div className="mt-12 pt-8 border-t border-[#172B5B]/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-xs text-[#7980A3] uppercase tracking-wider font-bold">Explore More</span>
                <h4 className="font-serif text-xl font-bold text-[#172B5B]">
                  Planning a visit to {dest.name}?
                </h4>
              </div>
              <Link
                href={`/destinations/${dest.slug}`}
                className="px-6 py-3 rounded-full bg-[#172B5B] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#323652] transition-colors"
              >
                View Destination Guide →
              </Link>
            </div>
          )}

        </div>
      </div>
    </article>
  );
}
