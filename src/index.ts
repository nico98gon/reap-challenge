import express from "express"
import { PrismaClient } from "@prisma/client"
import cors from "cors"

import organizationsRoutes from "./routes/organizations.routes"
import usersRoutes from "./routes/users.routes"
import facilitiesRoutes from "./routes/facilities.routes"
import pccConfigurationsRoutes from "./routes/pccConfigurations.routes"
import { errorHandler } from "./middlewares/errorHandler"

const prisma = new PrismaClient()

const app = express()

if (process.env.NODE_ENV === "local") {
  const corsOptions = {
    origin: "*",
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type",
  }

  app.use(cors(corsOptions))

} else if (process.env.NODE_ENV === "production") {
  const corsOptions = {
    origin: "https://yourdomain.com",
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type",
  }

  app.use(cors(corsOptions))

} else if (process.env.NODE_ENV === "testing") {
  const corsOptions = {
    origin: "*",
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type",
  }
  app.use(cors(corsOptions))
}

app.use(express.json())

const api = "/api/v1"
app.use(api, organizationsRoutes)
app.use(api, usersRoutes)
app.use(api, facilitiesRoutes)
app.use(api, pccConfigurationsRoutes)

app.use(errorHandler)

async function main() {
  app.listen(4000, () => {
    console.log("Server listening on port 4000")
  })

  // DB connection
  const organizations = await prisma.organization.findMany()
  console.log("Organizations: ", organizations)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
