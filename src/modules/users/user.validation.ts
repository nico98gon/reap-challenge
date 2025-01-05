import { z } from "zod"

export const createUserSchema = z.object({
  email: z.string().email("Invalid email address"),
  facilities: z.array(z.number().int().positive()).min(1, "At least one facility is required"),
})

export const updateUserSchema = z.object({
  email: z.string().email("Invalid email address").optional(),
  facilities: z.array(z.number().int().positive()).optional(),
})

export const idSchema = z.string().regex(/^\d+$/, "The ID must be a valid number")
