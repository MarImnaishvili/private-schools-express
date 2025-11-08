/*
  Warnings:

  - A unique constraint covering the columns `[schoolDataId]` on the table `Address` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[schoolDataId]` on the table `Infrastructure` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "SchoolData" DROP CONSTRAINT "SchoolData_addressId_fkey";

-- DropForeignKey
ALTER TABLE "SchoolData" DROP CONSTRAINT "SchoolData_infrastructureId_fkey";

-- AlterTable
ALTER TABLE "Address" ADD COLUMN     "schoolDataId" TEXT;

-- AlterTable
ALTER TABLE "Infrastructure" ADD COLUMN     "schoolDataId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Address_schoolDataId_key" ON "Address"("schoolDataId");

-- CreateIndex
CREATE UNIQUE INDEX "Infrastructure_schoolDataId_key" ON "Infrastructure"("schoolDataId");

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_schoolDataId_fkey" FOREIGN KEY ("schoolDataId") REFERENCES "SchoolData"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Infrastructure" ADD CONSTRAINT "Infrastructure_schoolDataId_fkey" FOREIGN KEY ("schoolDataId") REFERENCES "SchoolData"("id") ON DELETE CASCADE ON UPDATE CASCADE;
