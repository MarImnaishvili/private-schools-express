// app/api/media/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type IncomingMediaItem = {
  mediaUrl: string;
  description: string;
  type: "photo" | "video";
  attachedTo: "school" | "primary" | "basic" | "secondary";
  attachedId: string | number; // may arrive as number
};

export async function POST(request: Request) {
  try {
    const mediaItems: IncomingMediaItem[] = await request.json();

    if (!Array.isArray(mediaItems)) {
      return NextResponse.json(
        { error: "Invalid input: not an array" },
        { status: 400 }
      );
    }

    const validItems = [];

    for (const item of mediaItems) {
      if (
        typeof item.mediaUrl !== "string" ||
        (typeof item.attachedId !== "number" &&
          typeof item.attachedId !== "string") ||
        !["photo", "video"].includes(item.type) ||
        !["school", "primary", "basic", "secondary"].includes(item.attachedTo)
      ) {
        return NextResponse.json(
          { error: `Invalid media item: ${JSON.stringify(item)}` },
          { status: 400 }
        );
      }

      const base = {
        mediaUrl: item.mediaUrl,
        description: item.description,
        type: item.type,
        attachedTo: item.attachedTo,
      };

      const id = String(item.attachedId); // ✅ Convert to string for Prisma

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
      return NextResponse.json(
        { error: "No valid media items" },
        { status: 400 }
      );
    }

    await prisma.media.createMany({ data: validItems });

    return NextResponse.json(
      { message: "Media saved successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Failed to save media:", error);
    return NextResponse.json(
      { error: "Failed to save media" },
      { status: 500 }
    );
  }
}
