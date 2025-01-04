import { Request, Response } from "express"
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


export const getUsers = async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1

  try {
    const users = await getUsersService(page)
    res.json({ success: true, ...users })
  } catch (error) {
    console.error("Error fetching users:", error)
    res.status(500).json({ success: false, error: "Error fetching users" })
  }
}

export const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params

  try {
    const user = await getUserByIdService(Number(id))
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" })
    }
    res.json({ success: true, data: user })
  } catch (error) {
    console.error("Error fetching user by ID:", error)
    res.status(500).json({ success: false, error: "Error fetching user by ID" })
  }
}

export const createUser = async (req: Request, res: Response) => {
  try {
    const validatedData = createUserSchema.parse(req.body)

    const newUser = await createUserService(validatedData)
    res.status(201).json({ success: true, ...newUser })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: "Validation error",
        details: error.errors,
      })
    }
    console.error("Error creating user:", error)
    res.status(500).json({ success: false, error: "Error creating user" })
  }
}

export const updateUser = async (req: Request, res: Response) => {
  try {
    const id = idSchema.parse(Number(req.params.id))
    const validatedData = updateUserSchema.parse(req.body)

    const updatedUser = await updateUserService(id, validatedData)
    res.json({ success: true, ...updatedUser })
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: "Validation error",
        details: error.errors,
      })
    }
    console.error("Error updating user:", error)
    res.status(500).json({ success: false, error: "Error updating user" })
  }
}

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const id = idSchema.parse(Number(req.params.id))
    await deleteUserService(id)
    res.status(204).send()
  } catch (error) {
    console.error("Error deleting user:", error)
    res.status(500).json({ success: false, error: "Error deleting user" })
  }
}
