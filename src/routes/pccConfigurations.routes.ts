import { Router } from "express"

const router = Router()

router.get("/pccConfigurations", (req, res) => {
  res.send("pccConfigurations")
})

export default router