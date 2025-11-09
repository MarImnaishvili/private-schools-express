"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef } from "react";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  schoolName: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting?: boolean;
}

export default function DeleteConfirmationModal({
  isOpen,
  schoolName,
  onConfirm,
  onCancel,
  isDeleting = false,
}: DeleteConfirmationModalProps) {
  const t = useTranslations("form");
  const cancelButtonRef = useRef<HTMLButtonElement>(null);

  // Handle Esc key to close modal
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isDeleting) {
        onCancel();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, isDeleting, onCancel]);

  // Focus management: focus cancel button when modal opens
  useEffect(() => {
    if (isOpen && cancelButtonRef.current) {
      cancelButtonRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 z-[1001] flex items-center justify-center p-4"
      onClick={onCancel}
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-modal-title"
      aria-describedby="delete-modal-description"
    >
      <div
        className="bg-white rounded-lg p-8 w-full max-w-2xl shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6">
          <h3 id="delete-modal-title" className="text-xl font-semibold text-gray-900 mb-3">
            {t("deleteConfirmTitle")}
          </h3>
          <p id="delete-modal-description" className="text-gray-700 text-base mb-3">
            {t("deleteConfirmMessage")} <strong className="text-gray-900">{schoolName}</strong>?
          </p>
          <p className="text-sm text-red-600 font-medium">{t("deleteWarning")}</p>
        </div>

        <div className="flex gap-3 justify-end flex-wrap sm:flex-nowrap">
          <button
            ref={cancelButtonRef}
            onClick={onCancel}
            disabled={isDeleting}
            className="px-6 py-2.5 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium min-w-[120px]"
            aria-label={t("cancel")}
          >
            {t("cancel")}
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:bg-red-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium min-w-[120px]"
            aria-label={isDeleting ? t("deleting") : t("deleteButton")}
          >
            {isDeleting && (
              <svg
                className="animate-spin h-4 w-4 text-white"
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
            {isDeleting ? t("deleting") : t("deleteButton")}
          </button>
        </div>
      </div>
    </div>
  );
}
