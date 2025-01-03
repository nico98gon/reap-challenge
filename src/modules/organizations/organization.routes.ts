import { Router } from "express"
import { createOrganization, deleteOrganization, getOrganizations, getOrganizationsWithFacilities, updateOrganization } from "./organization.controller"


const router = Router()

router.get("/organizations", getOrganizations)
router.get("/organizations-with-facilities", getOrganizationsWithFacilities)
// @ts-ignore
router.post("/organizations", createOrganization)
// @ts-ignore
router.put("/organizations/:id", updateOrganization)
router.delete("/organizations/:id", deleteOrganization)

export default router
