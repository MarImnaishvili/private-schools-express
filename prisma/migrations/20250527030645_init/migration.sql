-- CreateEnum
CREATE TYPE "LevelName" AS ENUM ('Primary', 'Basic', 'Secondary');

-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('photo', 'video');

-- CreateEnum
CREATE TYPE "MediaAttachment" AS ENUM ('school', 'primary', 'basic', 'secondary');

-- CreateTable
CREATE TABLE "SchoolData" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "addressId" INTEGER NOT NULL,
    "phoneNumber1" TEXT,
    "phoneNumber2" TEXT,
    "phoneNumber3" TEXT,
    "schoolsWebSite" TEXT,
    "facebookProfileURL" TEXT,
    "instagramProfileURL" TEXT,
    "founder" TEXT,
    "director" TEXT,
    "publicRelationsManager" TEXT,
    "parentRelationshipManager" TEXT,
    "infrastructureId" INTEGER,
    "primaryId" INTEGER,
    "basicId" INTEGER,
    "secondaryID" INTEGER,
    "otherPrograms" TEXT,
    "description" TEXT,
    "hasTutor" BOOLEAN NOT NULL DEFAULT false,
    "tutorDescription" TEXT,
    "hasScholarshipsGrants" BOOLEAN NOT NULL DEFAULT false,
    "scholarshipsGrants" TEXT,
    "hasExchangePrograms" BOOLEAN NOT NULL DEFAULT false,
    "exchangePrograms" TEXT,
    "hasOutdoorGarden" BOOLEAN NOT NULL DEFAULT false,
    "outdoorGarden" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" TIMESTAMP(3),
    "establishedYear" INTEGER,
    "accreditationStatus" TEXT,
    "accreditationComment" TEXT,
    "graduationRate" TEXT,
    "averageNationalExamScore" TEXT,

    CONSTRAINT "SchoolData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Address" (
    "id" SERIAL NOT NULL,
    "city" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "zipCode" TEXT NOT NULL,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Infrastructure" (
    "id" SERIAL NOT NULL,
    "buildings" BOOLEAN NOT NULL DEFAULT false,
    "numberOfFloors" INTEGER,
    "squareness" INTEGER,
    "stadiums" BOOLEAN NOT NULL DEFAULT false,
    "pools" BOOLEAN NOT NULL DEFAULT false,
    "courtyard" BOOLEAN NOT NULL DEFAULT false,
    "laboratories" BOOLEAN NOT NULL DEFAULT false,
    "library" BOOLEAN NOT NULL DEFAULT false,
    "cafe" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Infrastructure_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Primary" (
    "id" SERIAL NOT NULL,
    "schoolId" TEXT NOT NULL,
    "price" DECIMAL(65,30),
    "duration" TEXT,
    "discountAndPaymentTerms" TEXT,
    "numberOfStudents" INTEGER NOT NULL,
    "meals" TEXT,
    "mealsDescription" TEXT,
    "transportation" TEXT,
    "schoolUniform" BOOLEAN NOT NULL DEFAULT false,
    "mandatorySportsClubs" TEXT,
    "foreignLanguages" TEXT,
    "teachingStyleBooks" TEXT,
    "clubsAndCircles" TEXT,
    "textbooksPrice" TEXT,

    CONSTRAINT "Primary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Basic" (
    "id" SERIAL NOT NULL,
    "schoolId" TEXT NOT NULL,
    "price" DECIMAL(65,30),
    "duration" TEXT,
    "discountAndPaymentTerms" TEXT,
    "numberOfStudents" INTEGER NOT NULL,
    "meals" TEXT,
    "mealsDescription" TEXT,
    "transportation" TEXT,
    "schoolUniform" BOOLEAN NOT NULL DEFAULT false,
    "mandatorySportsClubs" TEXT,
    "foreignLanguages" TEXT,
    "teachingStyleBooks" TEXT,
    "clubsAndCircles" TEXT,
    "textbooksPrice" TEXT,

    CONSTRAINT "Basic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Secondary" (
    "id" SERIAL NOT NULL,
    "schoolId" TEXT NOT NULL,
    "price" DECIMAL(65,30),
    "duration" TEXT,
    "discountAndPaymentTerms" TEXT,
    "numberOfStudents" INTEGER NOT NULL,
    "meals" TEXT,
    "mealsDescription" TEXT,
    "transportation" TEXT,
    "schoolUniform" BOOLEAN NOT NULL DEFAULT false,
    "mandatorySportsClubs" TEXT,
    "foreignLanguages" TEXT,
    "teachingStyleBooks" TEXT,
    "clubsAndCircles" TEXT,
    "textbooksPrice" TEXT,

    CONSTRAINT "Secondary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "media" (
    "id" SERIAL NOT NULL,
    "media_url" TEXT NOT NULL,
    "description" TEXT,
    "school_id" TEXT,
    "basic_id" INTEGER,
    "primary_id" INTEGER,
    "secondary_id" INTEGER,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "type" "MediaType" NOT NULL,
    "attachedTo" "MediaAttachment" NOT NULL,

    CONSTRAINT "media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LevelMandatorySport" (
    "id" SERIAL NOT NULL,
    "school_id" TEXT NOT NULL,
    "school_name" TEXT NOT NULL,
    "level_name" "LevelName" NOT NULL,
    "level_id" INTEGER NOT NULL,
    "sport" TEXT NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "duration" TEXT NOT NULL,
    "discountAndPaymentTerms" TEXT,
    "numberOfStudents" INTEGER NOT NULL,
    "meals" TEXT,
    "mealsDescription" TEXT,
    "transportation" TEXT,
    "transportationDescription" TEXT,
    "schoolUniform" BOOLEAN NOT NULL,
    "schoolUniformDescription" TEXT,
    "optionalSportsClubs" TEXT,
    "foreignLanguages" TEXT,
    "teachingStyleBooks" TEXT,
    "clubsAndCircles" TEXT,
    "textbooksPrice" TEXT,

    CONSTRAINT "LevelMandatorySport_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SchoolData_addressId_idx" ON "SchoolData"("addressId");

-- CreateIndex
CREATE INDEX "SchoolData_basicId_idx" ON "SchoolData"("basicId");

-- CreateIndex
CREATE INDEX "SchoolData_infrastructureId_idx" ON "SchoolData"("infrastructureId");

-- CreateIndex
CREATE INDEX "SchoolData_primaryId_idx" ON "SchoolData"("primaryId");

-- CreateIndex
CREATE INDEX "SchoolData_secondaryID_idx" ON "SchoolData"("secondaryID");

-- CreateIndex
CREATE UNIQUE INDEX "Primary_schoolId_key" ON "Primary"("schoolId");

-- CreateIndex
CREATE INDEX "Primary_schoolId_idx" ON "Primary"("schoolId");

-- CreateIndex
CREATE UNIQUE INDEX "Basic_schoolId_key" ON "Basic"("schoolId");

-- CreateIndex
CREATE INDEX "Basic_schoolId_idx" ON "Basic"("schoolId");

-- CreateIndex
CREATE UNIQUE INDEX "Secondary_schoolId_key" ON "Secondary"("schoolId");

-- CreateIndex
CREATE INDEX "Secondary_schoolId_idx" ON "Secondary"("schoolId");

-- CreateIndex
CREATE INDEX "media_school_id_idx" ON "media"("school_id");

-- CreateIndex
CREATE INDEX "media_basic_id_idx" ON "media"("basic_id");

-- CreateIndex
CREATE INDEX "media_primary_id_idx" ON "media"("primary_id");

-- CreateIndex
CREATE INDEX "media_secondary_id_idx" ON "media"("secondary_id");

-- AddForeignKey
ALTER TABLE "SchoolData" ADD CONSTRAINT "SchoolData_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SchoolData" ADD CONSTRAINT "SchoolData_infrastructureId_fkey" FOREIGN KEY ("infrastructureId") REFERENCES "Infrastructure"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Primary" ADD CONSTRAINT "Primary_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "SchoolData"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Basic" ADD CONSTRAINT "Basic_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "SchoolData"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Secondary" ADD CONSTRAINT "Secondary_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "SchoolData"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media" ADD CONSTRAINT "media_basic_id_fkey" FOREIGN KEY ("basic_id") REFERENCES "Basic"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media" ADD CONSTRAINT "media_primary_id_fkey" FOREIGN KEY ("primary_id") REFERENCES "Primary"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media" ADD CONSTRAINT "media_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "SchoolData"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media" ADD CONSTRAINT "media_secondary_id_fkey" FOREIGN KEY ("secondary_id") REFERENCES "Secondary"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LevelMandatorySport" ADD CONSTRAINT "LevelMandatorySport_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "SchoolData"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
