import { Request, Response } from "express"
import Boom from "@hapi/boom"
import { z } from "zod"

import { 
  getOrganizationsService,
  getOrganizationsWithFacilitiesService,
  createOrganizationService,
  updateOrganizationService,
  deleteOrganizationService,
  getOrganizationByIdService 
} from "./organization.service"

import { 
  createOrganizationSchema, 
  idSchema, 
  updateOrganizationSchema 
} from "./organization.validation"

import { apiResponse, apiError } from "../../utils/response.utils"

export const getOrganizations = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page) || 1
    const organizations = await getOrganizationsService(page)
    return apiResponse(res, organizations)
  } catch (error) {
    return apiError(res, Boom.internal("Error fetching organizations", { error }))
  }
}

export const getOrganizationsWithFacilities = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page) || 1
    const organizations = await getOrganizationsWithFacilitiesService(page)
    return apiResponse(res, organizations)
  } catch (error) {
    return apiError(res, Boom.internal("Error fetching organizations with facilities", { error }))
  }
}

export const getOrganizationById = async (req: Request, res: Response) => {
  try {
    const id = idSchema.parse(req.params.id)
    const organization = await getOrganizationByIdService(Number(id))
    if (!organization) {
      throw Boom.notFound("Organization not found")
    }
    return apiResponse(res, { data: organization })
  } catch (error) {
    return apiError(res, error)
  }
}

export const createOrganization = async (req: Request, res: Response) => {
  try {
    const validatedData = createOrganizationSchema.parse(req.body)
    const newOrganization = await createOrganizationService(validatedData)
    return apiResponse(res, newOrganization, true, 201)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return apiError(res, Boom.badRequest("Validation error", { details: error.errors }))
    }
    return apiError(res, Boom.internal("Error creating organization", { error }))
  }
}

export const updateOrganization = async (req: Request, res: Response) => {
  try {
    const id = idSchema.parse(req.params.id)
    const validatedData = updateOrganizationSchema.parse(req.body)
    const updatedOrganization = await updateOrganizationService(Number(id), validatedData)
    return apiResponse(res, updatedOrganization)
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return apiError(res, Boom.badRequest("Validation error", { details: error.errors }))
    }
    if (error.message === "Organization not found" || error.code === "P2025") {
      return apiError(res, Boom.notFound("Organization not found"))
    }
    if (error.code === "P2002") {
      return apiError(res, Boom.conflict("Conflict: Duplicate field value violates unique constraint"))
    }
    return apiError(res, Boom.internal("Error updating organization", { error }))
  }
}

export const deleteOrganization = async (req: Request, res: Response) => {
  try {
    const id = idSchema.parse(req.params.id)
    await deleteOrganizationService(Number(id))
    return res.status(204).send()
  } catch (error) {
    if (error instanceof Error && error.message === "Organization not found") {
      return apiError(res, Boom.notFound("Organization not found"));
    }

    if (typeof error === "object" && error !== null && "code" in error) {
      if ((error as any).code === "P2025") {
        return apiError(res, Boom.notFound("Organization not found"))
      }
    }

    return apiError(res, Boom.internal("Error deleting organization", { error }))
  }
}
