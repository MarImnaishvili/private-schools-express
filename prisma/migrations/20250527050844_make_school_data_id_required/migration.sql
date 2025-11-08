/*
  Warnings:

  - Made the column `schoolDataId` on table `Address` required. This step will fail if there are existing NULL values in that column.
  - Made the column `schoolDataId` on table `Infrastructure` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Address" ALTER COLUMN "schoolDataId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Infrastructure" ALTER COLUMN "schoolDataId" SET NOT NULL;
