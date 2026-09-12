"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { VERIFIED_DESTINATIONS } from "@/src/lib/fixtures";

interface PhotoPreview {
  file: File;
  url: string;
}

export function ExperienceForm() {
  const router = useRouter();
  
  const [destinationId, setDestinationId] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [text, setText] = useState("");
  const [photos, setPhotos] = useState<PhotoPreview[]>([]);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      const newPhotos = selectedFiles.map((file) => ({
        file,
        url: URL.createObjectURL(file), // Using object URL to mock upload preview
      }));
      
      // Limit to 5 photos for the mock
      setPhotos((prev) => [...prev, ...newPhotos].slice(0, 5));
    }
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!destinationId) return setError("Please select a destination.");
    if (!rating) return setError("Please provide a rating.");
    if (!text.trim()) return setError("Please write about your experience.");

    setIsSubmitting(true);
    setError(null);

    try {
      // Simulate photo upload delay (since we don't have a real S3 backend)
      if (photos.length > 0) {
        await new Promise(resolve => setTimeout(resolve, photos.length * 500));
      }

      // We send the object URLs as strings. In a real app, we'd send the S3/Cloudinary URLs.
      const photoUrls = photos.map(p => p.url);

      const res = await fetch("/api/v1/experience", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          destinationId,
          rating,
          text,
          photos: photoUrls,
          userId: "anonymous_traveler" // Mock user
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || "Failed to submit experience");

      // Redirect to the experience feed on success
      router.push("/experience");
      router.refresh();
      
    } catch (err: any) {
      setError(err.message);
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      {error && (
        <div className="bg-[var(--color-danger)]/10 text-[var(--color-danger)] p-4 rounded-lg text-sm border border-[var(--color-danger)]/20">
          {error}
        </div>
      )}

      {/* 1. Destination Select */}
      <div className="flex flex-col gap-2" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <label htmlFor="destination" className="text-sm font-bold text-[var(--color-text-primary)]">
          Where did you go? <span className="text-[var(--color-danger)]">*</span>
        </label>
        <select
          id="destination"
          value={destinationId}
          onChange={(e) => setDestinationId(e.target.value)}
          disabled={isSubmitting}
          className="w-full text-sm focus:outline-none transition-colors"
          style={{ border: 'none', backgroundColor: 'var(--color-bg-surface-elevated)', borderRadius: '9999px', padding: '12px 24px', outline: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}
        >
          <option value="" disabled>Select a destination...</option>
          {VERIFIED_DESTINATIONS.map(dest => (
            <option key={dest.id} value={dest.id}>
              {dest.name} ({dest.territoryName})
            </option>
          ))}
        </select>
      </div>

      {/* 2. Photos */}
      <div className="flex flex-col gap-2" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <label className="text-sm font-bold text-[var(--color-text-primary)]">
          Photos
        </label>
        <p className="text-xs text-[var(--color-text-secondary)] mb-2">
          Upload up to 5 photos to share the visual experience.
        </p>
        
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
          {photos.map((photo, idx) => (
            <div key={idx} style={{ position: 'relative', width: '240px', height: '140px', borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--color-border-subtle)', backgroundColor: 'var(--color-bg-surface-elevated)', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
              <img src={photo.url} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <button
                type="button"
                onClick={() => removePhoto(idx)}
                disabled={isSubmitting}
                style={{ position: 'absolute', top: '12px', right: '12px', width: '28px', height: '28px', backgroundColor: 'rgba(0,0,0,0.6)', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: 'none', fontSize: '14px', backdropFilter: 'blur(4px)' }}
              >
                ✕
              </button>
            </div>
          ))}

          {photos.length < 5 && (
            <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '2px dashed var(--color-border-subtle)', borderRadius: '16px', cursor: 'pointer', backgroundColor: 'transparent', width: '240px', height: '140px', transition: 'all 0.2s ease', opacity: 0.8 }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-primary)" strokeWidth="2" style={{ marginBottom: '8px' }}>
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-text-primary)' }}>Add Photo</span>
              <input 
                type="file" 
                accept="image/*" 
                multiple 
                onChange={handlePhotoSelect} 
                style={{ display: 'none' }}
                disabled={isSubmitting}
              />
            </label>
          )}
        </div>
      </div>

      {photos.length > 0 && (
        <>
          {/* 3. Rating */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-[var(--color-text-primary)]">
              Rating <span className="text-[var(--color-danger)]">*</span>
            </label>
            <div className="flex gap-2" onMouseLeave={() => setHoverRating(0)}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  className="w-10 h-10 flex items-center justify-center focus:outline-none transition-transform hover:scale-110 disabled:opacity-50 disabled:hover:scale-100"
                  aria-label={`Rate ${star} stars`}
                >
                  <svg 
                    width="28" 
                    height="28" 
                    viewBox="0 0 24 24" 
                    fill={(hoverRating || rating) >= star ? "var(--color-accent)" : "none"} 
                    stroke={(hoverRating || rating) >= star ? "var(--color-accent)" : "var(--color-border-subtle)"} 
                    strokeWidth="1.5"
                    className="transition-colors"
                  >
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                  </svg>
                </button>
              ))}
            </div>
          </div>

          {/* 4. Comment / Experience */}
          <div className="flex flex-col gap-2" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label htmlFor="experience" className="text-sm font-bold text-[var(--color-text-primary)]">
              Your Experience <span className="text-[var(--color-danger)]">*</span>
            </label>
            <p className="text-xs text-[var(--color-text-secondary)] mb-1">
              What did you enjoy? What should another traveler know?
            </p>
            <textarea
              id="experience"
              rows={5}
              value={text}
              onChange={(e) => setText(e.target.value)}
              disabled={isSubmitting}
              placeholder="Share details about your visit, practical tips, best time to go, crowd levels..."
              className="w-full bg-[var(--color-bg-surface)] border border-[var(--color-border-subtle)] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[var(--color-accent)] transition-colors resize-y"
              style={{ border: '1px solid var(--color-border-subtle)', backgroundColor: 'var(--color-bg-surface)' }}
            />
          </div>
        </>
      )}

      <div className="pt-4 border-t border-[var(--color-border-subtle)]" style={{ paddingTop: '16px', borderTop: '1px solid var(--color-border-subtle)' }}>
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn btn-primary w-full py-4 text-base font-bold flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          style={{ padding: '16px', borderRadius: '8px', minHeight: '56px' }}
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Publishing...
            </>
          ) : (
            "Publish Experience"
          )}
        </button>
      </div>
    </form>
  );
}
