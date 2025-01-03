import { Router, Request, Response } from "express"
import { PrismaClient } from "@prisma/client"

const router = Router()
const prisma = new PrismaClient()

// Get all organizations
router.get("/organizations", async(req: Request, res: Response) => {
  const page = Number(req.query.page) || 1
  const limit = 10
  const offset = (page - 1) * limit

  try {
    const [organizations, totalOrganizations] = await Promise.all([
      prisma.organization.findMany({
        skip: offset,
        take: limit,
      }),
      prisma.organization.count(),
    ])

    res.json({
      data: organizations,
      currentPage: page,
      totalPages: Math.ceil(totalOrganizations / limit),
      totalOrganizations,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Error to get organizations" })
  }
})

// Get all organizations with facilities
router.get("/organizations-with-facilities", async(req: Request, res: Response) => {
  const page = Number(req.query.page) || 1
  const limit = 10
  const offset = (page - 1) * limit

  try {
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

    res.json({
      data: organizations,
      currentPage: page,
      totalPages: Math.ceil(totalOrganizations / limit),
      totalOrganizations,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Error to get organizations" })
  }
})

// Create a new organization
// @ts-ignore
router.post("/organizations", async(req: Request, res: Response) => {
  const { name, facilities } = req.body

  if (!name || !facilities || facilities.length === 0) {
    return res
      .status(400)
      .json({ error: "Name and at least one facility are required" })
  }

  const facilitiesValid = facilities.every((facility: { name: string }) => facility.name)
  if (!facilitiesValid) {
    return res
      .status(400)
      .json({ error: "Each facility must have a name" })
  }

  try {
    const newOrganization = await prisma.organization.create({
      data: {
        name,
        facilities: {
          create: facilities,
        },
      },
      include: {
        facilities: true,
      },
    })

    res.status(201).json(newOrganization)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Error to create organization" })
  }
})

// Update an organization
// @ts-ignore
router.put("/organizations/:id", async(req: Request, res: Response) => {
  const { id } = req.params
  const { name, facilities } = req.body

  if (!name && !facilities) {
    return res
      .status(400)
      .json({ error: "Name or facilities are required to update" })
  }

  try {
    const updatedOrganization = await prisma.organization.update({
      where: { id: Number(id) },
      data: {
        ...(name && { name }), // Update name if provided
        ...(facilities && {
          facilities: {
            deleteMany: {}, // Clear existing facilities
            create: facilities,
          },
        }),
      },
      include: {
        facilities: true,
      },
    })

    res.json(updatedOrganization)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Error to update organization" })
  }
})

// Delete an organization
router.delete("/organizations/:id", async (req: Request, res: Response) => {
  const { id } = req.params

  try {
    await prisma.facility.deleteMany({
      where: { organizationId: Number(id) },
    })

    await prisma.organization.delete({
      where: { id: Number(id) },
    })

    res.status(204).send()
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Error to delete organization" })
  }
})

export default router
