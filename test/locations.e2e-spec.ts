import { INestApplication } from '@nestjs/common';
const request = require('supertest');
import { setupE2EApp } from './test-helper';

describe('Locations (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await setupE2EApp();
  });

  afterAll(async () => {
    await app.close();
  });

  it('User Addresses: /users/me/addresses (POST & GET)', async () => {
    const postRes = await request(app.getHttpServer())
      .post('/users/me/addresses')
      .send({
        street: 'Rua do Cliente E2E',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01001-000',
        isDefault: true,
      })
      .expect(201);
    
    expect(postRes.body).toHaveProperty('id');
    expect(postRes.body.street).toBe('Rua do Cliente E2E');

    const getRes = await request(app.getHttpServer())
      .get('/users/me/addresses')
      .expect(200);
    
    expect(Array.isArray(getRes.body)).toBe(true);
    expect(getRes.body.length).toBeGreaterThan(0);
    const address = getRes.body.find((a: any) => a.id === postRes.body.id);
    expect(address).toBeDefined();
  });

  it('Restaurant Addresses: /restaurants/:id/addresses (POST & GET)', async () => {
    const postRes = await request(app.getHttpServer())
      .post('/restaurants/1/addresses')
      .send({
        street: 'Avenida do Restaurante E2E',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01310-000',
        isDefault: true,
      })
      .expect(201);
    
    expect(postRes.body).toHaveProperty('id');
    expect(postRes.body.street).toBe('Avenida do Restaurante E2E');

    const getRes = await request(app.getHttpServer())
      .get('/restaurants/1/addresses')
      .expect(200);
    
    expect(Array.isArray(getRes.body)).toBe(true);
    expect(getRes.body.length).toBeGreaterThan(0);
    const address = getRes.body.find((a: any) => a.id === postRes.body.id);
    expect(address).toBeDefined();
  });
});
