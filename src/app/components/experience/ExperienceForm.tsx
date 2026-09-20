"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { VERIFIED_DESTINATIONS } from "@/src/lib/fixtures";

interface PhotoPreview {
  file?: File;
  url: string;
}

export function ExperienceForm() {
  const router = useRouter();
  
  const [destinationId, setDestinationId] = useState("");
  const [title, setTitle] = useState("");
  const [userName, setUserName] = useState("");
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [text, setText] = useState("");
  const [travelTips, setTravelTips] = useState("");
  const [photos, setPhotos] = useState<PhotoPreview[]>([]);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      const newPhotos = selectedFiles.map((file) => ({
        file,
        url: URL.createObjectURL(file),
      }));
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

    const selectedDest = VERIFIED_DESTINATIONS.find((d) => d.id === destinationId);

    try {
      if (photos.length > 0) {
        await new Promise((resolve) => setTimeout(resolve, photos.length * 200));
      }

      const photoUrls = photos.map((p) => p.url);
      const defaultPhoto = selectedDest?.image || "/images/Pangong Tso.jpeg";

      const res = await fetch("/api/v1/experience", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          destinationId,
          destinationName: selectedDest?.name || "Verified Bharat Destination",
          territoryId: selectedDest?.territoryId || "UT",
          territoryName: selectedDest?.territoryName || "Union Territory",
          title: title.trim() || (selectedDest ? `Memories from ${selectedDest.name}` : "My Bharat Journey"),
          rating: Number(rating),
          text,
          travelTips: travelTips.trim() || undefined,
          photos: photoUrls.length > 0 ? photoUrls : [defaultPhoto],
          userId: userName.trim().toLowerCase().replace(/\s+/g, "_") || "community_traveler",
          userName: userName.trim() || "Community Traveler",
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || "Failed to submit experience");

      router.push("/experience");
      router.refresh();
      
    } catch (err: any) {
      setError(err.message || "Failed to publish experience");
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-200">
          {error}
        </div>
      )}

      {/* 1. Destination Select */}
      <div className="flex flex-col gap-2">
        <label htmlFor="destination" className="text-xs font-bold uppercase tracking-wider text-[#172B5B]">
          Where did you explore? <span className="text-red-500">*</span>
        </label>
        <select
          id="destination"
          value={destinationId}
          onChange={(e) => setDestinationId(e.target.value)}
          disabled={isSubmitting}
          required
          className="w-full px-4 py-3 bg-[#F7F6F1] border border-[#172B5B]/15 rounded-xl text-sm text-[#172B5B] focus:outline-none focus:border-[#159BC5] cursor-pointer"
        >
          <option value="" disabled>Select a destination across the 8 Union Territories...</option>
          {VERIFIED_DESTINATIONS.map((dest) => (
            <option key={dest.id} value={dest.id}>
              {dest.name} — {dest.territoryName}
            </option>
          ))}
        </select>
      </div>

      {/* 2. Story Headline */}
      <div className="flex flex-col gap-2">
        <label htmlFor="title" className="text-xs font-bold uppercase tracking-wider text-[#172B5B]">
          Story Headline
        </label>
        <input
          id="title"
          type="text"
          placeholder="e.g. Kayaking through hidden beaches & mangroves"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={isSubmitting}
          className="w-full px-4 py-3 bg-[#F7F6F1] border border-[#172B5B]/15 rounded-xl text-sm text-[#172B5B] placeholder:text-[#7980A3] focus:outline-none focus:border-[#159BC5]"
        />
      </div>

      {/* 3. Rating */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold uppercase tracking-wider text-[#172B5B]">
          Your Rating <span className="text-red-500">*</span>
        </label>
        <div className="flex items-center gap-2" onMouseLeave={() => setHoverRating(0)}>
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              disabled={isSubmitting}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              className="p-1 focus:outline-none transition-transform hover:scale-110 cursor-pointer"
              aria-label={`Rate ${star} stars`}
            >
              <svg 
                width="28" 
                height="28" 
                viewBox="0 0 24 24" 
                fill={(hoverRating || rating) >= star ? "#D4A94E" : "none"} 
                stroke={(hoverRating || rating) >= star ? "#D4A94E" : "#7980A3"} 
                strokeWidth="1.5"
                className="transition-colors"
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
            </button>
          ))}
          <span className="text-sm font-serif font-bold text-[#172B5B] ml-2">
            {(hoverRating || rating)}.0 / 5.0
          </span>
        </div>
      </div>

      {/* 4. Story Text */}
      <div className="flex flex-col gap-2">
        <label htmlFor="experience" className="text-xs font-bold uppercase tracking-wider text-[#172B5B]">
          Your Story & Reflections <span className="text-red-500">*</span>
        </label>
        <textarea
          id="experience"
          rows={5}
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={isSubmitting}
          required
          placeholder="Describe your journey, encounters with locals, scenic views, and unforgettable moments..."
          className="w-full bg-[#F7F6F1] border border-[#172B5B]/15 rounded-xl px-4 py-3 text-sm text-[#172B5B] placeholder:text-[#7980A3] focus:outline-none focus:border-[#159BC5] resize-y"
        />
      </div>

      {/* 5. Practical Tips */}
      <div className="flex flex-col gap-2">
        <label htmlFor="tips" className="text-xs font-bold uppercase tracking-wider text-[#172B5B]">
          Practical Recommendations / Hidden Tips (Optional)
        </label>
        <input
          id="tips"
          type="text"
          placeholder="e.g. Best time for photography, local permits, must-try food stall..."
          value={travelTips}
          onChange={(e) => setTravelTips(e.target.value)}
          disabled={isSubmitting}
          className="w-full px-4 py-3 bg-[#F7F6F1] border border-[#172B5B]/15 rounded-xl text-sm text-[#172B5B] placeholder:text-[#7980A3] focus:outline-none focus:border-[#159BC5]"
        />
      </div>

      {/* 6. Author Name */}
      <div className="flex flex-col gap-2">
        <label htmlFor="author" className="text-xs font-bold uppercase tracking-wider text-[#172B5B]">
          Your Name
        </label>
        <input
          id="author"
          type="text"
          placeholder="e.g. Simran Kaur"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          disabled={isSubmitting}
          className="w-full px-4 py-3 bg-[#F7F6F1] border border-[#172B5B]/15 rounded-xl text-sm text-[#172B5B] placeholder:text-[#7980A3] focus:outline-none focus:border-[#159BC5]"
        />
      </div>

      {/* 7. Photos */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold uppercase tracking-wider text-[#172B5B]">
          Travel Photography (Up to 5 Photos)
        </label>
        <div className="flex flex-wrap gap-4 mt-1">
          {photos.map((photo, idx) => (
            <div 
              key={idx} 
              className="relative w-28 h-20 rounded-xl overflow-hidden border border-[#172B5B]/15 bg-white shadow-sm"
            >
              <img src={photo.url} alt="Preview" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removePhoto(idx)}
                disabled={isSubmitting}
                className="absolute top-1.5 right-1.5 w-6 h-6 bg-black/60 text-white rounded-full flex items-center justify-center text-xs backdrop-blur-sm hover:bg-black/80"
              >
                ✕
              </button>
            </div>
          ))}

          {photos.length < 5 && (
            <label className="w-28 h-20 flex flex-col items-center justify-center border-2 border-dashed border-[#172B5B]/20 rounded-xl cursor-pointer hover:border-[#159BC5] hover:text-[#159BC5] text-[#7980A3] transition-colors">
              <span className="text-xl font-bold">+</span>
              <span className="text-[11px] font-bold">Add Photo</span>
              <input 
                type="file" 
                accept="image/*" 
                multiple 
                onChange={handlePhotoSelect} 
                className="hidden"
                disabled={isSubmitting}
              />
            </label>
          )}
        </div>
      </div>

      {/* Submit CTA */}
      <div className="pt-4 border-t border-[#172B5B]/10">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 rounded-full bg-[#172B5B] text-white font-bold text-sm tracking-wide shadow-md hover:bg-[#323652] hover:shadow-lg disabled:opacity-70 transition-all cursor-pointer"
        >
          {isSubmitting ? (
            <span className="inline-flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
              Publishing Your Story...
            </span>
          ) : (
            "Publish Experience →"
          )}
        </button>
      </div>
    </form>
  );
}
