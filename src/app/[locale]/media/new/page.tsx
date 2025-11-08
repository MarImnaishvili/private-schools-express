//sra/[locale]/media/new/page.tsx
"use client";

import { useState } from "react";
import MediaManager, { MediaItem } from "@/components/forms/MediaManager";
import { useTranslations } from "next-intl";

export default function NewMediaPage() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const tMedia = useTranslations("media");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Call your API to save media, e.g. /api/media POST
    const response = await fetch("/api/media", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(media),
    });

    if (response.ok) {
      alert("Media saved successfully!");
      setMedia([]); // reset form
    } else {
      alert("Failed to save media");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-teal-50 p-6">
      <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">{tMedia("Add New Media")}</h1>
      <form onSubmit={handleSubmit}>
        <MediaManager media={media} onChange={setMedia} />
        <button
          type="submit"
          className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
        >
          {tMedia("Save Media")}
        </button>
      </form>
      </div>
    </div>
  );
}
