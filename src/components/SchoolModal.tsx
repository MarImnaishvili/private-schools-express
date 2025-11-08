"use client";

import { useForm, FormProvider } from "react-hook-form";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import AddressSection from "./forms/AddressSection";
import InfrastructureSection from "./forms/InfrastructureSection";
import SchoolLevelSection from "./forms/SchoolLevelSection";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { zodResolver } from "@hookform/resolvers/zod";
import { SchoolFormData, schoolSchema } from "../schemas/schema";
import TopLevelFields from "./forms/TopLevelFields";
import { toast } from "sonner";

type Props = {
  school: SchoolFormData;
  mode: "view" | "edit";
  onClose: () => void;
  onSave: (updated: SchoolFormData) => void;
};

export default function SchoolModal({ school, mode, onClose, onSave }: Props) {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const tForm = useTranslations("form");
  const isEdit = mode === "edit";
  const [isSubmitting, setIsSubmitting] = useState(false);

  const methods = useForm<SchoolFormData>({
    resolver: zodResolver(schoolSchema),
    defaultValues: {
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

      primary: {
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
      },
      basic: {
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
      },
      secondary: {
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
      },
    },
  });

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = methods;

  useEffect(() => {
    if (school) {
      console.log("Resetting with school:", school); // ✅ This helps you debug
      reset(school); // ✅ sets form values
    }
  }, [school, reset]);

  const onSubmit = async (data: SchoolFormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/schools/${school.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to update school");

      const result = await response.json();
      toast.success("School updated successfully!");
      onSave(result); // Update row in grid
      onClose();
    } catch (error) {
      toast.error("Failed to update school");
      console.error("Update error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  // Handle Esc key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isSubmitting) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isSubmitting, onClose]);

  // Focus management: focus close button when modal opens
  useEffect(() => {
    if (closeButtonRef.current) {
      closeButtonRef.current.focus();
    }
  }, []);

  console.log(school);
  useEffect(() => {
    console.log("Validation errors:", errors);
  }, [errors]);

  return (
    <div
      className="fixed inset-0 bg-black/50 z-[1000] flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="school-modal-title"
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div>
            <h2 id="school-modal-title" className="text-lg font-semibold text-gray-900">
              {isEdit ? tForm("editSchool") : tForm("viewSchool")}
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">{school.name}</p>
          </div>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1.5 hover:bg-gray-100 rounded-lg"
            aria-label={tForm("close")}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 [&_label]:text-sm [&_input]:text-sm [&_textarea]:text-sm [&_select]:text-sm">
              <TopLevelFields
                disabled={!isEdit}
                register={register}
                errors={errors}
              />
              <AddressSection
                disabled={!isEdit}
                register={register}
                errors={errors}
              />
              <InfrastructureSection
                disabled={!isEdit}
                register={register}
                errors={errors}
              />

              <h2 className="text-sm font-semibold text-gray-900 mt-6 mb-3">
                {tForm("schoolLevels")}
              </h2>
              <Tabs defaultValue="primary" className="w-full">
                <TabsList>
                  <TabsTrigger value="primary">{tForm("primary")}</TabsTrigger>
                  <TabsTrigger value="basic">{tForm("basic")}</TabsTrigger>
                  <TabsTrigger value="secondary">
                    {tForm("secondary")}
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="primary">
                  <SchoolLevelSection
                    level="primary"
                    register={register}
                    errors={errors}
                    control={control}
                    disabled={!isEdit}
                  />
                </TabsContent>
                <TabsContent value="basic">
                  <SchoolLevelSection
                    level="basic"
                    register={register}
                    errors={errors}
                    control={control}
                    disabled={!isEdit}
                  />
                </TabsContent>
                <TabsContent value="secondary">
                  <SchoolLevelSection
                    level="secondary"
                    register={register}
                    errors={errors}
                    control={control}
                    disabled={!isEdit}
                  />
                </TabsContent>
              </Tabs>
            </form>
          </FormProvider>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-gray-200 bg-gray-50 rounded-b-xl flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            aria-label={tForm("close")}
          >
            {tForm("close")}
          </button>
          {isEdit && (
            <button
              onClick={handleSubmit(onSubmit)}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              aria-label={isSubmitting ? tForm("submitting") : tForm("saveChanges")}
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
              {isSubmitting ? tForm("submitting") : tForm("saveChanges")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
