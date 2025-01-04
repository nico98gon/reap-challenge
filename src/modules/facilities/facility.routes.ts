import { Router } from "express"
import { createFacility, deleteFacility, getFacilities, updateFacility } from "./facility.controller"


const router = Router()

router.get("/facilities", getFacilities)
// @ts-ignore
router.post("/facility", createFacility)
// @ts-ignore
router.put("/facility/:id", updateFacility)
router.delete("/facility/:id", deleteFacility)

export default router
