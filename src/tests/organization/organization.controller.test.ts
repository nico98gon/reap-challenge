import request from 'supertest'
import app from '../../app'
import prisma from '../../config/prismaClient'

beforeAll(async () => {
  await prisma.$connect()
})

afterAll(async () => {
  await prisma.$disconnect()
})

describe('GET /organizations', () => {
  it('should return a list of organizations', async () => {
    const response = await request(app).get('/organizations')

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('data')
    expect(response.body.data).toBeInstanceOf(Array)
  })
})

describe('GET /organizations/:id', () => {
  it('should return an organization by ID', async () => {
    const organizationId = 1
    const response = await request(app).get(`/organizations/${organizationId}`)

    expect(response.status).toBe(200)
    expect(response.body.data).toHaveProperty('id', organizationId)
  })

  it('should return 404 if organization is not found', async () => {
    const response = await request(app).get('/organizations/999999')

    expect(response.status).toBe(404)
    expect(response.body).toHaveProperty('message', 'Organization not found')
  })
})

describe('POST /organizations', () => {
  it('should create a new organization', async () => {
    const newOrganization = {
      name: 'Test Organization',
      facilities: [{ name: 'Test Facility' }],
      pcc_org_id: 'pcc123',
      pcc_org_uuid: 'uuid123',
    }

    const response = await request(app)
      .post('/organizations')
      .send(newOrganization)

    expect(response.status).toBe(201)
    expect(response.body.data).toHaveProperty('name', newOrganization.name)
  })

  it('should return 400 for invalid data', async () => {
    const invalidData = {
      name: '',
      facilities: [],
      pcc_org_id: '',
      pcc_org_uuid: '',
    }

    const response = await request(app).post('/organizations').send(invalidData)

    expect(response.status).toBe(400)
    expect(response.body).toHaveProperty('message', 'Validation error')
  })
})

describe('PUT /organizations/:id', () => {
  it('should update an existing organization', async () => {
    const updatedData = {
      name: 'Updated Organization',
    }

    const response = await request(app)
      .put('/organizations/1')
      .send(updatedData)

    expect(response.status).toBe(200)
    expect(response.body.data).toHaveProperty('name', updatedData.name)
  })

  it('should return 404 if organization is not found', async () => {
    const updatedData = { name: 'Non-existent Organization' }
    const response = await request(app)
      .put('/organizations/999999')
      .send(updatedData)

    expect(response.status).toBe(404)
    expect(response.body).toHaveProperty('message', 'Organization not found')
  })
})

describe('DELETE /organizations/:id', () => {
  it('should delete an organization', async () => {
    const response = await request(app).delete('/organizations/1')

    expect(response.status).toBe(204)
  })

  it('should return 404 if organization is not found', async () => {
    const response = await request(app).delete('/organizations/999999')

    expect(response.status).toBe(404)
    expect(response.body).toHaveProperty('message', 'Organization not found')
  })
})
