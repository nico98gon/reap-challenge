import { Request, Response } from "express"
import { z } from "zod"

import { createFacilityService,
  deleteFacilityService,
  getFacilitiesService,
  updateFacilityService
} from "./facility.service"
import {
  createFacilitySchema,
  updateFacilitySchema,
  idSchema,
} from "./facility.validation"

export const getFacilities = async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1

  try {
    const facilities = await getFacilitiesService(page)
    res.json({ success: true, ...facilities })
  } catch (error) {
    console.error("Error fetching facilities:", error)
    res.status(500).json({ success: false, error: "Error fetching facilities" })
  }
}

export const createFacility = async (req: Request, res: Response) => {
  try {
    const validatedData = createFacilitySchema.parse(req.body)

    const newFacility = await createFacilityService(validatedData)
    res.status(201).json({ success: true, ...newFacility })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: "Validation error",
        details: error.errors,
      })
    }
    console.error("Error creating facility:", error)
    res.status(500).json({ success: false, error: "Error creating facility" })
  }
}

export const updateFacility = async (req: Request, res: Response) => {
  try {
    const id = idSchema.parse(Number(req.params.id))
    const validatedData = updateFacilitySchema.parse(req.body)

    const updatedFacility = await updateFacilityService(id, validatedData)
    res.json({ success: true, ...updatedFacility })
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: "Validation error",
        details: error.errors,
      })
    }
    console.error("Error updating facility:", error)
    res.status(500).json({ success: false, error: "Error updating facility" })
  }
}

export const deleteFacility = async (req: Request, res: Response) => {
  try {
    const id = idSchema.parse(Number(req.params.id))
    await deleteFacilityService(id)
    res.status(204).send()
  } catch (error) {
    console.error("Error deleting facility:", error)
    res.status(500).json({ success: false, error: "Error deleting facility" })
  }
}
