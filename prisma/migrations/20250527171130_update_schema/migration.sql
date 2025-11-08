-- DropForeignKey
ALTER TABLE "Basic" DROP CONSTRAINT "Basic_schoolId_fkey";

-- DropForeignKey
ALTER TABLE "LevelMandatorySport" DROP CONSTRAINT "LevelMandatorySport_school_id_fkey";

-- DropForeignKey
ALTER TABLE "Primary" DROP CONSTRAINT "Primary_schoolId_fkey";

-- DropForeignKey
ALTER TABLE "Secondary" DROP CONSTRAINT "Secondary_schoolId_fkey";

-- CreateIndex
CREATE INDEX "LevelMandatorySport_school_id_idx" ON "LevelMandatorySport"("school_id");

-- AddForeignKey
ALTER TABLE "Primary" ADD CONSTRAINT "Primary_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "SchoolData"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Basic" ADD CONSTRAINT "Basic_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "SchoolData"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Secondary" ADD CONSTRAINT "Secondary_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "SchoolData"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LevelMandatorySport" ADD CONSTRAINT "LevelMandatorySport_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "SchoolData"("id") ON DELETE CASCADE ON UPDATE CASCADE;
