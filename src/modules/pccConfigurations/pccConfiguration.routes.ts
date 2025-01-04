import { Router } from "express"
import { createPccOrganization, deletePccOrganization, getPccOrganizations, updatePccOrganization } from "./pccConfiguration.controller"


const router = Router()

router.get("/pcc-configurations", getPccOrganizations)
// @ts-ignore
router.post("/pcc-configurations", createPccOrganization)  
// @ts-ignore
router.put("/pcc-configurations/:id", updatePccOrganization)
router.delete("/pcc-configurations/:id", deletePccOrganization)

export default router
