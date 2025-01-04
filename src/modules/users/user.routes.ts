import { Router } from "express"
import { createFacility, deleteFacility, getFacilities, updateFacility } from "../facilities/facility.controller"


const router = Router()

router.get("/users", getFacilities)
// @ts-ignore
router.post("/user", createFacility)
// @ts-ignore
router.put("/user/:id", updateFacility)
router.delete("/user/:id", deleteFacility)

export default router
