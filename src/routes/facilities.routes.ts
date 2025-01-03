import { Router } from "express"

const router = Router()

router.get("/facilities", (req, res) => {
  res.send("Facilities")
})

export default router