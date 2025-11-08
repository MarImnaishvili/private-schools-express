/*
  Warnings:

  - You are about to drop the column `addressId` on the `SchoolData` table. All the data in the column will be lost.
  - You are about to drop the column `basicId` on the `SchoolData` table. All the data in the column will be lost.
  - You are about to drop the column `infrastructureId` on the `SchoolData` table. All the data in the column will be lost.
  - You are about to drop the column `primaryId` on the `SchoolData` table. All the data in the column will be lost.
  - You are about to drop the column `secondaryID` on the `SchoolData` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "SchoolData_addressId_idx";

-- DropIndex
DROP INDEX "SchoolData_basicId_idx";

-- DropIndex
DROP INDEX "SchoolData_infrastructureId_idx";

-- DropIndex
DROP INDEX "SchoolData_primaryId_idx";

-- DropIndex
DROP INDEX "SchoolData_secondaryID_idx";

-- AlterTable
ALTER TABLE "SchoolData" DROP COLUMN "addressId",
DROP COLUMN "basicId",
DROP COLUMN "infrastructureId",
DROP COLUMN "primaryId",
DROP COLUMN "secondaryID";
