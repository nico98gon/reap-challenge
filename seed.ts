import { PrismaClient } from "@prisma/client"
import { z } from "zod"

const prisma = new PrismaClient()

const validateOrganizationData = (name: string, pccOrgId: string, pccOrgUuid: string) => {
  const organizationNameSchema = z.string().min(1).max(23)
  organizationNameSchema.parse(name)

  const pccOrgIdSchema = z.string().min(1)
  pccOrgIdSchema.parse(pccOrgId)

  const pccOrgUuidSchema = z.string().min(1)
  pccOrgUuidSchema.parse(pccOrgUuid)
}

const validateFacilityData = (name: string) => {
  const facilityNameSchema = z.string().min(1).max(23)
  facilityNameSchema.parse(name)
}

const validateUserData = (email: string, facilityIds: number[]) => {
  const userEmailSchema = z.string().email()
  userEmailSchema.parse(email)

  // Validar instalaciones
  const userFacilitiesSchema = z.array(z.number().int().positive()).min(1)
  userFacilitiesSchema.parse(facilityIds)
}

async function main() {
  console.log("Seeding the database...")

  const techCorpName = "TechCorp"
  const techCorpPccOrgId = "TECH-001"
  const techCorpPccOrgUuid = "uuid-techcorp"
  validateOrganizationData(techCorpName, techCorpPccOrgId, techCorpPccOrgUuid)

  const techCorp = await prisma.organization.create({
    data: {
      name: techCorpName,
      facilities: {
        create: [
          { name: "TechCorp HQ" },
          { name: "TechCorp R&D Center" },
        ],
      },
      pccConfig: {
        create: {
          pcc_org_id: techCorpPccOrgId,
          pcc_org_uuid: techCorpPccOrgUuid,
        },
      },
    },
    include: {
      facilities: true,
      pccConfig: true,
    },
  })

  const healthPlusName = "HealthPlus"
  const healthPlusPccOrgId = "HEALTH-001"
  const healthPlusPccOrgUuid = "uuid-healthplus"
  validateOrganizationData(healthPlusName, healthPlusPccOrgId, healthPlusPccOrgUuid)

  const healthPlus = await prisma.organization.create({
    data: {
      name: healthPlusName,
      facilities: {
        create: [
          { name: "HealthPlus Main Clinic" },
          { name: "HealthPlus Wellness Center" },
        ],
      },
      pccConfig: {
        create: {
          pcc_org_id: healthPlusPccOrgId,
          pcc_org_uuid: healthPlusPccOrgUuid,
        },
      },
    },
    include: {
      facilities: true,
      pccConfig: true,
    },
  })

  const ecoSolutionsName = "EcoSolutions"
  const ecoSolutionsPccOrgId = "ECO-001"
  const ecoSolutionsPccOrgUuid = "uuid-ecosolutions"
  validateOrganizationData(ecoSolutionsName, ecoSolutionsPccOrgId, ecoSolutionsPccOrgUuid)

  const ecoSolutions = await prisma.organization.create({
    data: {
      name: ecoSolutionsName,
      facilities: {
        create: [
          { name: "EcoSolutions HQ" },
          { name: "EcoSolutions Manufacturing Plant" },
        ],
      },
      pccConfig: {
        create: {
          pcc_org_id: ecoSolutionsPccOrgId,
          pcc_org_uuid: ecoSolutionsPccOrgUuid,
        },
      },
    },
    include: {
      facilities: true,
      pccConfig: true,
    },
  })

  const userAliceEmail = "alice.smith@techcorp.com"
  const userAliceFacilityIds = [techCorp.facilities[0].id]
  validateUserData(userAliceEmail, userAliceFacilityIds)

  const userAlice = await prisma.user.create({
    data: {
      email: userAliceEmail,
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

  const userBobEmail = "bob.jones@healthplus.com"
  const userBobFacilityIds = [healthPlus.facilities[1].id]
  validateUserData(userBobEmail, userBobFacilityIds)

  const userBob = await prisma.user.create({
    data: {
      email: userBobEmail,
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

  const userClaraEmail = "clara.adams@ecosolutions.com"
  const userClaraFacilityIds = [ecoSolutions.facilities[0].id, healthPlus.facilities[0].id]
  validateUserData(userClaraEmail, userClaraFacilityIds)

  const userClara = await prisma.user.create({
    data: {
      email: userClaraEmail,
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

  const userDanielEmail = "daniel.green@techcorp.com"
  const userDanielFacilityIds = [techCorp.facilities[1].id]
  validateUserData(userDanielEmail, userDanielFacilityIds)

  const userDaniel = await prisma.user.create({
    data: {
      email: userDanielEmail,
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

  const userEmilyEmail = "emily.rogers@ecosolutions.com"
  const userEmilyFacilityIds = [ecoSolutions.facilities[1].id, techCorp.facilities[0].id]
  validateUserData(userEmilyEmail, userEmilyFacilityIds)

  const userEmily = await prisma.user.create({
    data: {
      email: userEmilyEmail,
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
