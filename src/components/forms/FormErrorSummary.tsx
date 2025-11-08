"use client";

import { FieldErrors } from "react-hook-form";
import { useTranslations } from "next-intl";
import { useEffect, useRef } from "react";

interface FormErrorSummaryProps {
  errors: FieldErrors;
}

export default function FormErrorSummary({ errors }: FormErrorSummaryProps) {
  const t = useTranslations("form");
  const errorRef = useRef<HTMLDivElement>(null);

  const errorCount = Object.keys(errors).length;

  useEffect(() => {
    if (errorCount > 0 && errorRef.current) {
      errorRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [errorCount]);

  if (errorCount === 0) return null;

  const getErrorMessages = (errors: FieldErrors, prefix = ""): string[] => {
    const messages: string[] = [];

    Object.entries(errors).forEach(([key, value]) => {
      if (value && typeof value === "object") {
        if ("message" in value && value.message) {
          const fieldPath = prefix ? `${prefix}.${key}` : key;
          messages.push(`${fieldPath}: ${value.message}`);
        } else {
          // Nested errors (like address.city, primary.price)
          messages.push(
            ...getErrorMessages(value as FieldErrors, prefix ? `${prefix}.${key}` : key)
          );
        }
      }
    });

    return messages;
  };

  const errorMessages = getErrorMessages(errors);

  return (
    <div
      ref={errorRef}
      className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-lg"
      role="alert"
    >
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg
            className="h-5 w-5 text-red-500"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-red-800">
            {t("validationErrors")} ({errorCount})
          </h3>
          <div className="mt-2 text-sm text-red-700">
            <ul className="list-disc list-inside space-y-1">
              {errorMessages.map((message, index) => (
                <li key={index}>{message}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
