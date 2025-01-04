import { Request, Response } from "express"
import { z } from "zod"

import {
  getPccOrganizationsService,
  createPccOrganizationService,
  updatePccOrganizationService,
  deletePccOrganizationService,
} from "./pccConfiguration.service"
import {
  createPccOrganizationSchema,
  updatePccOrganizationSchema,
  idSchema,
} from "./pccConfiguration.validation"

export const getPccOrganizations = async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1
  try {
    const pccOrganizations = await getPccOrganizationsService(page)
    res.json({ success: true, data: pccOrganizations })
  } catch (error) {
    console.error("Error fetching PCC organizations:", error)
    res.status(500).json({ success: false, error: "Error fetching PCC organizations" })
  }
}

export const createPccOrganization = async (req: Request, res: Response) => {
  try {
    const validatedData = createPccOrganizationSchema.parse(req.body)

    const newPccOrganization = await createPccOrganizationService(validatedData)
    res.status(201).json(newPccOrganization)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: "Validation error",
        details: error.errors,
      })
    }
    console.error("Error creating PCC organization:", error)
    res.status(500).json({ error: "Error creating PCC organization" })
  }
}
export const updatePccOrganization = async (req: Request, res: Response) => {
  try {
    const id = idSchema.parse(Number(req.params.id))

    const validatedData = updatePccOrganizationSchema.parse(req.body)

    const updatedPccOrganization = await updatePccOrganizationService(id, validatedData)

    res.json({ success: true, data: updatedPccOrganization })
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: "Validation error",
        details: error.errors,
      })
    }

    console.error("Error updating PccOrganization:", error)
    res.status(500).json({
      success: false,
      error: "Error updating PccOrganization",
    })
  }
}


export const deletePccOrganization = async (req: Request, res: Response) => {
  const { id } = req.params

  try {
    await deletePccOrganizationService(Number(id))
    res.status(204).send()
  } catch (error) {
    console.error("Error deleting PCC organization:", error)
    res.status(500).json({ error: "Error deleting PCC organization" })
  }
}
