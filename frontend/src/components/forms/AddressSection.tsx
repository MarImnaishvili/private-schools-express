//app/components/forms/AddressSection
"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { SchoolFormData } from "@/schemas/schema";
import { Card, CardContent } from "../ui/Card";
import { Label } from "../ui/Label";
import { DISTRICTS } from "@/constants";

const districtOptions = DISTRICTS;

type Props = {
  register: UseFormRegister<SchoolFormData>;
  errors: FieldErrors<SchoolFormData>;
  disabled?: boolean;
};

export default function AddressSection({ register, errors, disabled }: Props) {
  const t = useTranslations("address");

  return (
    <Card className="p-4 mb-6">
      <CardContent className="grid gap-4">
        <h2 className="text-xl font-semibold">{t("address")}</h2>

        <div className="flex flex-col gap-1">
          <Label htmlFor="address.city">{t("city")}</Label>
          <input
            id="address.city"
            placeholder={t("city")}
            {...register("address.city")}
            className="w-full border p-2"
            disabled={disabled}
          />
          {errors.address?.city && (
            <p className="text-red-500 text-sm mt-1">
              {errors.address.city.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-5">
          <Label htmlFor="address.street">{t("street")}</Label>
          <input
            id="address.street"
            placeholder={t("street")}
            {...register("address.street")}
            className="w-full border p-2"
            disabled={disabled}
          />
          {errors.address?.street && (
            <p className="text-red-500 text-sm mt-1">
              {errors.address.street.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <Label htmlFor="address.zipCode">{t("zipCode")}</Label>
          <input
            id="address.zipCode"
            placeholder={t("zipCode")}
            {...register("address.zipCode")}
            className="w-full border p-2"
            disabled={disabled}
          />
          {errors.address?.zipCode && (
            <p className="text-red-500 text-sm mt-1">
              {errors.address.zipCode.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label className="block mb-1">{t("district")}</label>
          <select
            {...register("address.district")}
            className="w-full border p-2"
            disabled={disabled}
          >
            <option disabled={disabled} value="">
              {t("selectDistrict")}
            </option>
            {districtOptions.map((d) => (
              <option key={d} value={d}>
                {t(d)}
              </option>
            ))}
          </select>
          {errors.address?.district && (
            <p className="text-red-500 text-sm mt-1">
              {errors.address.district.message}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
