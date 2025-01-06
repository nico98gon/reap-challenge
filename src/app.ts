import express from "express"
import cors from "cors"

import organizationsRoutes from "./modules/organizations/organization.routes"
import usersRoutes from "./modules/users/user.routes"
import facilitiesRoutes from "./modules/facilities/facility.routes"
import pccConfigurationsRoutes from "./modules/pccConfigurations/pccConfiguration.routes"
import { errorHandler } from "./middlewares/errorHandler"

const createApp = () => {
  const app = express()

  const corsOptions = process.env.NODE_ENV === "production"
    ? {
        origin: process.env.ORIGIN,
        methods: "GET,POST,PUT,DELETE",
        allowedHeaders: "Content-Type",
      }
    : {
        origin: "*",
        methods: "GET,POST,PUT,DELETE",
        allowedHeaders: "Content-Type",
      }

  app.use(cors(corsOptions))
  app.use(express.json())

  const api = "/api/v1"
  app.use(api, organizationsRoutes)
  app.use(api, usersRoutes)
  app.use(api, facilitiesRoutes)
  app.use(api, pccConfigurationsRoutes)

  app.use(errorHandler)

  return app
}

export default createApp
