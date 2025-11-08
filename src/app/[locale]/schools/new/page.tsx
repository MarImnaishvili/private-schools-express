//app/[locale]/schools/new/page
"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import TopLevelFields from "@/components/forms/TopLevelFields";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import AddressSection from "@/components/forms/AddressSection";
import InfrastructureSection from "@/components/forms/InfrastructureSection";
import SchoolLevelSection from "@/components/forms/SchoolLevelSection";
import FormErrorSummary from "@/components/forms/FormErrorSummary";
import { schoolSchema, SchoolFormData } from "@/schemas/schema";

const defaultschoolLevel = {
  price: 0,
  discountAndPaymentTerms: "",
  duration: "",
  numberOfStudents: 0,
  meals: "",
  mealsDescription: "",
  transportation: "",
  schoolUniform: false,
  mandatorySportsClubs: "",
  teachingStyleBooks: "",
  textbooksPrice: "",
  clubsAndCircles: "",
  foreignLanguages: "",
};

const defaultschoolValues = {
  name: "",
  phoneNumber1: "",
  phoneNumber2: "",
  phoneNumber3: "",
  schoolsWebSite: "",
  facebookProfileURL: "",
  instagramProfileURL: "",
  establishedYear: 1900,
  accreditationStatus: "",
  accreditationComment: "",
  founder: "",
  director: "",
  publicRelationsManager: "",
  parentRelationshipManager: "",
  graduationRate: "",
  averageNationalExamScore: "",
  description: "",
  otherPrograms: "",
  hasTutor: false,
  tutorDescription: "",
  hasScholarshipsGrants: false,
  scholarshipsGrants: "",
  hasExchangePrograms: false,
  exchangePrograms: "",
  hasOutdoorGarden: false,
  outdoorGarden: "",
  address: { city: "", street: "", zipCode: "", district: "" },
  infrastructure: {
    buildings: false,
    numberOfFloors: 0,
    squareness: 0,
    stadiums: false,
    pools: false,
    courtyard: false,
    laboratories: false,
    library: false,
    cafe: false,
  },

  primary: defaultschoolLevel,
  basic: defaultschoolLevel,
  secondary: defaultschoolLevel,
};

export default function NewSchoolPage() {
  const tForm = useTranslations("form");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<SchoolFormData>({
    resolver: zodResolver(schoolSchema),
    defaultValues: defaultschoolValues,
  });

  const onSubmit = async (data: SchoolFormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/schools", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to create school");
      }

      toast.success(tForm("schoolCreated"));
      reset(); // <-- reset the form to default values
    } catch (error) {
      console.error("Error creating school:", error);
      toast.error(tForm("errorCreatingSchool"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const onInvalid = () => {
    const errorCount = Object.keys(errors).length;
    toast.error(`${tForm("validationErrorsToast")}: ${errorCount}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-teal-50 p-4 sm:p-6 md:p-9 pt-8">
      <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="space-y-6">
        <FormErrorSummary errors={errors} />
        <TopLevelFields register={register} errors={errors} />
        <AddressSection register={register} errors={errors} />
        <InfrastructureSection register={register} errors={errors} />

        <h2 className="text-xl mt-6 font-semibold">{tForm("schoolLevels")}</h2>
        <Tabs defaultValue="primary" className="w-full">
          <TabsList>
            <TabsTrigger value="primary">{tForm("primary")}</TabsTrigger>
            <TabsTrigger value="basic">{tForm("basic")}</TabsTrigger>
            <TabsTrigger value="secondary">{tForm("secondary")}</TabsTrigger>
          </TabsList>

          <TabsContent value="primary">
            <SchoolLevelSection
              level="primary"
              register={register}
              errors={errors}
              control={control}
            />
          </TabsContent>
          <TabsContent value="basic">
            <SchoolLevelSection
              level="basic"
              register={register}
              errors={errors}
              control={control}
            />
          </TabsContent>
          <TabsContent value="secondary">
            <SchoolLevelSection
              level="secondary"
              register={register}
              errors={errors}
              control={control}
            />
          </TabsContent>
        </Tabs>

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
        >
          {isSubmitting && (
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          )}
          {isSubmitting ? tForm("submitting") : tForm("submit")}
        </button>
      </form>
      </div>
    </div>
  );
}
