import express from "express"
import cors from "cors"

import organizationsRoutes from "./modules/organizations/organization.routes"
import usersRoutes from "./routes/users.routes"
import facilitiesRoutes from "./routes/facilities.routes"
import pccConfigurationsRoutes from "./routes/pccConfigurations.routes"
import { errorHandler } from "./middlewares/errorHandler"

const createApp = () => {
  const app = express()

  const corsOptions = process.env.NODE_ENV === "production"
    ? {
        origin: "https://yourdomain.com",
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
