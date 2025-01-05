import { Router } from "express"
import { createPccOrganization, deletePccOrganization, getPccOrganizations, updatePccOrganization } from "./pccConfiguration.controller"
import { asyncHandler } from "../../utils/asyncHandler"


const router = Router()

router.get("/pcc-configurations", asyncHandler(getPccOrganizations))
router.post("/pcc-configurations", asyncHandler(createPccOrganization))  
router.put("/pcc-configurations/:id", asyncHandler(updatePccOrganization))
router.delete("/pcc-configurations/:id", asyncHandler(deletePccOrganization))

export default router
