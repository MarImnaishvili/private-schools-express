const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  try {
    const result = await prisma.$queryRaw`SHOW TABLES;`;
    console.log("Tables in schools database:", result);
  } catch (e) {
    console.error("Error connecting to database:", e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
