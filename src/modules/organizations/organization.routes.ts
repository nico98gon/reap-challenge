import { Router } from "express"

import {
  createOrganization,
  deleteOrganization,
  getOrganizationById,
  getOrganizations,
  getOrganizationsWithFacilities,
  updateOrganization
} from "./organization.controller"
import { asyncHandler } from "../../utils/asyncHandler"


const router = Router()

router.get("/organizations", asyncHandler(getOrganizations))
router.get("/organizations-with-facilities", asyncHandler(getOrganizationsWithFacilities))
router.get("/organizations/:id", asyncHandler(getOrganizationById))
router.post("/organizations", asyncHandler(createOrganization))
router.put("/organizations/:id", asyncHandler(updateOrganization))
router.delete("/organizations/:id", asyncHandler(deleteOrganization))

export default router
