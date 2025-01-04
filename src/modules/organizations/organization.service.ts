import { z } from "zod"
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library"

import { createOrganizationSchema } from "./organization.validation"
import prisma from "../../config/prismaClient"


export const getOrganizationsService = async (page: number) => {
  const limit = 10
  const offset = (page - 1) * limit
  const organizations = await prisma.organization.findMany({ skip: offset, take: limit })
  return organizations
}

export const getOrganizationsWithFacilitiesService = async (page: number) => {
  const limit = 10
  const offset = (page - 1) * limit

  const [organizations, totalOrganizations] = await Promise.all([
    prisma.organization.findMany({
      skip: offset,
      take: limit,
      include: {
        facilities: true,
        pccConfig: true,
      },
    }),
    prisma.organization.count(),
  ])

  const formattedOrganizations = organizations.map((org) => ({
    id: org.id,
    name: org.name,
    facilities: org.facilities,
    pcc_org_id: org.pccConfig?.pcc_org_id || null,
    pcc_org_uuid: org.pccConfig?.pcc_org_uuid || null,
  }))

  return {
    data: formattedOrganizations,
    currentPage: page,
    totalPages: Math.ceil(totalOrganizations / limit),
    totalOrganizations,
  }
}


export const createOrganizationService = async (
  validatedData: z.infer<typeof createOrganizationSchema>
) => {
  try {
    return await prisma.organization.create({
      data: {
        name: validatedData.name,
        facilities: {
          create: validatedData.facilities,
        },
        pccConfig: {
          create: {
            pcc_org_id: validatedData.pcc_org_id,
            pcc_org_uuid: validatedData.pcc_org_uuid,
          },
        },
      },
      include: {
        facilities: true,
        pccConfig: true,
      },
    })
  } catch (error: any) {
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      throw new Error('An organization with this name already exists.')
    }
    console.error('Error creating organization:', error)
    throw error
  }
}

export const updateOrganizationService = async (id: number, validatedData: any) => {
  try {
    return await prisma.organization.update({
      where: { id },
      data: {
        ...(validatedData.name && { name: validatedData.name }),
        ...(validatedData.facilities && {
          facilities: {
            deleteMany: {},
            create: validatedData.facilities,
          },
        }),
        ...(validatedData.pcc_org_id && validatedData.pcc_org_uuid && {
          pccConfig: {
            upsert: {
              where: { organizationId: id },
              update: {
                pcc_org_id: validatedData.pcc_org_id,
                pcc_org_uuid: validatedData.pcc_org_uuid,
              },
              create: {
                organizationId: id,
                pcc_org_id: validatedData.pcc_org_id,
                pcc_org_uuid: validatedData.pcc_org_uuid,
              },
            },
          },
        }),
      },
      include: {
        facilities: true,
        pccConfig: true,
      },
    })
  } catch (error: any) {
    console.error("Error updating organization:", error)
    throw error
  }
}


export const deleteOrganizationService = async (organizationId: number) => {
  await prisma.facility.deleteMany({
    where: { organizationId },
  })

  await prisma.organization.delete({
    where: { id: organizationId },
  })
}
