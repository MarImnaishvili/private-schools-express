// app/api/schools/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { sanitizeString, sanitizeUrl, sanitizePhone } from "@/lib/sanitize";

const uuidSchema = z.string().uuid();

interface NestedUpdateData {
  address?: Record<string, unknown>;
  infrastructure?: Record<string, unknown>;
  primary?: Record<string, unknown>;
  basic?: Record<string, unknown>;
  secondary?: Record<string, unknown>;
  [key: string]: unknown;
}

function sanitizeSchoolData(data: NestedUpdateData): NestedUpdateData {
  const sanitized: NestedUpdateData = {};

  // Sanitize top-level string fields
  if (data.name !== undefined) sanitized.name = sanitizeString(String(data.name));
  if (data.phoneNumber1 !== undefined) sanitized.phoneNumber1 = sanitizePhone(String(data.phoneNumber1));
  if (data.phoneNumber2 !== undefined) sanitized.phoneNumber2 = sanitizePhone(String(data.phoneNumber2));
  if (data.phoneNumber3 !== undefined) sanitized.phoneNumber3 = sanitizePhone(String(data.phoneNumber3));
  if (data.schoolsWebSite !== undefined) sanitized.schoolsWebSite = sanitizeUrl(String(data.schoolsWebSite));
  if (data.facebookProfileURL !== undefined) sanitized.facebookProfileURL = sanitizeUrl(String(data.facebookProfileURL));
  if (data.instagramProfileURL !== undefined) sanitized.instagramProfileURL = sanitizeUrl(String(data.instagramProfileURL));
  if (data.description !== undefined) sanitized.description = sanitizeString(String(data.description));

  // Copy other fields as-is (numbers, booleans, etc.)
  const fieldsToSkip = ['name', 'phoneNumber1', 'phoneNumber2', 'phoneNumber3', 'schoolsWebSite', 'facebookProfileURL', 'instagramProfileURL', 'description', 'address', 'infrastructure', 'primary', 'basic', 'secondary'];
  Object.keys(data).forEach(key => {
    if (!fieldsToSkip.includes(key)) {
      sanitized[key] = data[key];
    }
  });

  // Copy nested objects
  if (data.address) sanitized.address = data.address;
  if (data.infrastructure) sanitized.infrastructure = data.infrastructure;
  if (data.primary) sanitized.primary = data.primary;
  if (data.basic) sanitized.basic = data.basic;
  if (data.secondary) sanitized.secondary = data.secondary;

  return sanitized;
}

function transformNestedUpdates(data: NestedUpdateData) {
  const { address, infrastructure, primary, basic, secondary, ...rest } = data;

  return {
    ...rest,
    ...(address && { address: { update: address } }),
    ...(infrastructure && { infrastructure: { update: infrastructure } }),
    ...(primary && { primary: { update: primary } }),
    ...(basic && { basic: { update: basic } }),
    ...(secondary && { secondary: { update: secondary } }),
  };
}

// ✅ FIXED GET signature
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const id = url.pathname.split("/").pop(); // extract ID from the URL

  if (!id || !uuidSchema.safeParse(id).success) {
    return new NextResponse("Invalid ID", { status: 400 });
  }

  const school = await prisma.schoolData.findUnique({
    where: { id },
    include: {
      address: true,
      infrastructure: true,
      primary: true,
      basic: true,
      secondary: true,
    },
  });

  if (!school) {
    return new NextResponse("School not found", { status: 404 });
  }

  return NextResponse.json(school);
}

export async function PUT(req: NextRequest) {
  try {
    const id = req.nextUrl.pathname.split("/").pop();
    if (!id) {
      return new NextResponse("Missing school ID", { status: 400 });
    }

    const validId = uuidSchema.parse(id);
    const data = await req.json();
    const sanitizedData = sanitizeSchoolData(data);
    const transformedData = transformNestedUpdates(sanitizedData);

    const updated = await prisma.schoolData.update({
      where: { id: validId },
      data: transformedData,
      include: {
        address: true,
        infrastructure: true,
        primary: true,
        basic: true,
        secondary: true,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PUT /schoolData/:id error:", error);
    return new NextResponse(
      JSON.stringify({ message: "Failed to update school", error }),
      { status: 400 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const id = req.nextUrl.pathname.split("/").pop();
    if (!id) {
      return new NextResponse("Missing school ID", { status: 400 });
    }

    const validId = uuidSchema.parse(id);

    console.log("Deleting school with ID:", validId);

    const deleted = await prisma.schoolData.delete({
      where: { id: validId },
    });

    return NextResponse.json(deleted);
  } catch (error) {
    console.error("DELETE /api/schools/[id] error:", error);
    return new NextResponse("Failed to delete school", { status: 500 });
  }
}
