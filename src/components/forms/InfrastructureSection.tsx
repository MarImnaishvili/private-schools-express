//app/components/forms/InfrastructureSection
"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import { SchoolFormData } from "@/schemas/schema";
import { Card, CardContent } from "../ui/Card";

type Props = {
  register: UseFormRegister<SchoolFormData>;
  errors: FieldErrors<SchoolFormData>;
  disabled?: boolean;
};

export default function InfrastructureSection({
  register,
  errors,
  disabled,
}: Props) {
  const t = useTranslations("infrastructure");

  return (
    <Card className="p-4 mb-6">
      <CardContent className="grid gap-4">
        <h2 className="text-xl mt-6 font-semibold">{t("title")}</h2>

        {/* Numeric fields */}
        <div className="flex flex-col gap-1">
          <label className="block">
            {t("numberOfFloors")}
            <input
              type="number"
              {...register("infrastructure.numberOfFloors", {
                valueAsNumber: true,
              })}
              className="w-full border p-2"
              disabled={disabled}
            />
          </label>
          {errors.infrastructure?.numberOfFloors && (
            <p className="text-red-500 text-sm">
              {errors.infrastructure.numberOfFloors.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label className="block">
            {t("squareness")}
            <input
              type="number"
              {...register("infrastructure.squareness", {
                valueAsNumber: true,
              })}
              className="w-full border p-2"
              disabled={disabled}
            />
          </label>
          {errors.infrastructure?.squareness && (
            <p className="text-red-500 text-sm">
              {errors.infrastructure.squareness.message}
            </p>
          )}
        </div>

        {/* Boolean fields - explicitly typed */}
        <div className="flex flex-col gap-1">
          <div className="flex flex-col gap-1">
            <label className="block space-x-2">
              <input
                type="checkbox"
                {...register("infrastructure.buildings")}
                disabled={disabled}
              />
              <span>{t("buildings")}</span>
            </label>
          </div>

          <div className="flex flex-col gap-1">
            <label className="block space-x-2">
              <input
                disabled={disabled}
                type="checkbox"
                {...register("infrastructure.stadiums")}
              />
              <span>{t("stadiums")}</span>
            </label>
          </div>

          <div className="flex flex-col gap-1">
            <label className="block space-x-2">
              <input
                disabled={disabled}
                type="checkbox"
                {...register("infrastructure.pools")}
              />
              <span>{t("pools")}</span>
            </label>
          </div>
          <div className="flex flex-col gap-1">
            <label className="block space-x-2">
              <input
                disabled={disabled}
                type="checkbox"
                {...register("infrastructure.courtyard")}
              />
              <span>{t("courtyard")}</span>
            </label>
          </div>
          <div className="flex flex-col gap-1">
            <label className="block space-x-2">
              <input
                disabled={disabled}
                type="checkbox"
                {...register("infrastructure.laboratories")}
              />
              <span>{t("laboratories")}</span>
            </label>
          </div>
          <div className="flex flex-col gap-1">
            <label className="block space-x-2">
              <input
                disabled={disabled}
                type="checkbox"
                {...register("infrastructure.library")}
              />
              <span>{t("library")}</span>
            </label>
          </div>
          <div className="flex flex-col gap-1">
            <label className="block space-x-2">
              <input
                disabled={disabled}
                type="checkbox"
                {...register("infrastructure.cafe")}
              />
              <span>{t("cafe")}</span>
            </label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
