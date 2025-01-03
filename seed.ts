import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  console.log("Seeding the database...")

  const techCorp = await prisma.organization.create({
    data: {
      name: "TechCorp",
      facilities: {
        create: [
          { name: "TechCorp HQ" },
          { name: "TechCorp R&D Center" },
        ],
      },
      pccConfig: {
        create: {
          pcc_org_id: "TECH-001",
          pcc_org_uuid: "uuid-techcorp",
        },
      },
    },
    include: {
      facilities: true,
      pccConfig: true,
    },
  })

  const healthPlus = await prisma.organization.create({
    data: {
      name: "HealthPlus",
      facilities: {
        create: [
          { name: "HealthPlus Main Clinic" },
          { name: "HealthPlus Wellness Center" },
        ],
      },
      pccConfig: {
        create: {
          pcc_org_id: "HEALTH-001",
          pcc_org_uuid: "uuid-healthplus",
        },
      },
    },
    include: {
      facilities: true,
      pccConfig: true,
    },
  })

  const ecoSolutions = await prisma.organization.create({
    data: {
      name: "EcoSolutions",
      facilities: {
        create: [
          { name: "EcoSolutions HQ" },
          { name: "EcoSolutions Manufacturing Plant" },
        ],
      },
      pccConfig: {
        create: {
          pcc_org_id: "ECO-001",
          pcc_org_uuid: "uuid-ecosolutions",
        },
      },
    },
    include: {
      facilities: true,
      pccConfig: true,
    },
  })

  // Create Users with Facility Associations
  const userAlice = await prisma.user.create({
    data: {
      email: "alice.smith@techcorp.com",
      facilities: {
        create: [
          { facilityId: techCorp.facilities[0].id },
        ],
      },
    },
    include: {
      facilities: true,
    },
  })

  const userBob = await prisma.user.create({
    data: {
      email: "bob.jones@healthplus.com",
      facilities: {
        create: [
          { facilityId: healthPlus.facilities[1].id },
        ],
      },
    },
    include: {
      facilities: true,
    },
  })

  const userClara = await prisma.user.create({
    data: {
      email: "clara.adams@ecosolutions.com",
      facilities: {
        create: [
          { facilityId: ecoSolutions.facilities[0].id },
          { facilityId: healthPlus.facilities[0].id },
        ],
      },
    },
    include: {
      facilities: true,
    },
  })

  const userDaniel = await prisma.user.create({
    data: {
      email: "daniel.green@techcorp.com",
      facilities: {
        create: [
          { facilityId: techCorp.facilities[1].id },
        ],
      },
    },
    include: {
      facilities: true,
    },
  })

  const userEmily = await prisma.user.create({
    data: {
      email: "emily.rogers@ecosolutions.com",
      facilities: {
        create: [
          { facilityId: ecoSolutions.facilities[1].id },
          { facilityId: techCorp.facilities[0].id },
        ],
      },
    },
    include: {
      facilities: true,
    },
  })

  console.log({
    techCorp,
    healthPlus,
    ecoSolutions,
    userAlice,
    userBob,
    userClara,
    userDaniel,
    userEmily,
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
