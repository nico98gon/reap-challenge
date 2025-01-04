import { Request, Response } from "express"
import { z } from "zod"

import { 
  getOrganizationsService,
  getOrganizationsWithFacilitiesService,
  createOrganizationService,
  updateOrganizationService,
  deleteOrganizationService, 
} from "./organization.service"
import {
  createOrganizationSchema,
  idSchema,
  updateOrganizationSchema
} from "./organization.validation"

export const getOrganizations = async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1
  try {
    const organizations = await getOrganizationsService(Number(page))
    res.json({ success: true, data: organizations })
  } catch (error) {
    res.status(500).json({ success: false, error: "Error fetching organizations" })
  }
}

export const getOrganizationsWithFacilities = async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1

  try {
    const result = await getOrganizationsWithFacilitiesService(page)
    res.json(result)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Error fetching organizations" })
  }
}

export const createOrganization = async (req: Request, res: Response) => {
  try {
    const validatedData = createOrganizationSchema.parse(req.body)

    const newOrganization = await createOrganizationService(validatedData)

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
}

export const updateOrganization = async (req: Request, res: Response) => {
  try {
    const id = idSchema.parse(req.params.id)
    const validatedData = updateOrganizationSchema.parse(req.body)

    const updatedOrganization = await updateOrganizationService(Number(id), validatedData)

    res.json(updatedOrganization)
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Validation error", details: error.errors })
    }

    if (error.message === 'Organization not found') {
      return res.status(404).json({ error: "Organization not found" })
    }

    console.error("Update Organization Error:", error)

    if (error.code === 'P2025') {
      return res.status(404).json({ error: "Organization not found" })
    }

    if (error.code === 'P2002') {
      return res.status(409).json({ error: "Conflict: Duplicate field value violates unique constraint" })
    }

    res.status(500).json({ error: "Error updating organization" })
  }
}

export const deleteOrganization = async (req: Request, res: Response) => {
  const { id } = req.params

  try {
    await deleteOrganizationService(Number(id))
    res.status(204).send()
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Error to delete organization" })
  }
}
