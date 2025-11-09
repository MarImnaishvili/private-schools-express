/* eslint-disable @typescript-eslint/no-explicit-any */
// components/forms/MediaManager.tsx
import React from "react";
import { useTranslations } from "next-intl";

export interface MediaItem {
  mediaUrl: string;
  description: string;
  type: "photo" | "video";
  attachedTo: "school" | "primary" | "basic" | "secondary";
  attachedId: number; // NEW
}

interface MediaManagerProps {
  media: MediaItem[];
  onChange: (media: MediaItem[]) => void;
}

export default function MediaManager({ media, onChange }: MediaManagerProps) {
  const tMedia = useTranslations("media");
  const handleChange = (index: number, field: keyof MediaItem, value: any) => {
    const newMedia = [...media];
    (newMedia[index][field] as any) = value;
    onChange(newMedia);
  };

  const handleAdd = () => {
    onChange([
      ...media,
      {
        mediaUrl: "",
        description: "",
        type: "photo",
        attachedTo: "school",
        attachedId: 0, // ✅ default to 0 or any placeholder number
      },
    ]);
  };

  const handleRemove = (index: number) => {
    const newMedia = media.filter((_, i) => i !== index);
    onChange(newMedia);
  };

  return (
    <div>
      <h2>{tMedia("MediaItems")}</h2>
      {media.map((item, i) => (
        <div key={i} className="mb-4 border p-2 rounded">
          <input
            type="text"
            placeholder="Media URL"
            value={item.mediaUrl}
            onChange={(e) => handleChange(i, "mediaUrl", e.target.value)}
            className="block mb-1 w-full"
          />
          <input
            type="text"
            placeholder={tMedia("Description")}
            value={item.description}
            onChange={(e) => handleChange(i, "description", e.target.value)}
            className="block mb-1 w-full"
          />
          <input
            type="number"
            placeholder="Attached ID"
            value={item.attachedId}
            onChange={(e) =>
              handleChange(i, "attachedId", Number(e.target.value))
            }
            className="block mb-1 w-full"
          />

          <select
            value={item.type}
            onChange={(e) =>
              handleChange(i, "type", e.target.value as "photo" | "video")
            }
            className="block mb-1 w-full"
          >
            <option value="photo">{tMedia("Photo")}</option>
            <option value="video">{tMedia("Video")}</option>
          </select>
          <select
            value={item.attachedTo}
            onChange={(e) =>
              handleChange(
                i,
                "attachedTo",
                e.target.value as "school" | "primary" | "basic" | "secondary"
              )
            }
            className="block mb-1 w-full"
          >
            <option value="school">{tMedia("School")}</option>
            <option value="primary">{tMedia("Primary")}</option>
            <option value="basic">{tMedia("Basic")}</option>
            <option value="secondary">{tMedia("Secondary")}</option>
          </select>
          <button onClick={() => handleRemove(i)} className="text-red-600">
            {tMedia("Remove")}
          </button>
        </div>
      ))}
      <button
        onClick={handleAdd}
        className="bg-blue-600 text-white px-3 py-1 rounded"
      >
        {tMedia("AddMediaItem")}
      </button>
    </div>
  );
}
