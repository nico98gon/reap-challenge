import prisma from "../../config/prismaClient"

export const getUsersService = async (page: number) => {
  const limit = 9
  const offset = (page - 1) * limit

  const [users, totalUsers] = await Promise.all([
    prisma.user.findMany({
      skip: offset,
      take: limit,
      include: {
        facilities: {
          include: {
            facility: true,
          },
        },
      },
    }),
    prisma.user.count(),
  ])

  return {
    data: users,
    currentPage: page,
    totalPages: Math.ceil(totalUsers / limit),
    totalUsers,
  }
}

export const getUserByIdService = async (id: number) => {
  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      facilities: {
        include: {
          facility: true,
        },
      },
    },
  })

  if (!user) {
    return null
  }

  return {
    id: user.id,
    email: user.email,
    facilities: user.facilities.map((relation) => ({
      facilityId: relation.facility.id,
      facilityName: relation.facility.name,
    })),
  }
}

export const createUserService = async (data: any) => {
  return await prisma.user.create({
    data: {
      email: data.email,
      facilities: {
        create: data.facilities.map((facilityId: number) => ({
          facilityId,
        })),
      },
    },
    include: {
      facilities: true,
    },
  })
}

export const updateUserService = async (id: number, data: { email?: string; facilities?: number[] }) => {
  const updateData: any = { email: data.email }

  if (data.facilities) {
    updateData.facilities = {
      set: data.facilities.map((facilityId) => ({
        facilityId,
      })),
    }
  }

  return prisma.user.update({
    where: { id },
    data: updateData,
    include: {
      facilities: true,
    },
  })
}

export const deleteUserService = async (id: number) => {
  return await prisma.user.delete({
    where: { id },
  })
}
