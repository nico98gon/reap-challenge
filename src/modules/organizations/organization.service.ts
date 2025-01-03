import { z } from "zod"

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
      },
    }),
    prisma.organization.count(),
  ])

  return {
    data: organizations,
    currentPage: page,
    totalPages: Math.ceil(totalOrganizations / limit),
    totalOrganizations,
  }
}


export const createOrganizationService = async (validatedData: z.infer<typeof createOrganizationSchema>) => {
  return await prisma.organization.create({
    data: {
      name: validatedData.name,
      facilities: {
        create: validatedData.facilities,
      },
    },
    include: {
      facilities: true,
    },
  })
}

export const updateOrganizationService = async (id: number, validatedData: any) => {
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
    },
    include: {
      facilities: true,
    },
  })
}

export const deleteOrganizationService = async (organizationId: number) => {
  await prisma.facility.deleteMany({
    where: { organizationId },
  })

  await prisma.organization.delete({
    where: { id: organizationId },
  })
}
