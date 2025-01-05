import { z } from "zod"

export const createFacilitySchema = z.object({
  name: z.string().min(1, "Facility name is required"),
  organizationId: z.number().int().positive("Valid organization ID is required"),
})

export const updateFacilitySchema = z.object({
  name: z.string().optional(),
  organizationId: z.number().int().positive().optional(),
})

export const idSchema = z.number().int().positive()
