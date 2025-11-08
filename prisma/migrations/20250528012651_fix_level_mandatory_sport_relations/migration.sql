-- DropForeignKey
ALTER TABLE "LevelMandatorySport" DROP CONSTRAINT "LevelMandatorySport_basicId_fkey";

-- DropForeignKey
ALTER TABLE "LevelMandatorySport" DROP CONSTRAINT "LevelMandatorySport_primaryId_fkey";

-- DropForeignKey
ALTER TABLE "LevelMandatorySport" DROP CONSTRAINT "LevelMandatorySport_secondaryId_fkey";

-- AddForeignKey
ALTER TABLE "LevelMandatorySport" ADD CONSTRAINT "LevelMandatorySport_primaryId_fkey" FOREIGN KEY ("primaryId") REFERENCES "Primary"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LevelMandatorySport" ADD CONSTRAINT "LevelMandatorySport_basicId_fkey" FOREIGN KEY ("basicId") REFERENCES "Basic"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LevelMandatorySport" ADD CONSTRAINT "LevelMandatorySport_secondaryId_fkey" FOREIGN KEY ("secondaryId") REFERENCES "Secondary"("id") ON DELETE CASCADE ON UPDATE CASCADE;
