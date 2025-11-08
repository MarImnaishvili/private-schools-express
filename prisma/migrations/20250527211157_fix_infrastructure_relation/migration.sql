/*
  Warnings:

  - The primary key for the `Address` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Basic` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Infrastructure` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `LevelMandatorySport` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Primary` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Secondary` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `media` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "media" DROP CONSTRAINT "media_basic_id_fkey";

-- DropForeignKey
ALTER TABLE "media" DROP CONSTRAINT "media_primary_id_fkey";

-- DropForeignKey
ALTER TABLE "media" DROP CONSTRAINT "media_secondary_id_fkey";

-- AlterTable
ALTER TABLE "Address" DROP CONSTRAINT "Address_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "city" DROP NOT NULL,
ALTER COLUMN "district" DROP NOT NULL,
ALTER COLUMN "street" DROP NOT NULL,
ALTER COLUMN "zipCode" DROP NOT NULL,
ADD CONSTRAINT "Address_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Address_id_seq";

-- AlterTable
ALTER TABLE "Basic" DROP CONSTRAINT "Basic_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "numberOfStudents" DROP NOT NULL,
ADD CONSTRAINT "Basic_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Basic_id_seq";

-- AlterTable
ALTER TABLE "Infrastructure" DROP CONSTRAINT "Infrastructure_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "buildings" DROP NOT NULL,
ALTER COLUMN "stadiums" DROP NOT NULL,
ALTER COLUMN "pools" DROP NOT NULL,
ALTER COLUMN "courtyard" DROP NOT NULL,
ALTER COLUMN "laboratories" DROP NOT NULL,
ALTER COLUMN "library" DROP NOT NULL,
ALTER COLUMN "cafe" DROP NOT NULL,
ADD CONSTRAINT "Infrastructure_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Infrastructure_id_seq";

-- AlterTable
ALTER TABLE "LevelMandatorySport" DROP CONSTRAINT "LevelMandatorySport_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "school_name" DROP NOT NULL,
ALTER COLUMN "level_id" SET DATA TYPE TEXT,
ALTER COLUMN "sport" DROP NOT NULL,
ALTER COLUMN "price" DROP NOT NULL,
ALTER COLUMN "duration" DROP NOT NULL,
ALTER COLUMN "numberOfStudents" DROP NOT NULL,
ALTER COLUMN "schoolUniform" DROP NOT NULL,
ADD CONSTRAINT "LevelMandatorySport_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "LevelMandatorySport_id_seq";

-- AlterTable
ALTER TABLE "Primary" DROP CONSTRAINT "Primary_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "numberOfStudents" DROP NOT NULL,
ADD CONSTRAINT "Primary_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Primary_id_seq";

-- AlterTable
ALTER TABLE "SchoolData" ALTER COLUMN "addressId" DROP NOT NULL,
ALTER COLUMN "addressId" SET DATA TYPE TEXT,
ALTER COLUMN "infrastructureId" SET DATA TYPE TEXT,
ALTER COLUMN "primaryId" SET DATA TYPE TEXT,
ALTER COLUMN "basicId" SET DATA TYPE TEXT,
ALTER COLUMN "secondaryID" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Secondary" DROP CONSTRAINT "Secondary_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "numberOfStudents" DROP NOT NULL,
ADD CONSTRAINT "Secondary_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Secondary_id_seq";

-- AlterTable
ALTER TABLE "media" DROP CONSTRAINT "media_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "basic_id" SET DATA TYPE TEXT,
ALTER COLUMN "primary_id" SET DATA TYPE TEXT,
ALTER COLUMN "secondary_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "media_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "media_id_seq";

-- AddForeignKey
ALTER TABLE "media" ADD CONSTRAINT "media_basic_id_fkey" FOREIGN KEY ("basic_id") REFERENCES "Basic"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media" ADD CONSTRAINT "media_primary_id_fkey" FOREIGN KEY ("primary_id") REFERENCES "Primary"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media" ADD CONSTRAINT "media_secondary_id_fkey" FOREIGN KEY ("secondary_id") REFERENCES "Secondary"("id") ON DELETE SET NULL ON UPDATE CASCADE;
