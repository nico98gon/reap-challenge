import { Request, Response } from "express"
import Boom from "@hapi/boom"
import { z } from "zod"

import {
  createFacilityService,
  deleteFacilityService,
  getFacilitiesService,
  updateFacilityService
} from "./facility.service"

import {
  createFacilitySchema,
  updateFacilitySchema,
  idSchema
} from "./facility.validation"

import { apiResponse, apiError } from "../../utils/response.utils"

export const getFacilities = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page) || 1
    const facilities = await getFacilitiesService(page)
    return apiResponse(res, facilities)
  } catch (error) {
    return apiError(res, Boom.internal("Error fetching facilities", { error }))
  }
}

export const createFacility = async (req: Request, res: Response) => {
  try {
    const validatedData = createFacilitySchema.parse(req.body)
    const newFacility = await createFacilityService(validatedData)
    return apiResponse(res, newFacility, true, 201)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return apiError(res, Boom.badRequest("Validation error", { details: error.errors }))
    }
    return apiError(res, Boom.internal("Error creating facility", { error }))
  }
}

export const updateFacility = async (req: Request, res: Response) => {
  try {
    const id = idSchema.parse(req.params.id)
    const validatedData = updateFacilitySchema.parse(req.body)
    const updatedFacility = await updateFacilityService(Number(id), validatedData)
    return apiResponse(res, updatedFacility)
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return apiError(res, Boom.badRequest("Validation error", { details: error.errors }))
    }
    if (error.message === "Facility not found" || error.code === "P2025") {
      return apiError(res, Boom.notFound("Facility not found"))
    }
    if (error.code === "P2002") {
      return apiError(res, Boom.conflict("Conflict: Duplicate field value violates unique constraint"))
    }
    return apiError(res, Boom.internal("Error updating facility", { error }))
  }
}

export const deleteFacility = async (req: Request, res: Response) => {
  try {
    const id = idSchema.parse(req.params.id)
    await deleteFacilityService(Number(id))
    return res.status(204).send()
  } catch (error) {
    if (error instanceof Error && error.message === "Facility not found") {
      return apiError(res, Boom.notFound("Facility not found"))
    }

    if (typeof error === "object" && error !== null && "code" in error) {
      if ((error as any).code === "P2025") {
        return apiError(res, Boom.notFound("Facility not found"))
      }
    }

    return apiError(res, Boom.internal("Error deleting facility", { error }))
  }
}