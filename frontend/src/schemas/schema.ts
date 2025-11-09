// schemas/schema.ts

import { z } from "zod";
import { georgianPhoneSchema } from "@/lib/validators";

// Define school level section schema
const schoolLevelSchema = z.object({
  price: z.number().optional(),
  duration: z.string().optional(),
  discountAndPaymentTerms: z.string().optional(),
  numberOfStudents: z.number().optional(),
  meals: z.string().optional(),
  mealsDescription: z.string().optional(),
  transportation: z.string().optional(),
  schoolUniform: z.boolean(),
  mandatorySportsClubs: z.string().optional(),
  foreignLanguages: z.string().optional(),
  teachingStyleBooks: z.string().optional(),
  clubsAndCircles: z.string().optional(),
  textbooksPrice: z.string().optional(),
});

// Main schema
export const schoolSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1).optional(),
  phoneNumber1: georgianPhoneSchema,
  phoneNumber2: georgianPhoneSchema,
  phoneNumber3: georgianPhoneSchema,
  schoolsWebSite: z.string().url().optional().or(z.literal("")),
  facebookProfileURL: z.string().url().optional().or(z.literal("")),
  instagramProfileURL: z.string().url().optional().or(z.literal("")),

  founder: z.string().optional(),
  director: z.string().optional(),
  publicRelationsManager: z.string().optional(),
  parentRelationshipManager: z.string().optional(),

  establishedYear: z.coerce
    .number()
    .int()
    .min(1900)
    .max(new Date().getFullYear())
    .optional(),

  accreditationStatus: z.string().optional(),

  accreditationComment: z.string().optional(),

  graduationRate: z.string().optional(),
  averageNationalExamScore: z.string().optional(),

  description: z.string().optional(),
  otherPrograms: z.string().optional(),

  hasTutor: z.boolean(),
  tutorDescription: z.string().optional(),

  hasScholarshipsGrants: z.boolean(),
  scholarshipsGrants: z.string().optional(),

  hasExchangePrograms: z.boolean(),
  exchangePrograms: z.string().optional(),

  hasOutdoorGarden: z.boolean(),
  outdoorGarden: z.string().optional(),

  address: z.object({
    city: z.string().optional(),
    street: z.string().optional(),
    zipCode: z.string().optional(),
    district: z.string().optional(),
  }),

  infrastructure: z.object({
    buildings: z.boolean(),
    numberOfFloors: z.number().optional(),
    squareness: z.number().optional(),
    stadiums: z.boolean(),
    pools: z.boolean(),
    courtyard: z.boolean(),
    laboratories: z.boolean(),
    library: z.boolean(),
    cafe: z.boolean(),
  }),

  primary: schoolLevelSchema,
  basic: schoolLevelSchema,
  secondary: schoolLevelSchema,
});

export type SchoolFormData = z.infer<typeof schoolSchema>;
