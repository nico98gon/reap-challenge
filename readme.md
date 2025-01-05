# Reap Challenge

## Description

This is a technical challenge to develop a RESTful API using Express, TypeScript, Prisma, and PostgreSQL. The system manages organizations, users, facilities, and configuration settings specific to each organization.

The project includes:

- **Backend**: API built with Express, TypeScript, and Prisma.
- **Frontend**: A basic admin interface built with Next.js and Tailwind CSS.

## Requirements

### Backend:

- API built with **Express**, **TypeScript**, **Prisma**, and **PostgreSQL**.
- Implemented models:
    - **Organization**: Contains the name of the organization.
    - **User**: Contains the user's email.
    - **Facility**: A user can have access to multiple facilities, and each facility belongs to an organization.
    - **PccConfiguration**: Each organization has one configuration with `pcc_org_id` and `pcc_org_uuid` fields.

### Additional Requirements:

- Routes to create and update the PCC configuration for an organization.
- Validation with **Zod** for create and update requests.
- Access control to ensure only authorized users can update an organization's PCC configuration.
- Serialization to prevent the exposure of sensitive data.
- **Full CRUD** implementation for at least one model.

## Installation

### Backend

1. Clone the repository:
    
    `git clone https://github.com/nico98gon/reap-challenge/tree/develop`
    `cd reap-challenge`
    
2. Install the dependencies:
    
    `npm install`
    
3. Configure the database in the `.env` file. Example configuration:
    
    POSTGRES_USER=your_user 
    POSTGRES_PASSWORD=your_password
    DATABASE_URL="postgresql://<POSTGRES_USER>:<POSTGRES_PASSWORD>@postgres:5432/reap-challenge?schema=public"
    NODE_ENV=local # The environment for backend
    PORT=4000
    PRISMA_SCHEMA_DISABLE_ADVISORY_LOCK=true # This allows running migrations in Docker
    
4. Create the database and run the migrations:
    
    **Using Docker**:
        
    - Build and run the containers:

        `docker compose build docker compose up -d`
        
    - Connect to the backend terminal:

        `docker exec -it backend bash`
        
    - Apply the Prisma migrations:

        `npx prisma migrate dev`
        
5. Verify the application is running correctly:

    `docker compose logs backend`
    
    **If not using Docker**:
    
    - Initialize Prisma and generate the Prisma client:

        `npx prisma generate`
        
    - Apply the migrations:

        `npx prisma migrate dev`

## Running the Seed Script

To create example data in the database, run:

`npx prisma db seed`

Make sure that both the Docker DB and backend containers are running before executing this command.

### Run Prisma Studio

To open Prisma Studio:

`npx prisma studio`

### Useful Commands

- **Create a migration with Prisma**:

    `npx prisma migrate dev --name init`

- **Build Docker with version**:

    `docker compose build -t reap-challenge:<version> .`

- **Run the app with Docker**:

    `docker compose up --build`

- **Connect to the Postgres DB terminal**:

    `docker exec -it postgres_db psql -U your_user -d reap_challenge`

- **Connect to the Backend terminal**:

    `docker exec -it backend bash`

- **Run the app**:

    `npx ts-node src/index.ts`

## Project Structure

The project is divided into the following main directories:

- **/src**: Contains the source code of the application.
    
    - **/config**: Prisma and other service configurations.
    - **/controllers**: Route controllers for models (e.g., organizations, users, facilities).
    - **/middlewares**: Custom middlewares (e.g., authentication, error handling).
    - **/models**: Prisma models.
    - **/modules**: Business logic and services for each domain (e.g., organizations, users, pccConfigurations).
    - **/tests**: Unit and integration tests.
    - **/utils**: Utility functions for handling async operations and standardized responses.
    - **/prisma**: Contains the Prisma schema and migrations.

## API Endpoints

- **GET /organizations**: Returns a list of organizations.
- **GET /organizations/:id**: Returns an organization by ID.
- **POST /organizations**: Creates a new organization.
- **PUT /organizations/:id**: Updates an existing organization.
- **DELETE /organizations/:id**: Deletes an organization.

- Postman team: https://app.getpostman.com/join-team?invite_code=0389ba1a43d2d0e65ee37582f0952a7a82fe604f17aa487839a8647ecba08845

## Bonus Features

- **Zod** validation for API requests.
- **Serializers** to prevent the exposure of sensitive data.
- **Access control** to ensure only authorized users can update the configurations of organizations.
- Full **CRUD** implementation for the `Organization` model.