import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { schoolSchema } from '../schemas/school.schema';
import { ZodError } from 'zod';
import { sanitizeString, sanitizeUrl, sanitizePhone } from '../utils/sanitize';

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

/**
 * GET /api/schools
 * Fetch all schools with optional pagination
 * Public access: Returns all schools
 * Authenticated access: Admins see all, Employees see only their own
 */
export const getAllSchools = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page, pageSize, lightweight } = req.query;
    const userId = req.user?.id;
    const userRole = req.userRole;

    // Build where clause based on authentication and role
    let whereClause = {};

    // If user is authenticated, apply role-based filtering
    if (userId && userRole) {
      whereClause = userRole === 'admin'
        ? {} // Admins see all schools
        : { createdBy: userId }; // Employees see only their schools
    }
    // If not authenticated, show all schools (public access)

    // Determine include based on lightweight mode
    const includeClause = lightweight === 'true'
      ? {
          // Lightweight mode: only fields needed for grid display
          address: {
            select: {
              city: true,
              district: true,
              street: true,
              zipCode: true,
            }
          },
          creator: {
            select: {
              id: true,
              email: true,
            }
          }
        }
      : {
          // Full mode: include all relations
          address: true,
          infrastructure: true,
          primary: { include: { media: true } },
          basic: { include: { media: true } },
          secondary: { include: { media: true } },
          creator: {
            select: {
              id: true,
              email: true,
            }
          }
        };

    // If no pagination params, return all schools (for grid client-side pagination)
    if (!page && !pageSize) {
      const schools = await prisma.schoolData.findMany({
        where: whereClause,
        include: includeClause,
        orderBy: {
          createdAt: 'desc',
        },
      });

      res.status(200).json(schools);
      return;
    }

    // Server-side pagination (for future use)
    const pageNum = parseInt(page as string) || 1;
    const pageSizeNum = parseInt(pageSize as string) || 50;
    const skip = (pageNum - 1) * pageSizeNum;
    const totalCount = await prisma.schoolData.count({ where: whereClause });

    const schools = await prisma.schoolData.findMany({
      skip,
      take: pageSizeNum,
      where: whereClause,
      include: includeClause,
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.status(200).json({
      data: schools,
      pagination: {
        page: pageNum,
        pageSize: pageSizeNum,
        totalCount,
        totalPages: Math.ceil(totalCount / pageSizeNum),
      },
    });
  } catch (error) {
    console.error("GET /api/schools error:", error);
    res.status(500).json({
      error: "Failed to fetch schools",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
};

/**
 * GET /api/schools/:id
 * Fetch a single school by ID
 * Public access: Anyone can view
 * Authenticated access (for dashboard): Employees can only view their own schools, Admins can view all
 */
export const getSchoolById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const userRole = req.userRole;

    const school = await prisma.schoolData.findUnique({
      where: { id },
      include: {
        address: true,
        infrastructure: true,
        primary: true,
        basic: true,
        secondary: true,
        creator: {
          select: {
            id: true,
            email: true,
          }
        }
      },
    });

    if (!school) {
      res.status(404).json({ error: 'School not found' });
      return;
    }

    // Check authorization only if user is authenticated
    // If user is authenticated as employee, they can only view their own schools
    if (userId && userRole === 'employee' && school.createdBy !== userId) {
      res.status(403).json({
        error: 'Forbidden',
        message: 'You can only view schools you created'
      });
      return;
    }
    // If not authenticated or admin, allow access (public view or admin view)

    res.status(200).json(school);
  } catch (error) {
    console.error("GET /api/schools/:id error:", error);
    res.status(500).json({
      error: "Failed to fetch school",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
};

/**
 * POST /api/schools
 * Create a new school
 * Automatically tracks the creator (current user)
 */
export const createSchool = async (req: Request, res: Response): Promise<void> => {
  try {
    const body = req.body;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    // Validate request body with Zod
    const validatedData = schoolSchema.parse(body);

    const newSchool = await prisma.schoolData.create({
      data: {
        name: sanitizeString(validatedData.name),
        createdBy: userId, // Track creator
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
        otherPrograms: body.otherPrograms || "",
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
            mandatorySportsClubs: Array.isArray(body.primary.mandatorySportsClubs)
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
                  create: body.primary.schoolUniformPhotoUrls.map((url: string) => ({
                    url,
                    type: "photo",
                  })),
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
                  create: body.basic.schoolUniformPhotoUrls.map((url: string) => ({
                    url,
                    type: "photo",
                  })),
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
            mandatorySportsClubs: Array.isArray(body.secondary.mandatorySportsClubs)
              ? body.secondary.mandatorySportsClubs.join(",")
              : body.secondary.mandatorySportsClubs,
            teachingStyleBooks: body.secondary.teachingStyleBooks,
            textbooksPrice: body.secondary.textbooksPrice || "",
            clubsAndCircles: body.secondary.clubsAndCircles,
            duration: body.secondary.duration,
            media: body.secondary.schoolUniformPhotoUrls?.length
              ? {
                  create: body.secondary.schoolUniformPhotoUrls.map((url: string) => ({
                    url,
                    type: "photo",
                  })),
                }
              : undefined,
          },
        },
      },
    });

    res.status(201).json(newSchool);
  } catch (error) {
    console.error("POST /api/schools error:", error);

    // Handle Zod validation errors
    if (error instanceof ZodError) {
      res.status(400).json({
        error: "Validation failed",
        details: error.errors.map(err => ({
          field: err.path.join("."),
          message: err.message
        }))
      });
      return;
    }

    // Handle other errors
    res.status(500).json({
      error: "Failed to create school",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
};

/**
 * PUT /api/schools/:id
 * Update a school
 * Authorization: Employees can only update their own schools, Admins can update all
 */
export const updateSchool = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const data = req.body;
    const userId = req.user?.id;
    const userRole = req.userRole;

    // Check if school exists and user has permission
    const existingSchool = await prisma.schoolData.findUnique({
      where: { id },
      select: { createdBy: true }
    });

    if (!existingSchool) {
      res.status(404).json({ error: 'School not found' });
      return;
    }

    // Authorization check: employees can only update their own schools
    if (userRole === 'employee' && existingSchool.createdBy !== userId) {
      res.status(403).json({
        error: 'Forbidden',
        message: 'You can only update schools you created'
      });
      return;
    }

    const sanitizedData = sanitizeSchoolData(data);
    const transformedData = transformNestedUpdates(sanitizedData);

    const updated = await prisma.schoolData.update({
      where: { id },
      data: {
        ...transformedData,
        updatedBy: userId, // Track who updated
      },
      include: {
        address: true,
        infrastructure: true,
        primary: true,
        basic: true,
        secondary: true,
        creator: {
          select: {
            id: true,
            email: true,
          }
        }
      },
    });

    res.status(200).json(updated);
  } catch (error) {
    console.error("PUT /api/schools/:id error:", error);
    res.status(400).json({
      error: "Failed to update school",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
};

/**
 * DELETE /api/schools/:id
 * Delete a school
 * Authorization: Employees can only delete their own schools, Admins can delete all
 */
export const deleteSchool = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const userRole = req.userRole;

    console.log("Deleting school with ID:", id);

    // Check if school exists and user has permission
    const existingSchool = await prisma.schoolData.findUnique({
      where: { id },
      select: { createdBy: true }
    });

    if (!existingSchool) {
      res.status(404).json({ error: 'School not found' });
      return;
    }

    // Authorization check: employees can only delete their own schools
    if (userRole === 'employee' && existingSchool.createdBy !== userId) {
      res.status(403).json({
        error: 'Forbidden',
        message: 'You can only delete schools you created'
      });
      return;
    }

    const deleted = await prisma.schoolData.delete({
      where: { id },
    });

    res.status(200).json(deleted);
  } catch (error) {
    console.error("DELETE /api/schools/:id error:", error);
    res.status(500).json({
      error: "Failed to delete school",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
};
