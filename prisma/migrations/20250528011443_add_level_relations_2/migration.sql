-- AlterTable
ALTER TABLE "LevelMandatorySport" ADD COLUMN     "basicId" TEXT,
ADD COLUMN     "primaryId" TEXT,
ADD COLUMN     "secondaryId" TEXT;

-- AddForeignKey
ALTER TABLE "LevelMandatorySport" ADD CONSTRAINT "LevelMandatorySport_primaryId_fkey" FOREIGN KEY ("primaryId") REFERENCES "Primary"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LevelMandatorySport" ADD CONSTRAINT "LevelMandatorySport_basicId_fkey" FOREIGN KEY ("basicId") REFERENCES "Basic"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LevelMandatorySport" ADD CONSTRAINT "LevelMandatorySport_secondaryId_fkey" FOREIGN KEY ("secondaryId") REFERENCES "Secondary"("id") ON DELETE SET NULL ON UPDATE CASCADE;
