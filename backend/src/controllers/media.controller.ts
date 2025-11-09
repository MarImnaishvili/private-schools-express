import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

type IncomingMediaItem = {
  mediaUrl: string;
  description: string;
  type: "photo" | "video";
  attachedTo: "school" | "primary" | "basic" | "secondary";
  attachedId: string | number;
};

/**
 * POST /api/media
 * Create multiple media items
 */
export const createMedia = async (req: Request, res: Response): Promise<void> => {
  try {
    const mediaItems: IncomingMediaItem[] = req.body;

    if (!Array.isArray(mediaItems)) {
      res.status(400).json({ error: "Invalid input: not an array" });
      return;
    }

    const validItems: any[] = [];

    for (const item of mediaItems) {
      if (
        typeof item.mediaUrl !== "string" ||
        (typeof item.attachedId !== "number" && typeof item.attachedId !== "string") ||
        !["photo", "video"].includes(item.type) ||
        !["school", "primary", "basic", "secondary"].includes(item.attachedTo)
      ) {
        res.status(400).json({
          error: `Invalid media item: ${JSON.stringify(item)}`
        });
        return;
      }

      const base = {
        mediaUrl: item.mediaUrl,
        description: item.description,
        type: item.type,
        attachedTo: item.attachedTo,
      };

      const id = String(item.attachedId);

      switch (item.attachedTo) {
        case "school":
          validItems.push({ ...base, schoolId: id });
          break;
        case "primary":
          validItems.push({ ...base, primaryLevelId: id });
          break;
        case "basic":
          validItems.push({ ...base, basicLevelId: id });
          break;
        case "secondary":
          validItems.push({ ...base, secondaryLevelId: id });
          break;
      }
    }

    if (validItems.length === 0) {
      res.status(400).json({ error: "No valid media items" });
      return;
    }

    await prisma.media.createMany({ data: validItems });

    res.status(201).json({ message: "Media saved successfully" });
  } catch (error) {
    console.error("❌ Failed to save media:", error);
    res.status(500).json({ error: "Failed to save media" });
  }
};
