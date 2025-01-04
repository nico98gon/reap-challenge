import prisma from "../../config/prismaClient"

export const getFacilitiesService = async (page: number) => {
  const limit = 10
  const offset = (page - 1) * limit

  const [facilities, totalFacilities] = await Promise.all([
    prisma.facility.findMany({
      skip: offset,
      take: limit,
      include: {
        organization: true,
      },
    }),
    prisma.facility.count(),
  ])

  return {
    data: facilities,
    currentPage: page,
    totalPages: Math.ceil(totalFacilities / limit),
    totalFacilities,
  }
}

export const createFacilityService = async (data: any) => {
  return await prisma.facility.create({
    data,
  })
}

export const updateFacilityService = async (id: number, data: { name?: string; organizationId?: number }) => {
  return prisma.facility.update({
    where: { id },
    data,
  })
}

export const deleteFacilityService = async (id: number) => {
  return await prisma.facility.delete({
    where: { id },
  })
}
