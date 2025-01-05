import { Router } from "express"

import { createFacility, deleteFacility, getFacilities, updateFacility } from "./facility.controller"
import { asyncHandler } from "../../utils/asyncHandler"


const router = Router()

router.get("/facilities", asyncHandler(getFacilities))
router.post("/facilities", asyncHandler(createFacility))
router.put("/facilities/:id", asyncHandler(updateFacility))
router.delete("/facilities/:id", asyncHandler(deleteFacility))

export default router
