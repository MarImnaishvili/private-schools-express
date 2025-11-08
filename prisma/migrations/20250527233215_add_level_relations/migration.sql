/*
  Warnings:

  - You are about to drop the column `clubsAndCircles` on the `LevelMandatorySport` table. All the data in the column will be lost.
  - You are about to drop the column `discountAndPaymentTerms` on the `LevelMandatorySport` table. All the data in the column will be lost.
  - You are about to drop the column `duration` on the `LevelMandatorySport` table. All the data in the column will be lost.
  - You are about to drop the column `foreignLanguages` on the `LevelMandatorySport` table. All the data in the column will be lost.
  - You are about to drop the column `meals` on the `LevelMandatorySport` table. All the data in the column will be lost.
  - You are about to drop the column `mealsDescription` on the `LevelMandatorySport` table. All the data in the column will be lost.
  - You are about to drop the column `numberOfStudents` on the `LevelMandatorySport` table. All the data in the column will be lost.
  - You are about to drop the column `optionalSportsClubs` on the `LevelMandatorySport` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `LevelMandatorySport` table. All the data in the column will be lost.
  - You are about to drop the column `schoolUniform` on the `LevelMandatorySport` table. All the data in the column will be lost.
  - You are about to drop the column `schoolUniformDescription` on the `LevelMandatorySport` table. All the data in the column will be lost.
  - You are about to drop the column `teachingStyleBooks` on the `LevelMandatorySport` table. All the data in the column will be lost.
  - You are about to drop the column `textbooksPrice` on the `LevelMandatorySport` table. All the data in the column will be lost.
  - You are about to drop the column `transportation` on the `LevelMandatorySport` table. All the data in the column will be lost.
  - You are about to drop the column `transportationDescription` on the `LevelMandatorySport` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "LevelMandatorySport" DROP COLUMN "clubsAndCircles",
DROP COLUMN "discountAndPaymentTerms",
DROP COLUMN "duration",
DROP COLUMN "foreignLanguages",
DROP COLUMN "meals",
DROP COLUMN "mealsDescription",
DROP COLUMN "numberOfStudents",
DROP COLUMN "optionalSportsClubs",
DROP COLUMN "price",
DROP COLUMN "schoolUniform",
DROP COLUMN "schoolUniformDescription",
DROP COLUMN "teachingStyleBooks",
DROP COLUMN "textbooksPrice",
DROP COLUMN "transportation",
DROP COLUMN "transportationDescription";
