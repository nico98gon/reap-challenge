import { Router } from "express"
import { createUser, deleteUser, getUserById, getUsers, updateUser } from "./user.controller"


const router = Router()

router.get("/users", getUsers)
// @ts-ignore
router.get("/users/:id", getUserById)
// @ts-ignore
router.post("/user", createUser)
// @ts-ignore
router.put("/user/:id", updateUser)
router.delete("/user/:id", deleteUser)

export default router
