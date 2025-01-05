import { Router } from "express"

import { createUser, deleteUser, getUserById, getUsers, updateUser } from "./user.controller"
import { asyncHandler } from "../../utils/asyncHandler"


const router = Router()

router.get("/users", asyncHandler(getUsers))
router.get("/users/:id", asyncHandler(getUserById))
router.post("/users", asyncHandler(createUser))
router.put("/users/:id", asyncHandler(updateUser))
router.delete("/users/:id", asyncHandler(deleteUser))

export default router
