import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const organizations = await prisma.organization.findMany();
  console.log(organizations);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
