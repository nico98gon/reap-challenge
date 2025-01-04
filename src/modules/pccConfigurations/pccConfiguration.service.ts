import prisma from "../../config/prismaClient"

export const getPccOrganizationsService = async (page: number) => {
  const limit = 10
  const offset = (page - 1) * limit

  const [pccOrganizations, totalPccOrganizations] = await Promise.all([
    prisma.pccConfiguration.findMany({
      skip: offset,
      take: limit,
      include: {
        organization: true,
      },
    }),
    prisma.pccConfiguration.count(),
  ])

  return {
    data: pccOrganizations,
    currentPage: page,
    totalPages: Math.ceil(totalPccOrganizations / limit),
    totalPccOrganizations,
  }
}

export const createPccOrganizationService = async (data: any) => {
  return await prisma.pccConfiguration.create({
    data,
  })
}

export const updatePccOrganizationService = async (id: number, data: { pcc_org_id?: string; pcc_org_uuid?: string }) => {
  return prisma.pccConfiguration.update({
    where: { id },
    data,
  })
}

export const deletePccOrganizationService = async (id: number) => {
  return await prisma.pccConfiguration.delete({
    where: { id },
  })
}
