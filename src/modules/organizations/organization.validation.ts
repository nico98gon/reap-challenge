import { z } from "zod"

const facilitySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "The facility name is required")
    .max(23, "The facility name cannot exceed 23 characters"),
})

export const createOrganizationSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "The organization name is required")
    .max(23, "The organization name cannot exceed 23 characters"),
  facilities: z.array(facilitySchema).min(1, "At least one facility is required"),
  pcc_org_id: z.string().min(1, "The pcc_org_id is required"),
  pcc_org_uuid: z.string().min(1, "The pcc_org_uuid is required"),
})

export const updateOrganizationSchema = z.object({
  name: z
    .string()
    .trim()
    .max(23, "The organization name cannot exceed 23 characters")
    .optional(),
  facilities: z.array(facilitySchema).optional(),
  pcc_org_id: z.string().optional(),
  pcc_org_uuid: z.string().optional(),
})

export const idSchema = z.string().regex(/^\d+$/, "The ID must be a valid number")
