import createApp from "./app"
import prisma from "./config/prismaClient"

const app = createApp()

const PORT = process.env.PORT || 4000

async function main() {
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
  })

  try {
    const organizations = await prisma.organization.findMany()
    console.log("Organizations: ", organizations)
  } catch (error) {
    console.error("Error connecting to the database:", error)
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
