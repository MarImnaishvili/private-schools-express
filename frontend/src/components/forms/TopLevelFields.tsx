//app/components/forms/TopLevelFields
"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { SchoolFormData } from "@/schemas/schema";
import { Label } from "../ui/Label";
import { Card, CardContent } from "../ui/Card";

type Props = {
  register: UseFormRegister<SchoolFormData>;
  errors: FieldErrors<SchoolFormData>;
  disabled?: boolean;
};

export default function TopLevelFields({ register, errors, disabled }: Props) {
  const tForm = useTranslations("form");
  const [addPhoneNumber, setAddPhoneNumber] = useState(false);
  const [addMorePhoneNumber, setAddMorePhoneNumber] = useState(false);

  const handleAddPhoneNumber2 = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setAddPhoneNumber((prev) => !prev);
  };
  const handleAddPhoneNumber3 = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setAddMorePhoneNumber((prev) => !prev);
  };

  return (
    <Card className="p-4 mb-6">
      <CardContent className="grid gap-4">
        <div className="flex flex-col gap-1">
          <Label htmlFor="name">{tForm("name")}</Label>
          <input
            id="name"
            {...register("name")}
            placeholder={tForm("name")}
            className="w-full border p-2"
            disabled={disabled}
          />
          {errors?.name && (
            <p className="text-red-500 text-sm">{tForm("required")}</p>
          )}
        </div>
        <div className="flex flex-col gap-4">
          {/* Phone Number 1 */}
          <div className="flex flex-row items-end gap-2 w-full max-w-2xl">
            <div className="flex flex-col gap-1 w-full">
              <Label htmlFor="phoneNumber1">{tForm("phoneNumber1")}</Label>
              <input
                id="phoneNumber1"
                {...register("phoneNumber1")}
                placeholder="577189127 or +995 577 18 91 27"
                className="w-full border p-2 rounded"
                disabled={disabled}
              />
              {errors?.phoneNumber1 && (
                <p className="text-red-500 text-sm">{errors.phoneNumber1.message || tForm("required")}</p>
              )}
            </div>
            <button
              type="button"
              onClick={handleAddPhoneNumber2}
              className="h-10 w-10 flex items-center justify-center border rounded text-xl"
            >
              +/-
            </button>
          </div>

          {/* Phone Number 2 */}
          {addPhoneNumber && (
            <div className="flex flex-row items-end gap-2 w-full max-w-2xl">
              <div className="flex flex-col gap-1 w-full">
                <Label htmlFor="phoneNumber2">{tForm("phoneNumber2")}</Label>
                <input
                  id="phoneNumber2"
                  {...register("phoneNumber2")}
                  placeholder="322637607 or +995 322 63 76 07"
                  className="w-full border p-2 rounded"
                  disabled={disabled}
                />
                {errors?.phoneNumber2 && (
                  <p className="text-red-500 text-sm">{errors.phoneNumber2.message || tForm("required")}</p>
                )}
              </div>
              <button
                type="button"
                onClick={handleAddPhoneNumber3}
                className="h-10 w-10 flex items-center justify-center border rounded text-xl"
              >
                +/-
              </button>
            </div>
          )}

          {/* Phone Number 3 */}
          {addMorePhoneNumber && (
            <div className="flex flex-col gap-1 w-full max-w-2xl">
              <Label htmlFor="phoneNumber3">{tForm("phoneNumber3")}</Label>
              <input
                id="phoneNumber3"
                {...register("phoneNumber3")}
                placeholder="577189127 or +995 577 18 91 27"
                className="w-full border p-2 rounded"
                disabled={disabled}
              />
              {errors?.phoneNumber3 && (
                <p className="text-red-500 text-sm">{errors.phoneNumber3.message || tForm("required")}</p>
              )}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <Label htmlFor="schoolsWebSite">{tForm("schoolsWebSite")}</Label>
          <input
            id="schoolsWebSite"
            {...register("schoolsWebSite")}
            placeholder="https://example.com"
            className="w-full border p-2"
            disabled={disabled}
            type="url"
          />
          {errors?.schoolsWebSite && (
            <p className="text-red-500 text-sm">{tForm("required")}</p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <Label htmlFor="facebookProfileURL">
            {tForm("facebookProfileURL")}
          </Label>
          <input
            id="facebookProfileURL"
            {...register("facebookProfileURL")}
            placeholder="https://example.com"
            className="w-full border p-2"
            disabled={disabled}
            type="url"
          />
          {errors?.facebookProfileURL && (
            <p className="text-red-500 text-sm">{tForm("required")}</p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <Label htmlFor="instagramProfileURL">
            {tForm("instagramProfileURL")}
          </Label>
          <input
            id="instagramProfileURL"
            {...register("instagramProfileURL")}
            placeholder="https://example.com"
            className="w-full border p-2"
            disabled={disabled}
            type="url"
          />
          {errors?.instagramProfileURL && (
            <p className="text-red-500 text-sm">{tForm("required")}</p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <Label htmlFor="establishedYear">{tForm("establishedYear")}</Label>
          <input
            id="establishedYear"
            {...register("establishedYear")}
            placeholder={tForm("establishedYear")}
            className="w-full border p-2"
            disabled={disabled}
          />
          {errors?.establishedYear && (
            <p className="text-red-500 text-sm">{tForm("needToBeNumber")}</p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <Label htmlFor="accreditationStatus">
            {tForm("accreditationStatus")}
          </Label>
          <input
            id="accreditationStatus"
            {...register("accreditationStatus")}
            placeholder={tForm("accreditationStatus")}
            className="w-full border p-2"
            disabled={disabled}
          />
          {errors?.accreditationStatus && (
            <p className="text-red-500 text-sm">{tForm("required")}</p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <Label htmlFor="accreditationComment">
            {tForm("accreditationComment")}
          </Label>
          <input
            id="accreditationComment"
            {...register("accreditationComment")}
            placeholder={tForm("accreditationComment")}
            className="w-full border p-2"
            disabled={disabled}
          />
          {errors?.accreditationComment && (
            <p className="text-red-500 text-sm">{tForm("required")}</p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <Label htmlFor="founder">{tForm("founder")}</Label>
          <input
            id="founder"
            {...register("founder")}
            placeholder={tForm("founder")}
            className="w-full border p-2"
            disabled={disabled}
          />
          {errors?.founder && (
            <p className="text-red-500 text-sm">{tForm("required")}</p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <Label htmlFor="director">{tForm("director")}</Label>
          <input
            id="director"
            {...register("director")}
            placeholder={tForm("director")}
            className="w-full border p-2"
            disabled={disabled}
          />
          {errors?.director && (
            <p className="text-red-500 text-sm">{tForm("required")}</p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <Label htmlFor="publicRelationsManager">
            {tForm("publicRelationsManager")}
          </Label>
          <input
            id="publicRelationsManager"
            {...register("publicRelationsManager")}
            placeholder={tForm("publicRelationsManager")}
            className="w-full border p-2"
            disabled={disabled}
          />
          {errors?.publicRelationsManager && (
            <p className="text-red-500 text-sm">{tForm("required")}</p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <Label htmlFor="parentRelationshipManager">
            {tForm("parentRelationshipManager")}
          </Label>
          <input
            id="parentRelationshipManager"
            {...register("parentRelationshipManager")}
            placeholder={tForm("parentRelationshipManager")}
            className="w-full border p-2"
            disabled={disabled}
          />
          {errors?.parentRelationshipManager && (
            <p className="text-red-500 text-sm">{tForm("required")}</p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <Label htmlFor="graduationRate">{tForm("graduationRate")}</Label>
          <input
            id="graduationRate"
            {...register("graduationRate")}
            placeholder={tForm("graduationRate")}
            className="w-full border p-2"
            disabled={disabled}
          />
          {errors?.graduationRate && (
            <p className="text-red-500 text-sm">{tForm("required")}</p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <Label htmlFor="averageNationalExamScore">
            {tForm("averageNationalExamScore")}
          </Label>
          <input
            id="averageNationalExamScore"
            {...register("averageNationalExamScore")}
            placeholder={tForm("averageNationalExamScore")}
            className="w-full border p-2"
            disabled={disabled}
          />
          {errors?.averageNationalExamScore && (
            <p className="text-red-500 text-sm">{tForm("required")}</p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <Label htmlFor="description">{tForm("description")}</Label>
          <textarea
            id="description"
            {...register("description")}
            placeholder={tForm("description")}
            className="w-full border p-2"
            disabled={disabled}
          />
          {errors?.description && (
            <p className="text-red-500 text-sm">{tForm("required")}</p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <Label htmlFor="otherPrograms">{tForm("otherPrograms")}</Label>
          <textarea
            id="otherPrograms"
            {...register("otherPrograms")}
            placeholder={tForm("otherPrograms")}
            className="w-full border p-2"
            disabled={disabled}
          />
          {errors?.otherPrograms && (
            <p className="text-red-500 text-sm">{tForm("required")}</p>
          )}
        </div>
        <div className="flex flex-row items-center justify-between">
          <div className="flex flex-col gap-1 w-full">
            <label className="block space-x-2">
              <input
                type="checkbox"
                {...register("hasTutor")}
                disabled={disabled}
              />
              <span>{tForm("hasTutor")}</span>
            </label>
          </div>
          <div className="flex flex-col gap-1 w-full">
            <input
              id="tutorDescription"
              {...register("tutorDescription")}
              placeholder={tForm("tutorDescription")}
              className="w-full border p-2"
              disabled={disabled}
            />
            {errors?.tutorDescription && (
              <p className="text-red-500 text-sm">{tForm("required")}</p>
            )}
          </div>
        </div>
        <div className="flex flex-row items-center justify-between">
          <div className="flex flex-col gap-1 w-full">
            <label className="block space-x-2">
              <input type="checkbox" {...register("hasScholarshipsGrants")} />
              <span>{tForm("hasScholarshipsGrants")}</span>
            </label>
          </div>
          <div className="flex flex-col gap-1  w-full">
            <input
              id="scholarshipsGrants"
              {...register("scholarshipsGrants")}
              placeholder={tForm("scholarshipsGrants")}
              className="w-full border p-2"
              disabled={disabled}
            />
            {errors?.scholarshipsGrants && (
              <p className="text-red-500 text-sm">{tForm("required")}</p>
            )}
          </div>
        </div>
        <div className="flex flex-row items-center justify-between">
          <div className="flex flex-col gap-1 w-full ">
            <label className="block space-x-2">
              <input
                type="checkbox"
                {...register("hasExchangePrograms")}
                disabled={disabled}
              />
              <span>{tForm("hasExchangePrograms")}</span>
            </label>
          </div>
          <div className="flex flex-col gap-1  w-full">
            <input
              id="exchangePrograms"
              {...register("exchangePrograms")}
              placeholder={tForm("exchangePrograms")}
              className="w-full border p-2"
              disabled={disabled}
            />
            {errors?.exchangePrograms && (
              <p className="text-red-500 text-sm">{tForm("required")}</p>
            )}
          </div>
        </div>
        <div className="flex flex-row items-center justify-between">
          <div className="flex flex-col gap-1 w-full ">
            <label className="block space-x-2">
              <input
                type="checkbox"
                {...register("hasOutdoorGarden")}
                disabled={disabled}
              />
              <span>{tForm("hasOutdoorGarden")}</span>
            </label>
          </div>
          <div className="flex flex-col gap-1   w-full">
            {/* <Label htmlFor="outdoorGarden">{tForm("outdoorGarden")}</Label> */}
            <input
              id="outdoorGarden"
              {...register("outdoorGarden")}
              placeholder={tForm("outdoorGarden")}
              className="w-full border p-2"
              disabled={disabled}
            />
            {errors?.outdoorGarden && (
              <p className="text-red-500 text-sm">{tForm("required")}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
