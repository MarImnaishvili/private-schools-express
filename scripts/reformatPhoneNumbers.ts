// Script to reformat all existing phone numbers in the database
// Run with: npx ts-node scripts/reformatPhoneNumbers.ts

import { PrismaClient } from "@prisma/client";
import { formatGeorgianPhoneNumber } from "../src/lib/phoneUtils";

const prisma = new PrismaClient();

async function reformatAllPhoneNumbers() {
  console.log("Starting phone number reformatting...\n");

  try {
    // Fetch all schools
    const schools = await prisma.schoolData.findMany({
      select: {
        id: true,
        phoneNumber1: true,
        phoneNumber2: true,
        phoneNumber3: true,
      },
    });

    console.log(`Found ${schools.length} schools to process\n`);

    let updatedCount = 0;
    let skippedCount = 0;

    for (const school of schools) {
      const updates: any = {};
      let hasChanges = false;

      // Format each phone number if it exists
      if (school.phoneNumber1) {
        const formatted = formatGeorgianPhoneNumber(school.phoneNumber1);
        if (formatted !== school.phoneNumber1) {
          updates.phoneNumber1 = formatted;
          hasChanges = true;
          console.log(`School ${school.id}:`);
          console.log(`  Phone 1: "${school.phoneNumber1}" → "${formatted}"`);
        }
      }

      if (school.phoneNumber2) {
        const formatted = formatGeorgianPhoneNumber(school.phoneNumber2);
        if (formatted !== school.phoneNumber2) {
          updates.phoneNumber2 = formatted;
          hasChanges = true;
          console.log(`School ${school.id}:`);
          console.log(`  Phone 2: "${school.phoneNumber2}" → "${formatted}"`);
        }
      }

      if (school.phoneNumber3) {
        const formatted = formatGeorgianPhoneNumber(school.phoneNumber3);
        if (formatted !== school.phoneNumber3) {
          updates.phoneNumber3 = formatted;
          hasChanges = true;
          console.log(`School ${school.id}:`);
          console.log(`  Phone 3: "${school.phoneNumber3}" → "${formatted}"`);
        }
      }

      // Update the school if there are changes
      if (hasChanges) {
        await prisma.schoolData.update({
          where: { id: school.id },
          data: updates,
        });
        updatedCount++;
      } else {
        skippedCount++;
      }
    }

    console.log("\n" + "=".repeat(50));
    console.log(`✅ Reformatting complete!`);
    console.log(`   - Updated: ${updatedCount} schools`);
    console.log(`   - Skipped (already formatted): ${skippedCount} schools`);
    console.log("=".repeat(50));
  } catch (error) {
    console.error("❌ Error reformatting phone numbers:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
reformatAllPhoneNumbers()
  .then(() => {
    console.log("\n✨ Script completed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n💥 Script failed:", error);
    process.exit(1);
  });
