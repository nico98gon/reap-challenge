
## Run the app

  - First create the .env in the root of the repository, paste and complete the following variables:

    POSTGRES_USER=
    POSTGRES_PASSWORD=
    DATABASE_URL="postgresql://<POSTGRES_USER>:<POSTGRES_PASSWORD>@postgres:5432/reap-challenge?schema=public"

    NODE_ENV=local # This represent the enviroment you are going to run the backend
    PORT=

    PRISMA_SCHEMA_DISABLE_ADVISORY_LOCK=true # This allow run migrations in docker

  - Create a DB:
    - Connect to PostgresSQL container: `docker exec -it postgres_db psql -U your_user -d postgres`
    - Create a DB: `CREATE DATABASE reap_challenge;`
    - Quit: `\q`

  - Build and run the containers:
    - Build the images: `docker compose build`
    - Initialice the services: `docker compose up -d`

  - Connect to Backend terminal: `docker exec -it backend bash`
  - Prisma Migration: `npx prisma migrate dev`

  This is going to start the PosgtresSQL and backend containers.

  - Verify everithing is going good (optional): `docker-compose logs backend`

## If you are not going to use docker:

  - Initilice Prisma and migrations:
    - Generate the Prisma client: `npx prisma generate`
    - Migrate: `npx prisma migrate dev`

### Run the seed script

This will create a data example in the DB

  - Run the sript: `npx prisma db seed`

Remember that you should have docker DB and backend running to execute this command

### Run prisma studio

  - Run prisma studio: `npx prisma studio`

### useful commands:
  - Create a migration with prisma: `npx prisma migrate dev --name init`
  - Build docker with version: `docker compose build -t reap-challenge:<version> .`
  - Run the app with docker: `docker compose up --build`
  - Connect to Postgres DB terminal: `docker exec -it postgres_db psql -U nicogon -d reap_challenge`
  - Connect to Backend terminal: `docker exec -it backend bash`
  - Run the app: `npx ts-node src/index.ts`

### useful links

  - Postman team: https://app.getpostman.com/join-team?invite_code=0389ba1a43d2d0e65ee37582f0952a7a82fe604f17aa487839a8647ecba08845