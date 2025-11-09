/**
 * Data Migration Script
 * Migrates all school data from old Supabase database to new database
 *
 * Usage: npx tsx src/scripts/migrate-data.ts
 */

import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';

dotenv.config();

// New database connection (current)
const newPrisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL,
});

// Old database connection
const OLD_DATABASE_URL = process.env.OLD_DATABASE_URL || '';

if (!OLD_DATABASE_URL) {
  console.error('❌ OLD_DATABASE_URL is not set in .env file');
  console.log('Please add: OLD_DATABASE_URL="postgresql://postgres:password@old-db-url:5432/postgres"');
  process.exit(1);
}

const oldPrisma = new PrismaClient({
  datasourceUrl: OLD_DATABASE_URL,
});

// Admin user ID (will be set as creator for all migrated schools)
const ADMIN_USER_ID = process.env.ADMIN_USER_ID || '';

if (!ADMIN_USER_ID) {
  console.error('❌ ADMIN_USER_ID is not set in .env file');
  console.log('Please add: ADMIN_USER_ID="your-admin-user-uuid"');
  process.exit(1);
}

async function migrateData() {
  try {
    console.log('🚀 Starting data migration...\n');

    // Verify admin user exists
    const adminUser = await newPrisma.user.findUnique({
      where: { id: ADMIN_USER_ID }
    });

    if (!adminUser) {
      console.error(`❌ Admin user with ID ${ADMIN_USER_ID} not found in new database`);
      process.exit(1);
    }

    console.log(`✅ Admin user found: ${adminUser.email}\n`);

    // Fetch all schools from old database using raw SQL (to avoid schema conflicts)
    console.log('📥 Fetching schools from old database...');

    const oldSchools: any[] = await oldPrisma.$queryRaw`
      SELECT * FROM "SchoolData"
    `;

    console.log(`Found ${oldSchools.length} schools in old database\n`);

    // Fetch related data for each school
    for (const school of oldSchools) {
      // Fetch address
      const address: any = await oldPrisma.$queryRaw`
        SELECT * FROM "Address" WHERE "schoolDataId" = ${school.id} LIMIT 1
      `.then((rows: any[]) => rows[0]);
      school.address = address || null;

      // Fetch infrastructure
      const infrastructure: any = await oldPrisma.$queryRaw`
        SELECT * FROM "Infrastructure" WHERE "schoolDataId" = ${school.id} LIMIT 1
      `.then((rows: any[]) => rows[0]);
      school.infrastructure = infrastructure || null;

      // Fetch primary
      const primary: any = await oldPrisma.$queryRaw`
        SELECT * FROM "Primary" WHERE "schoolId" = ${school.id} LIMIT 1
      `.then((rows: any[]) => rows[0]);
      school.primary = primary || null;

      // Fetch basic
      const basic: any = await oldPrisma.$queryRaw`
        SELECT * FROM "Basic" WHERE "schoolId" = ${school.id} LIMIT 1
      `.then((rows: any[]) => rows[0]);
      school.basic = basic || null;

      // Fetch secondary
      const secondary: any = await oldPrisma.$queryRaw`
        SELECT * FROM "Secondary" WHERE "schoolId" = ${school.id} LIMIT 1
      `.then((rows: any[]) => rows[0]);
      school.secondary = secondary || null;

      // Fetch media
      const media: any[] = await oldPrisma.$queryRaw`
        SELECT * FROM "media" WHERE "school_id" = ${school.id}
      `;
      school.media = media || [];

      // Fetch level mandatory sports
      const levelMandatorySports: any[] = await oldPrisma.$queryRaw`
        SELECT * FROM "LevelMandatorySport" WHERE "school_id" = ${school.id}
      `;
      school.levelMandatorySports = levelMandatorySports || [];
    }

    console.log(`✅ Fetched all related data\n`);

    let successCount = 0;
    let errorCount = 0;

    // Migrate each school
    for (const school of oldSchools) {
      try {
        console.log(`Migrating: ${school.name}...`);

        // Check if school already exists in new database
        const existingSchool = await newPrisma.schoolData.findUnique({
          where: { id: school.id }
        });

        if (existingSchool) {
          console.log(`  ⚠️  School already exists, skipping...`);
          continue;
        }

        // Create school with all relations
        await newPrisma.schoolData.create({
          data: {
            id: school.id,
            name: school.name,
            phoneNumber1: school.phoneNumber1,
            phoneNumber2: school.phoneNumber2,
            phoneNumber3: school.phoneNumber3,
            schoolsWebSite: school.schoolsWebSite,
            facebookProfileURL: school.facebookProfileURL,
            instagramProfileURL: school.instagramProfileURL,
            founder: school.founder,
            director: school.director,
            publicRelationsManager: school.publicRelationsManager,
            parentRelationshipManager: school.parentRelationshipManager,
            otherPrograms: school.otherPrograms,
            description: school.description,
            hasTutor: school.hasTutor,
            tutorDescription: school.tutorDescription,
            hasScholarshipsGrants: school.hasScholarshipsGrants,
            scholarshipsGrants: school.scholarshipsGrants,
            hasExchangePrograms: school.hasExchangePrograms,
            exchangePrograms: school.exchangePrograms,
            hasOutdoorGarden: school.hasOutdoorGarden,
            outdoorGarden: school.outdoorGarden,
            establishedYear: school.establishedYear,
            accreditationStatus: school.accreditationStatus,
            accreditationComment: school.accreditationComment,
            graduationRate: school.graduationRate,
            averageNationalExamScore: school.averageNationalExamScore,
            createdAt: school.createdAt,
            createdBy: ADMIN_USER_ID, // Set admin as creator
            updatedAt: school.updatedAt,

            // Address
            address: school.address ? {
              create: {
                id: school.address.id,
                city: school.address.city,
                district: school.address.district,
                street: school.address.street,
                zipCode: school.address.zipCode,
              }
            } : undefined,

            // Infrastructure
            infrastructure: school.infrastructure ? {
              create: {
                id: school.infrastructure.id,
                buildings: school.infrastructure.buildings,
                numberOfFloors: school.infrastructure.numberOfFloors,
                squareness: school.infrastructure.squareness,
                stadiums: school.infrastructure.stadiums,
                pools: school.infrastructure.pools,
                courtyard: school.infrastructure.courtyard,
                laboratories: school.infrastructure.laboratories,
                library: school.infrastructure.library,
                cafe: school.infrastructure.cafe,
              }
            } : undefined,

            // Primary
            primary: school.primary ? {
              create: {
                id: school.primary.id,
                price: school.primary.price,
                duration: school.primary.duration,
                discountAndPaymentTerms: school.primary.discountAndPaymentTerms,
                numberOfStudents: school.primary.numberOfStudents,
                meals: school.primary.meals,
                mealsDescription: school.primary.mealsDescription,
                transportation: school.primary.transportation,
                schoolUniform: school.primary.schoolUniform,
                mandatorySportsClubs: school.primary.mandatorySportsClubs,
                foreignLanguages: school.primary.foreignLanguages,
                teachingStyleBooks: school.primary.teachingStyleBooks,
                clubsAndCircles: school.primary.clubsAndCircles,
                textbooksPrice: school.primary.textbooksPrice,
              }
            } : undefined,

            // Basic
            basic: school.basic ? {
              create: {
                id: school.basic.id,
                price: school.basic.price,
                duration: school.basic.duration,
                discountAndPaymentTerms: school.basic.discountAndPaymentTerms,
                numberOfStudents: school.basic.numberOfStudents,
                meals: school.basic.meals,
                mealsDescription: school.basic.mealsDescription,
                transportation: school.basic.transportation,
                schoolUniform: school.basic.schoolUniform,
                mandatorySportsClubs: school.basic.mandatorySportsClubs,
                foreignLanguages: school.basic.foreignLanguages,
                teachingStyleBooks: school.basic.teachingStyleBooks,
                clubsAndCircles: school.basic.clubsAndCircles,
                textbooksPrice: school.basic.textbooksPrice,
              }
            } : undefined,

            // Secondary
            secondary: school.secondary ? {
              create: {
                id: school.secondary.id,
                price: school.secondary.price,
                duration: school.secondary.duration,
                discountAndPaymentTerms: school.secondary.discountAndPaymentTerms,
                numberOfStudents: school.secondary.numberOfStudents,
                meals: school.secondary.meals,
                mealsDescription: school.secondary.mealsDescription,
                transportation: school.secondary.transportation,
                schoolUniform: school.secondary.schoolUniform,
                mandatorySportsClubs: school.secondary.mandatorySportsClubs,
                foreignLanguages: school.secondary.foreignLanguages,
                teachingStyleBooks: school.secondary.teachingStyleBooks,
                clubsAndCircles: school.secondary.clubsAndCircles,
                textbooksPrice: school.secondary.textbooksPrice,
              }
            } : undefined,

            // Media
            media: school.media.length > 0 ? {
              create: school.media.map(m => ({
                id: m.id,
                mediaUrl: m.mediaUrl,
                description: m.description,
                type: m.type,
                attachedTo: m.attachedTo,
                createdAt: m.createdAt,
                updatedAt: m.updatedAt,
              }))
            } : undefined,

            // Level Mandatory Sports
            levelMandatorySports: school.levelMandatorySports.length > 0 ? {
              create: school.levelMandatorySports.map(sport => ({
                id: sport.id,
                school_name: sport.school_name,
                level_name: sport.level_name,
                level_id: sport.level_id,
                sport: sport.sport,
                primaryId: sport.primaryId,
                basicId: sport.basicId,
                secondaryId: sport.secondaryId,
              }))
            } : undefined,
          }
        });

        successCount++;
        console.log(`  ✅ Migrated successfully`);
      } catch (error) {
        errorCount++;
        console.error(`  ❌ Error migrating ${school.name}:`, error);
      }
    }

    console.log('\n📊 Migration Summary:');
    console.log(`✅ Successfully migrated: ${successCount} schools`);
    console.log(`❌ Failed: ${errorCount} schools`);
    console.log(`📝 Total processed: ${oldSchools.length} schools\n`);

    console.log('🎉 Migration completed!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await oldPrisma.$disconnect();
    await newPrisma.$disconnect();
  }
}

// Run migration
migrateData();
