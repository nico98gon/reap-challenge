import { z } from "zod"

export const createPccOrganizationSchema = z.object({
  pcc_org_id: z.string().min(1, "PCC organization ID is required"),
  pcc_org_uuid: z.string().min(1, "PCC organization UUID is required"),
  organizationId: z.number().int().positive("Valid organization ID is required"),
})

export const updatePccOrganizationSchema = z.object({
  pcc_org_id: z.string().optional(),
  pcc_org_uuid: z.string().optional(),
})

export const idSchema = z.number().int().positive()
