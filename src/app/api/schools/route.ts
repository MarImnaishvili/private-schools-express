//app/api/schools/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { schoolSchema } from "@/schemas/schema";
import { ZodError } from "zod";
import { sanitizeString, sanitizeUrl, sanitizePhone } from "@/lib/sanitize";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    // Check if pagination is requested
    const pageParam = searchParams.get("page");
    const pageSizeParam = searchParams.get("pageSize");

    // If no pagination params, return all schools (for grid client-side pagination)
    if (!pageParam && !pageSizeParam) {
      const schools = await prisma.schoolData.findMany({
        include: {
          address: true,
          infrastructure: true,
          primary: { include: { media: true } },
          basic: { include: { media: true } },
          secondary: { include: { media: true } },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return NextResponse.json(schools, { status: 200 });
    }

    // Server-side pagination (for future use)
    const page = parseInt(pageParam || "1");
    const pageSize = parseInt(pageSizeParam || "50");
    const skip = (page - 1) * pageSize;
    const totalCount = await prisma.schoolData.count();

    const schools = await prisma.schoolData.findMany({
      skip,
      take: pageSize,
      include: {
        address: true,
        infrastructure: true,
        primary: { include: { media: true } },
        basic: { include: { media: true } },
        secondary: { include: { media: true } },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({
      data: schools,
      pagination: {
        page,
        pageSize,
        totalCount,
        totalPages: Math.ceil(totalCount / pageSize),
      },
    }, { status: 200 });
  } catch (error) {
    console.error("GET /api/schools error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch schools",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validate request body with Zod
    const validatedData = schoolSchema.parse(body);

    const newSchool = await prisma.schoolData.create({
      data: {
        name: sanitizeString(validatedData.name),
        phoneNumber1: sanitizePhone(body.phoneNumber1?.toString()),
        phoneNumber2: sanitizePhone(body.phoneNumber2?.toString()),
        phoneNumber3: sanitizePhone(body.phoneNumber3?.toString()),
        schoolsWebSite: sanitizeUrl(body.schoolsWebSite),
        facebookProfileURL: sanitizeUrl(body.facebookProfileURL),
        instagramProfileURL: sanitizeUrl(body.instagramProfileURL),
        founder: body.founder,
        director: body.director,
        publicRelationsManager: body.publicRelationsManager,
        parentRelationshipManager: body.parentRelationshipManager,
        establishedYear: body.establishedYear,
        accreditationStatus: body.accreditationStatus,
        accreditationComment: body.accreditationComment,
        graduationRate: body.graduationRate,
        averageNationalExamScore: body.averageNationalExamScore,
        description: body.description,
        hasTutor: body.hasTutor,
        tutorDescription: body.tutorDescription,
        hasScholarshipsGrants: body.hasScholarshipsGrants,
        scholarshipsGrants: body.scholarshipsGrants,
        hasExchangePrograms: body.hasExchangePrograms,
        exchangePrograms: body.exchangePrograms,
        hasOutdoorGarden: body.hasOutdoorGarden,
        outdoorGarden: body.outdoorGarden,
        otherPrograms: body.otherPrograms || "", // now a string column
        address: {
          create: {
            city: body.address.city,
            street: body.address.street,
            zipCode: body.address.zipCode?.toString() || "",
            district: body.address.district,
          },
        },

        infrastructure: {
          create: {
            buildings: body.infrastructure.buildings,
            numberOfFloors: body.infrastructure.numberOfFloors,
            squareness: body.infrastructure.squareness,
            stadiums: body.infrastructure.stadiums,
            pools: body.infrastructure.pools,
            courtyard: body.infrastructure.courtyard,
            laboratories: body.infrastructure.laboratories,
            library: body.infrastructure.library,
            cafe: body.infrastructure.cafe,
          },
        },

        primary: {
          create: {
            price: body.primary.price,
            duration: body.primary.duration,
            discountAndPaymentTerms: body.primary.discountAndPaymentTerms,
            numberOfStudents: body.primary.numberOfStudents,
            meals: body.primary.meals,
            mealsDescription: body.primary.mealsDescription,
            transportation: body.primary.transportation,
            schoolUniform: body.primary.schoolUniform,
            mandatorySportsClubs: Array.isArray(
              body.primary.mandatorySportsClubs
            )
              ? body.primary.mandatorySportsClubs.join(",")
              : body.primary.mandatorySportsClubs,

            teachingStyleBooks: body.primary.teachingStyleBooks,
            textbooksPrice: body.primary.textbooksPrice || "",
            clubsAndCircles: body.primary.clubsAndCircles,
            foreignLanguages: Array.isArray(body.primary.foreignLanguages)
              ? body.primary.foreignLanguages.join(",")
              : body.primary.foreignLanguages,
            media: body.primary.schoolUniformPhotoUrls?.length
              ? {
                  create: body.primary.schoolUniformPhotoUrls.map(
                    (url: string) => ({
                      url,
                      type: "photo",
                    })
                  ),
                }
              : undefined,
          },
        },
        basic: {
          create: {
            price: body.basic.price,
            schoolUniform: body.basic.schoolUniform,
            discountAndPaymentTerms: body.basic.discountAndPaymentTerms,
            numberOfStudents: body.basic.numberOfStudents,
            meals: body.basic.meals,
            mealsDescription: body.basic.mealsDescription,
            transportation: body.basic.transportation,
            mandatorySportsClubs: Array.isArray(body.basic.mandatorySportsClubs)
              ? body.basic.mandatorySportsClubs.join(",")
              : body.basic.mandatorySportsClubs,

            teachingStyleBooks: body.basic.teachingStyleBooks,
            textbooksPrice: body.basic.textbooksPrice || "",
            clubsAndCircles: body.basic.clubsAndCircles,
            duration: body.basic.duration,
            foreignLanguages: body.basic.foreignLanguages,
            media: body.basic.schoolUniformPhotoUrls?.length
              ? {
                  create: body.basic.schoolUniformPhotoUrls.map(
                    (url: string) => ({
                      url,
                      type: "photo",
                    })
                  ),
                }
              : undefined,
          },
        },
        secondary: {
          create: {
            price: body.secondary.price,
            schoolUniform: body.secondary.schoolUniform,
            discountAndPaymentTerms: body.secondary.discountAndPaymentTerms,
            numberOfStudents: body.secondary.numberOfStudents,
            meals: body.secondary.meals,
            mealsDescription: body.secondary.mealsDescription,
            foreignLanguages: body.secondary.foreignLanguages,
            transportation: body.secondary.transportation,
            mandatorySportsClubs: Array.isArray(
              body.secondary.mandatorySportsClubs
            )
              ? body.secondary.mandatorySportsClubs.join(",")
              : body.secondary.mandatorySportsClubs,

            teachingStyleBooks: body.secondary.teachingStyleBooks,
            textbooksPrice: body.secondary.textbooksPrice || "",
            clubsAndCircles: body.secondary.clubsAndCircles,
            duration: body.secondary.duration,
            media: body.secondary.schoolUniformPhotoUrls?.length
              ? {
                  create: body.secondary.schoolUniformPhotoUrls.map(
                    (url: string) => ({
                      url,
                      type: "photo",
                    })
                  ),
                }
              : undefined,
          },
        },
      },
    });
    return NextResponse.json(newSchool, { status: 201 });
  } catch (error) {
    console.error("POST /api/schools error:", error);

    // Handle Zod validation errors
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: error.errors.map(err => ({
            field: err.path.join("."),
            message: err.message
          }))
        },
        { status: 400 }
      );
    }

    // Handle other errors
    return NextResponse.json(
      {
        error: "Failed to create school",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
