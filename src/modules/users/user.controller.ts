import { Request, Response } from "express"
import Boom from "@hapi/boom"
import { z } from "zod"

import {
  createUserService,
  deleteUserService,
  getUserByIdService,
  getUsersService,
  updateUserService
} from "./user.service"

import {
  createUserSchema,
  idSchema,
  updateUserSchema
} from "./user.validation"

import { apiResponse, apiError } from "../../utils/response.utils"

export const getUsers = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page) || 1
    const users = await getUsersService(page)
    return apiResponse(res, users)
  } catch (error) {
    return apiError(res, Boom.internal("Error fetching users", { error }))
  }
}

export const getUserById = async (req: Request, res: Response) => {
  try {
    const id = idSchema.parse(req.params.id)
    const user = await getUserByIdService(Number(id))
    if (!user) {
      throw Boom.notFound("User not found")
    }
    return apiResponse(res, { data: user })
  } catch (error) {
    return apiError(res, error)
  }
}

export const createUser = async (req: Request, res: Response) => {
  try {
    const validatedData = createUserSchema.parse(req.body)
    const newUser = await createUserService(validatedData)
    return apiResponse(res, newUser, true, 201)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return apiError(res, Boom.badRequest("Validation error", { details: error.errors }))
    }
    return apiError(res, Boom.internal("Error creating user", { error }))
  }
}

export const updateUser = async (req: Request, res: Response) => {
  try {
    const id = idSchema.parse(req.params.id)
    const validatedData = updateUserSchema.parse(req.body)
    const updatedUser = await updateUserService(Number(id), validatedData)
    return apiResponse(res, updatedUser)
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return apiError(res, Boom.badRequest("Validation error", { details: error.errors }))
    }
    if (error.message === "User not found" || error.code === "P2025") {
      return apiError(res, Boom.notFound("User not found"))
    }
    if (error.code === "P2002") {
      return apiError(res, Boom.conflict("Conflict: Duplicate field value violates unique constraint"))
    }
    return apiError(res, Boom.internal("Error updating user", { error }))
  }
}

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const id = idSchema.parse(req.params.id)
    await deleteUserService(Number(id))
    return res.status(204).send()
  } catch (error) {
    if (error instanceof Error && error.message === "User not found") {
      return apiError(res, Boom.notFound("User not found"))
    }

    if (typeof error === "object" && error !== null && "code" in error) {
      if ((error as any).code === "P2025") {
        return apiError(res, Boom.notFound("User not found"))
      }
    }

    return apiError(res, Boom.internal("Error deleting user", { error }))
  }
}