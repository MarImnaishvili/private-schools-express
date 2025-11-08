// /src/types/formData.ts

//import { useTranslations } from "next-intl";
//import { FieldErrors, UseFormRegister } from "react-hook-form";

import { z } from "zod";
import { schoolSchema } from "@/schemas/schema";

export type SchoolFormData = z.infer<typeof schoolSchema>;

export interface MediaItem {
  mediaUrl: string;
  type: "photo" | "video";
  description?: string;
  attachedTo: "school" | "primary" | "basic" | "secondary";
}
export interface mediaSectionProps {
  media: MediaItem[];
  onChange: (media: MediaItem[]) => void;
}

export type SchoolLevelFields = {
  price: number;
  discountAndPaymentTerms: string;
  numberOfStudents: number;
  meals: string;
  mealsDescription: string;
  transportation: string;
  schoolUniform: boolean;
  mandatorySportsClubs: string;
  teachingStyleBooks: string;
  textbooksPrice: string;
  clubsAndCircles: string;
  duration: string;
  foreignLanguages: string;
};

export type SchoolLevelKey = "primary" | "basic" | "secondary";

export type NestedSection =
  | "address"
  | "infrastructure"
  | "primary"
  | "basic"
  | "secondary";
