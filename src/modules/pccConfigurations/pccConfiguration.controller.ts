import { Request, Response } from "express"
import Boom from "@hapi/boom"
import { z } from "zod"

import {
  getPccOrganizationsService,
  createPccOrganizationService,
  updatePccOrganizationService,
  deletePccOrganizationService
} from "./pccConfiguration.service"

import {
  createPccOrganizationSchema,
  updatePccOrganizationSchema,
  idSchema
} from "./pccConfiguration.validation"

import { apiResponse, apiError } from "../../utils/response.utils"

export const getPccOrganizations = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page) || 1
    const pccOrganizations = await getPccOrganizationsService(page)
    return apiResponse(res, pccOrganizations)
  } catch (error) {
    return apiError(res, Boom.internal("Error fetching PCC organizations", { error }))
  }
}

export const createPccOrganization = async (req: Request, res: Response) => {
  try {
    const validatedData = createPccOrganizationSchema.parse(req.body)
    const newPccOrganization = await createPccOrganizationService(validatedData)
    return apiResponse(res, newPccOrganization, true, 201)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return apiError(res, Boom.badRequest("Validation error", { details: error.errors }))
    }
    return apiError(res, Boom.internal("Error creating PCC organization", { error }))
  }
}

export const updatePccOrganization = async (req: Request, res: Response) => {
  try {
    const id = idSchema.parse(req.params.id)
    const validatedData = updatePccOrganizationSchema.parse(req.body)
    const updatedPccOrganization = await updatePccOrganizationService(Number(id), validatedData)
    return apiResponse(res, updatedPccOrganization)
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return apiError(res, Boom.badRequest("Validation error", { details: error.errors }))
    }
    if (error.message === "PCC organization not found" || error.code === "P2025") {
      return apiError(res, Boom.notFound("PCC organization not found"))
    }
    if (error.code === "P2002") {
      return apiError(res, Boom.conflict("Conflict: Duplicate field value violates unique constraint"))
    }
    return apiError(res, Boom.internal("Error updating PCC organization", { error }))
  }
}

export const deletePccOrganization = async (req: Request, res: Response) => {
  try {
    const id = idSchema.parse(req.params.id)
    await deletePccOrganizationService(Number(id))
    return res.status(204).send()
  } catch (error) {
    if (error instanceof Error && error.message === "PCC organization not found") {
      return apiError(res, Boom.notFound("PCC organization not found"))
    }

    if (typeof error === "object" && error !== null && "code" in error) {
      if ((error as any).code === "P2025") {
        return apiError(res, Boom.notFound("PCC organization not found"))
      }
    }

    return apiError(res, Boom.internal("Error deleting PCC organization", { error }))
  }
}