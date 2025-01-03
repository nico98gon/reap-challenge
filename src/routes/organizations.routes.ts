import { Router, Request, Response } from "express"
import { PrismaClient } from "@prisma/client"
import { z } from "zod"

import { createOrganizationSchema, idSchema, updateOrganizationSchema } from "../validation/organization.validation"

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
router.post("/organizations", async (req: Request, res: Response) => {
  try {
    const validatedData = createOrganizationSchema.parse(req.body)

    const newOrganization = await prisma.organization.create({
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

    res.status(201).json(newOrganization)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: "Validation error",
        details: error.errors,
      })
    }
    console.error(error)
    res.status(500).json({ error: "Error creating organization" })
  }
})

// Update an organization
// @ts-ignore
router.put("/organizations/:id", async (req: Request, res: Response) => {
  try {
    const id = idSchema.parse(req.params.id)
    const validatedData = updateOrganizationSchema.parse(req.body)

    const updatedOrganization = await prisma.organization.update({
      where: { id: Number(id) },
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

    res.json(updatedOrganization)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors })
    }
    console.error(error)
    res.status(500).json({ error: "Error updating organization" })
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
